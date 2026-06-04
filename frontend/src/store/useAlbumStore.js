import { create } from 'zustand';
import { getEntityId } from '../utils/ids';

const API_BASE_URL = '/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

const normalizeItem = (item) => {
  if (!item || typeof item !== 'object') return item;
  const id = getEntityId(item);
  const normalized = { ...item, id };

  if (item.artistaId && typeof item.artistaId === 'object') {
    normalized.artistaId = {
      ...item.artistaId,
      id: getEntityId(item.artistaId),
    };
  }

  if (item.albumId && typeof item.albumId === 'object') {
    normalized.albumId = {
      ...item.albumId,
      id: getEntityId(item.albumId),
    };
  }

  return normalized;
};

const normalizeList = (list) => (Array.isArray(list) ? list.map(normalizeItem) : []);

export const useAlbumStore = create((set) => ({
  albuns: [],
  reviews: [],
  musicas: [],
  listas: [],
  artistas: [],
  loading: false,
  error: null,

  fetchDados: async () => {
    set({ loading: true, error: null });
    try {
      const [resAlbuns, resArtistas, resReviews, resMusicas, resListas] = await Promise.all([
        fetch(`${API_BASE_URL}/albuns`),
        fetch(`${API_BASE_URL}/artistas`),
        fetch(`${API_BASE_URL}/reviews`),
        fetch(`${API_BASE_URL}/musicas`),
        fetch(`${API_BASE_URL}/listas`),
      ]);

      if (!resAlbuns.ok || !resArtistas.ok || !resReviews.ok || !resMusicas.ok || !resListas.ok) {
        throw new Error('Erro ao carregar dados do servidor');
      }

      set({
        albuns: normalizeList(await resAlbuns.json()),
        artistas: normalizeList(await resArtistas.json()),
        reviews: normalizeList(await resReviews.json()),
        musicas: normalizeList(await resMusicas.json()),
        listas: normalizeList(await resListas.json()),
        loading: false,
      });
    } catch (error) {
      console.error('Erro ao carregar dados do servidor:', error);
      set({ error: error.message, loading: false });
    }
  },

  adicionarAlbum: async (novo) => {
    try {
      const res = await fetch(`${API_BASE_URL}/albuns`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(novo),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Erro ao adicionar álbum');
      }

      const data = normalizeItem(await res.json());
      set((state) => ({ albuns: [...state.albuns, data], error: null }));
      return data;
    } catch (error) {
      console.error('Erro ao adicionar álbum:', error);
      set({ error: error.message });
      throw error;
    }
  },

  removerAlbum: async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/albuns/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!res.ok) {
        throw new Error('Erro ao remover álbum');
      }

      set((state) => ({
        albuns: state.albuns.filter((a) => getEntityId(a) !== String(id)),
        error: null,
      }));
    } catch (error) {
      console.error('Erro ao remover álbum:', error);
      set({ error: error.message });
      throw error;
    }
  },

  atualizarAlbum: async (id, updates) => {
    try {
      const res = await fetch(`${API_BASE_URL}/albuns/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates),
      });

      if (!res.ok) {
        throw new Error('Erro ao atualizar álbum');
      }

      const data = normalizeItem(await res.json());
      set((state) => ({
        albuns: state.albuns.map((a) => (getEntityId(a) === String(id) ? data : a)),
        error: null,
      }));
      return data;
    } catch (error) {
      console.error('Erro ao atualizar álbum:', error);
      set({ error: error.message });
      throw error;
    }
  },

  adicionarArtista: async (novo) => {
    try {
      const res = await fetch(`${API_BASE_URL}/artistas`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(novo),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Erro ao adicionar artista');
      }

      const data = normalizeItem(await res.json());
      set((state) => ({ artistas: [...state.artistas, data], error: null }));
      return data;
    } catch (error) {
      console.error('Erro ao adicionar artista:', error);
      set({ error: error.message });
      throw error;
    }
  },

  adicionarLista: async (novaLista) => {
    try {
      const res = await fetch(`${API_BASE_URL}/listas`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(novaLista),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || (errorData.errors && errorData.errors[0]?.msg) || 'Erro ao criar lista');
      }

      const data = normalizeItem(await res.json());
      set((state) => ({ listas: [...state.listas, data], error: null }));
      return data;
    } catch (error) {
      console.error('Erro ao criar lista:', error);
      set({ error: error.message });
      throw error;
    }
  },

  adicionarReview: async (novaReview) => {
    try {
      const res = await fetch(`${API_BASE_URL}/reviews`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(novaReview),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.errors ? errorData.errors[0]?.msg : errorData.error || 'Erro ao adicionar avaliação');
      }

      const data = normalizeItem(await res.json());
      set((state) => ({ reviews: [data, ...state.reviews], error: null }));
      return data;
    } catch (error) {
      console.error('Erro ao adicionar avaliação:', error);
      set({ error: error.message });
      throw error;
    }
  },

  removerReview: async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/reviews/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Erro ao remover avaliação');
      }

      set((state) => ({
        reviews: state.reviews.filter((r) => getEntityId(r) !== String(id)),
        error: null,
      }));
    } catch (error) {
      console.error('Erro ao remover avaliação:', error);
      set({ error: error.message });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
  setError: (error) => set({ error }),
}));

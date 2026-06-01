import { create } from 'zustand';

const API_BASE_URL = '/api';

// Helper para adicionar token ao header
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

export const useAlbumStore = create((set) => ({
  albuns: [],
  reviews: [], // Agora são reviews da API, não avaliacoes do db.json
  musicas: [],
  listas: [],
  artistas: [],
  loading: false,
  error: null,

  fetchDados: async () => {
    set({ loading: true, error: null });
    try {
      // Busca paralela de albuns, artistas e reviews
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
        albuns: await resAlbuns.json(), 
        artistas: await resArtistas.json(),
        reviews: await resReviews.json(),
        musicas: await resMusicas.json(),
        listas: await resListas.json(),
        loading: false,
      });
    } catch (error) {
      console.error("Erro ao carregar dados do servidor:", error);
      set({ error: error.message, loading: false });
    }
  },

  // --- GESTÃO DE ÁLBUNS ---
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

      const data = await res.json();
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

      set((state) => ({ albuns: state.albuns.filter(a => a.id !== id), error: null }));
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

      const data = await res.json();
      set((state) => ({
        albuns: state.albuns.map(a => a.id === id ? data : a),
        error: null,
      }));
      return data;
    } catch (error) {
      console.error('Erro ao atualizar álbum:', error);
      set({ error: error.message });
      throw error;
    }
  },

  // --- GESTÃO DE ARTISTAS ---
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

      const data = await res.json();
      set((state) => ({ artistas: [...state.artistas, data], error: null }));
      return data;
    } catch (error) {
      console.error('Erro ao adicionar artista:', error);
      set({ error: error.message });
      throw error;
    }
  },

  // --- GESTÃO DE REVIEWS (AVALIAÇÕES) ---
  adicionarReview: async (novaReview) => {
    try {
      const res = await fetch(`${API_BASE_URL}/reviews`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(novaReview),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.errors ? errorData.errors[0]?.msg : 'Erro ao adicionar avaliação');
      }

      const data = await res.json();
      set((state) => ({ reviews: [...state.reviews, data], error: null }));
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

      set((state) => ({ reviews: state.reviews.filter(r => r.id !== id), error: null }));
    } catch (error) {
      console.error('Erro ao remover avaliação:', error);
      set({ error: error.message });
      throw error;
    }
  },

  // --- MÉTODOS DE UTILITÁRIO ---
  clearError: () => set({ error: null }),
  setError: (error) => set({ error }),
}));
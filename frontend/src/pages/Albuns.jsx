import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAlbumStore } from '../store/useAlbumStore';
import { Header } from '../components/Header/Header.jsx';
import { Rodape } from '../components/Rodape/Rodape';
// Importe o CSS da Home para garantir que as classes existam!
import './style/Home.css'; 

export function Albuns() {
  const { albuns, artistas, fetchDados, loading, error } = useAlbumStore();
  const [termo, setTermo] = useState('');
  const [filtro, setFiltro] = useState('');

  useEffect(() => {
    fetchDados();
  }, [fetchDados]);

  // Blindagem contra erro de leitura antes dos dados carregarem
  if (loading) return <div style={{ color: '#fff', textAlign: 'center', marginTop: '100px' }}>Carregando catálogo...</div>;
  if (error) return <div style={{ color: 'red', textAlign: 'center', marginTop: '100px' }}>Erro: {error}</div>;

  const listaSegura = Array.isArray(albuns) ? albuns : [];
  
  const resultados = listaSegura.filter(album => {
    const texto = termo.toLowerCase();
    const artista = artistas.find(art => art.id === album.artistaId || art.id === album.artistaId?.id);
    return (
      album.titulo?.toLowerCase().includes(texto) ||
      artista?.nome?.toLowerCase().includes(texto) ||
      (Array.isArray(album.generos) ? album.generos.join(', ').toLowerCase().includes(texto) : String(album.generos || '').toLowerCase().includes(texto))
    );
  }).filter(album => {
    if (!filtro) return true;
    return Array.isArray(album.generos) ? album.generos.includes(filtro) : String(album.generos || '').toLowerCase().includes(filtro.toLowerCase());
  });

  return (
    <div className="home-container">
      <Header />
      <div className="home-content-wrapper" style={{ paddingTop: '100px' }}>
        
        <h1 style={{ color: 'white', textAlign: 'center' }}>Catálogo de Álbuns 💿</h1>
        
        <div className="albuns-actions" style={{ marginBottom: '30px', display: 'flex', justifyContent: 'center', gap: '20px' }}>
          <input
            type="text"
            placeholder="Buscar álbum, artista ou gênero"
            value={termo}
            onChange={e => setTermo(e.target.value)}
            className="albuns-search"
          />
          <select className="albuns-filter" value={filtro} onChange={e => setFiltro(e.target.value)}>
            <option value="">Todos os gêneros</option>
            <option value="Pop">Pop</option>
            <option value="Rock">Rock</option>
            <option value="Jazz">Jazz</option>
          </select>
        </div>

        <div className="cards-busca">
          {resultados.length === 0 ? (
            <p style={{ color: '#ccc', textAlign: 'center' }}>Nenhum álbum encontrado.</p>
          ) : (
            resultados.map(album => {
              const artista = artistas.find(art => art.id === album.artistaId || art.id === album.artistaId?.id);
              return (
                <Link key={album.id} to={`/album/${album.id}`} className="album-card-link">
                  <div className="album-card-busca">
                    <img
                      src={album.capa?.startsWith('http') ? album.capa : `/${album.capa}`}
                      alt={album.titulo}
                      onError={(e) => { e.target.src = '/img/default-album.jpg'; }}
                    />
                    <div className="info-album">
                      <h3>{album.titulo}</h3>
                      <p>{artista?.nome || 'Artista desconhecido'}</p>
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>
      <Rodape />
    </div>
  );
}
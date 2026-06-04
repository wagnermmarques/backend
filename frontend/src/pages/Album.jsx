import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAlbumStore } from '../store/useAlbumStore';
import { Header } from '../components/Header/Header';
import { Rodape } from '../components/Rodape/Rodape';
import { Busca } from '../components/Busca/Busca';
import { findArtistaForAlbum, getEntityId, albumMatchesId } from '../utils/ids';
import { formatCapaUrl } from '../utils/format';
import './style/Album.css'; 

export function Album() {
  const { id } = useParams(); 
  const { albuns, artistas, musicas, fetchDados, loading } = useAlbumStore();
  const [termo, setTermo] = useState('');
  const [termoAtivo, setTermoAtivo] = useState('');

  useEffect(() => {
    fetchDados();
  }, [fetchDados]);

  useEffect(() => {
    if (termo === '') setTermoAtivo('');
  }, [termo]);

  const lidarComBusca = () => {
    setTermoAtivo(termo.trim());
  };

  const listaSegura = Array.isArray(albuns) ? albuns : [];
  const resultadosBusca = (termoAtivo.trim().length >= 2) 
    ? listaSegura.filter(a => {
        const termoLongo = termoAtivo.toLowerCase();
        const combinaTitulo = a.titulo?.toLowerCase().includes(termoLongo);
        const dadosArt = findArtistaForAlbum(artistas, a);
        const combinaArtista = dadosArt?.nome?.toLowerCase().includes(termoLongo);
        return combinaTitulo || combinaArtista;
      }) 
    : [];

  const albumAtual = albuns.find((a) => albumMatchesId(a, id));
  const artistaAtual = albumAtual ? findArtistaForAlbum(artistas, albumAtual) : null;
  const musicasDoAlbum = musicas.filter((m) => getEntityId(m.albumId) === String(id));

  if (loading && albuns.length === 0) {
    return <div className="carregando">Carregando dados...</div>;
  }

  if (!albumAtual && termoAtivo === '') {
    return (
      <div className="home-container">
        <Header />
        <p className="carregando" style={{ padding: '40px', textAlign: 'center' }}>
          Álbum não encontrado.
        </p>
        <Rodape />
      </div>
    );
  }

  return (
    <div className="home-container">
      <Header />
      
        <Busca valor={termo} aoMudar={setTermo} aoBuscar={lidarComBusca} />
     

      <div className="container3">
        
      {termoAtivo.length > 0 ? (
        <section className="resultados-container">
          <h2>Resultados para "{termoAtivo}"</h2>
          <div className="cards-busca">
            {resultadosBusca.map(res => (
              <Link to={`/album/${getEntityId(res)}`} key={getEntityId(res)} className="album-card-link" onClick={() => setTermoAtivo('')}>
                <div className="album-card-busca">
                  <div className="capa-container">
                      <img src={formatCapaUrl(res.capa)} alt={res.titulo} />
                  </div>
                  <div className="info-album">
                      <h3>{res.titulo}</h3>
                      <p>{findArtistaForAlbum(artistas, res)?.nome || 'Artista desconhecido'}</p>
                      <span className="data-lancamento">{res.data}</span>
                  </div>
                </div>
              </Link>
            ))}
            {resultadosBusca.length === 0 && <p className="sem-resultado">Nenhum resultado encontrado.</p>}
          </div>
        </section>
      ) : (
          <div className="review-card">
            <div className="album-header">
              <img src={formatCapaUrl(albumAtual.capa)} alt={albumAtual.titulo} className="album-cover" />

              <div className="album-details">
                <div className="tabela">
                  <h1 className="album-title">{albumAtual.titulo}</h1>
                  
                  <div className="global-rating">
                    <img src="/img/star.jpg" alt="Estrela" className="star-icon" />
                    <span className="rating-score">
                      {albumAtual.notaMedia || "4.5"} 
                      <span style={{ fontSize: '14px', opacity: 0.6, marginLeft: '8px' }}>
                        (Google Ratings)
                      </span>
                    </span>
                  </div>
                </div>

                <p className="album-artist">
                  por <Link to={`/artista/${getEntityId(artistaAtual)}`} className="artist-link">
                    <span className="artist-name">{artistaAtual?.nome || albumAtual.artista}</span>
                  </Link>
                </p>

                <div className="info">
                  <p>Publicado {albumAtual.data}</p>
                  <p>{musicasDoAlbum.length} Músicas</p>
                </div>    
                
                <div className="info2">
                  <p><strong>Gênero(s):</strong> {Array.isArray(albumAtual.generos) ? albumAtual.generos.join(', ') : albumAtual.generos}</p>
                  <p><strong>Gravadora:</strong> {albumAtual.gravadora}</p>
                </div>
              </div>
            </div>

            <div className="album">     
              {musicasDoAlbum.map((musica) => (
                <div key={getEntityId(musica)} className="musica">
                  <span className="numero">{musica.numero}</span>
                  <span className="titulo">{musica.titulo}</span>
                  <span className="tempo">{musica.tempo}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Rodape />
    </div>
  );
}
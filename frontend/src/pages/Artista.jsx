import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAlbumStore } from '../store/useAlbumStore';
import { Header } from '../components/Header/Header';
import { Rodape } from '../components/Rodape/Rodape';
import { Busca } from '../components/Busca/Busca';
import { CardAvaliacao } from '../components/CardAvaliacao/CardAvaliacao';
import { AlbumCard } from '../components/AlbumCard/AlbumCard';
import { albumMatchesArtista, getEntityId } from '../utils/ids';
import './style/Home.css'; 

export function Artista() {
  const { id } = useParams(); 
  const { albuns, artistas, reviews, fetchDados } = useAlbumStore();

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

  const artistaAtual = artistas.find((art) => getEntityId(art) === String(id));
  const albunsDoArtista = albuns.filter((a) => albumMatchesArtista(a, id));
  const avaliacoesDoArtista = reviews.filter(av => av.artist?.toLowerCase() === artistaAtual?.nome?.toLowerCase());

  const resultadosBusca = (termoAtivo.length >= 2) 
    ? albuns.filter(a => a.titulo?.toLowerCase().includes(termoAtivo.toLowerCase())) 
    : [];

  if (artistas.length === 0) return <div className="carregando">Carregando...</div>;
  if (!artistaAtual && termoAtivo === '') return <div className="erro">Artista não encontrado.</div>;

  return (
    <div className="artist-page">
      <Header />

      <main className="artist-main home-container">
        <Busca valor={termo} aoMudar={setTermo} aoBuscar={lidarComBusca} />

        <section className="artist-hero">
          <div className="artist-hero-inner">
            <div className="artist-image">
              <img src={artistaAtual?.foto ? `/${artistaAtual.foto}` : (artistaAtual ? `/img/${artistaAtual.id}.jpg` : '/img/user.jpg')} alt={artistaAtual?.nome} />
            </div>

            <div className="artist-meta">
              <h1 className="artist-name">{artistaAtual?.nome || 'Artista'}</h1>
              <p className="artist-sub">{albunsDoArtista.length} álbuns • {artistaAtual?.generos?.join(', ') || 'Gênero não informado'}</p>

              <div className="artist-actions">
                <button className="btn-bio">Biografia</button>
                <Link to={`/albuns?artista=${artistaAtual?.id}`} className="btn-ver-albuns">Ver discografia</Link>
              </div>

              <div className="artist-bio">
                <p>{artistaAtual?.bio || 'Biografia não disponível.'}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="artist-discography">
          <h2>Discografia</h2>
          <div className="resultados-container">
            <div className="cards-busca">
              {albunsDoArtista.length === 0 ? (
                <p>Sem álbuns cadastrados.</p>
              ) : (
                albunsDoArtista.map(album => (
                  <AlbumCard key={album.id} album={album} />
                ))
              )}
            </div>
          </div>
        </section>

        <section className="artist-reviews">
          <h2>Principais avaliações do artista</h2>
          <div className="reviews-list">
            {avaliacoesDoArtista.length > 0 ? (
              avaliacoesDoArtista.map(review => (
                <CardAvaliacao key={review.id || review._id} album={review.album} artist={review.artist} rating={review.rating} comment={review.comment} user={review.user} createdAt={review.createdAt} />
              ))
            ) : (
              <p>Nenhuma avaliação encontrada.</p>
            )}
          </div>
        </section>
      </main>

      <Rodape />
    </div>
  );
}
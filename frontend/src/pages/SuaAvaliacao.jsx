import React, { useState, useEffect } from 'react';
import { useAlbumStore } from '../store/useAlbumStore';
import { maskComment } from '../utils/masks';
import { isValidRating, isValidComment } from '../utils/validators';
import { Header } from '../components/Header/Header';
import { Rodape } from '../components/Rodape/Rodape';
import { CardAvaliacao } from '../components/CardAvaliacao/CardAvaliacao';
import './style/suaAvaliacao.css';

export function SuaAvaliacao() {
  const { albuns, artistas, reviews, fetchDados, adicionarReview } = useAlbumStore();
  const [albumSelecionado, setAlbumSelecionado] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comentario, setComentario] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  
  // Pegamos o usuário logado
  const user = JSON.parse(localStorage.getItem('authUser'));

  useEffect(() => {
    if (fetchDados) fetchDados();
  }, [fetchDados]);

  // Encontrar álbum e artista selecionados
  const albumAlvo = albumSelecionado 
    ? albuns.find(a => a.id === albumSelecionado || a._id === albumSelecionado)
    : albuns[0];
  
  const artistaAlvo = albumAlvo?.artistaId 
    ? (typeof albumAlvo.artistaId === 'object' ? albumAlvo.artistaId : 
       artistas.find(art => art.id === albumAlvo.artistaId || art._id === albumAlvo.artistaId))
    : null;

  const validateForm = () => {
    const newErrors = {};

    if (!albumAlvo) {
      newErrors.album = 'Selecione um álbum';
    }

    if (!isValidRating(rating)) {
      newErrors.rating = 'Selecione uma avaliação entre 1 e 5 estrelas';
    }

    if (comentario && !isValidComment(comentario)) {
      newErrors.comentario = 'Comentário não pode ter mais de 500 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const salvarReview = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setSuccess('');

    try {
      const novaReview = {
        album: albumAlvo.titulo,
        artist: artistaAlvo?.nome || 'Desconhecido',
        rating: rating,
        comment: comentario.trim() || ''
      };

      await adicionarReview(novaReview);
      
      setRating(5);
      setComentario('');
      setSuccess('Avaliação publicada com sucesso!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Erro ao salvar review:', error);
      setErrors({ form: 'Erro ao publicar avaliação. Verifique sua conexão.' });
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (fillCount) => {
    return (
      <div style={{ fontSize: '2rem', gap: '5px', display: 'flex', justifyContent: 'center' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            style={{
              cursor: 'pointer',
              color: star <= (hoverRating || rating) ? '#FFD700' : '#666',
              transition: 'color 0.2s',
              fontSize: '2.5rem'
            }}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="sua-avaliacao-page">
      <Header />
      
      <main className="container2">
        <section className="busca">
          <div className="barra">
            <input type="text" placeholder="Pesquisar álbuns, artistas, listas..." />
            <button type="submit">buscar</button>
          </div>
        </section>
      </main>

      <div className="container3">
        <div className="review-card">
          {success && (
            <div style={{ color: '#4CAF50', marginBottom: '15px', fontSize: '0.95rem', textAlign: 'center' }}>
              ✓ {success}
            </div>
          )}
          {errors.form && (
            <div style={{ color: '#ff6b6b', marginBottom: '15px', fontSize: '0.95rem', textAlign: 'center' }}>
              {errors.form}
            </div>
          )}

          <div className="album-header">
            {albumAlvo && (
              <>
                <img 
                  src={albumAlvo.capa?.startsWith('http') ? albumAlvo.capa : `/${albumAlvo.capa}`} 
                  alt="Capa" 
                  className="album-cover" 
                  onError={(e) => {e.target.src = '/img/default-album.jpg'}}
                />

                <div className="album-details">
                  <h1 className="album-title">{albumAlvo.titulo}</h1>
                  <p className="album-artist">por <span className="artist-name">{artistaAlvo?.nome || 'Artista desconhecido'}</span></p>

                  <div className="details-grid">
                    <div className="info-column">
                      <p>Publicado: {albumAlvo.data || 'Data não informada'}</p>
                      <p>Gêneros: {albumAlvo.generos?.join(', ') || 'Não informado'}</p>
                      <div className="userspace">
                        <img src={user?.avatar || "/img/user.jpg"} className="img3" alt="User" />
                        <h2 className="usuario">{user?.username || "usuário"}</h2>
                      </div>
                    </div>

                    <div className="info-column">
                      <div className="global-rating">
                        <span className="rating-score">⭐ Sua avaliação</span>
                      </div>
                      {errors.album && (
                        <span style={{ fontSize: '0.75rem', color: '#ff6b6b' }}>
                          {errors.album}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="review-input-area">
                    <label style={{ fontSize: '0.9rem', color: '#ccc', marginBottom: '10px', display: 'block' }}>
                      Sua Avaliação ({rating}/5 estrelas)
                    </label>
                    {renderStars(rating)}
                    {errors.rating && (
                      <span style={{ fontSize: '0.75rem', color: '#ff6b6b', display: 'block', marginTop: '5px', textAlign: 'center' }}>
                        {errors.rating}
                      </span>
                    )}

                    <label style={{ fontSize: '0.9rem', color: '#ccc', marginTop: '20px', marginBottom: '10px', display: 'block' }}>
                      Comentário ({comentario.length}/500)
                    </label>
                    <textarea 
                      className="comment-input" 
                      placeholder="Escreva uma avaliação (opcional)..."
                      value={comentario}
                      onChange={(e) => setComentario(maskComment(e.target.value))}
                      maxLength="500"
                      rows="4"
                      style={{ borderColor: errors.comentario ? '#ff6b6b' : 'inherit' }}
                    />
                    {errors.comentario && (
                      <span style={{ fontSize: '0.75rem', color: '#ff6b6b', display: 'block', marginTop: '3px' }}>
                        {errors.comentario}
                      </span>
                    )}

                    <button 
                      onClick={salvarReview} 
                      className="save-review-btn"
                      disabled={loading}
                      style={{ marginTop: '15px' }}
                    >
                      {loading ? 'Publicando...' : 'Publicar Avaliação'}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <section className="avaliações">
        <h2>Principais avaliações da semana</h2>
        <hr />
        <div className="cards">
          {/* Aqui listamos as avaliações globais do sistema */}
          {Array.isArray(reviews) && reviews.slice(0, 2).map(rev => (
             <CardAvaliacao key={rev.id || rev._id} {...rev} />
          ))}
        </div>
      </section>

      <Rodape />
    </div>
  );
}
import { useState } from 'react';
import { useAlbumStore } from '../../store/useAlbumStore';
import { findArtistaForAlbum, getEntityId } from '../../utils/ids';
import { formatCapaUrl } from '../../utils/format';
import { maskComment } from '../../utils/masks';
import { isValidRating, isValidComment } from '../../utils/validators';
import './Avaliacao.css';

export function Avaliacao({ aoFechar }) {
  const { albuns, artistas, adicionarReview } = useAlbumStore();
  const [pesquisa, setPesquisa] = useState('');
  const [albumSelecionado, setAlbumSelecionado] = useState(null);
  const [nota, setNota] = useState(0);
  const [comentario, setComentario] = useState('');
  const [favorito, setFavorito] = useState(false);
  const [feedback, setFeedback] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const resultados = albuns
    .filter((a) => a.titulo?.toLowerCase().includes(pesquisa.toLowerCase()))
    .sort((a, b) => a.titulo.localeCompare(b.titulo));

  const lidarComSalvar = async () => {
    if (!albumSelecionado) return;

    if (!isValidRating(nota)) {
      setErro('Selecione uma avaliação entre 1 e 5 estrelas');
      return;
    }

    if (comentario && !isValidComment(comentario)) {
      setErro('Comentário não pode ter mais de 500 caracteres');
      return;
    }

    const artistaInfo = findArtistaForAlbum(artistas, albumSelecionado);

    setLoading(true);
    setErro('');

    try {
      await adicionarReview({
        album: albumSelecionado.titulo,
        artist: artistaInfo?.nome || 'Desconhecido',
        rating: nota,
        comment: comentario.trim(),
      });

      setFeedback(true);
      setTimeout(() => aoFechar(), 2000);
    } catch (error) {
      setErro(error.message || 'Erro ao salvar avaliação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={aoFechar}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        {feedback ? (
          <div className="tela-feedback">
            <div className="feedback-content">
              <div className="check-icon">✓</div>
              <p>Avaliação salva em seu perfil</p>
            </div>
          </div>
        ) : (
          <>
            {!albumSelecionado ? (
              <div className="tela-log">
                <div className="modal-header">
                  <span>Avaliar</span>
                  <button type="button" className="close-x" onClick={aoFechar}>×</button>
                </div>
                <div className="busca-corpo">
                  <input
                    type="text"
                    autoFocus
                    value={pesquisa}
                    onChange={(e) => setPesquisa(e.target.value)}
                    placeholder="Busque por um álbum..."
                  />
                  <div className="resultados-container">
                    {pesquisa &&
                      resultados.map((album) => {
                        const artistaInfo = findArtistaForAlbum(artistas, album);
                        return (
                          <div
                            key={getEntityId(album)}
                            className="item-resultado"
                            onClick={() => setAlbumSelecionado(album)}
                            onKeyDown={(e) => e.key === 'Enter' && setAlbumSelecionado(album)}
                            role="button"
                            tabIndex={0}
                          >
                            <img src={formatCapaUrl(album.capa)} alt="capa" />
                            <div className="item-info">
                              <strong>{album.titulo}</strong>
                              <span className="res-artista">{artistaInfo?.nome || 'Artista desconhecido'}</span>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="tela-form">
                <div
                  className="fundo-blur"
                  style={{ backgroundImage: `url(${formatCapaUrl(albumSelecionado.capa)})` }}
                />
                <div className="form-conteudo">
                  <div className="form-header">
                    <button type="button" className="btn-voltar" onClick={() => setAlbumSelecionado(null)}>
                      ⭠
                    </button>
                    <button type="button" className="btn-fechar" onClick={aoFechar}>×</button>
                  </div>

                  <div className="form-grid">
                    <img src={formatCapaUrl(albumSelecionado.capa)} className="capa-grande" alt="Capa" />

                    <div className="form-inputs">
                      <h2>
                        {albumSelecionado.titulo}{' '}
                        <small>{albumSelecionado.data?.split?.(',')?.[1]?.trim() || ''}</small>
                      </h2>

                      <span className="artista-destaque">
                        {findArtistaForAlbum(artistas, albumSelecionado)?.nome || 'Artista desconhecido'}
                      </span>

                      <div className="opcoes-rapidas">
                        <label>
                          <input type="checkbox" readOnly tabIndex={-1} /> Ouvi em {new Date().toLocaleDateString()}
                        </label>
                        <label>
                          <input type="checkbox" checked={favorito} onChange={() => setFavorito(!favorito)} /> Curtir
                        </label>
                      </div>

                      <textarea
                        placeholder="Adicionar avaliação..."
                        value={comentario}
                        onChange={(e) => setComentario(maskComment(e.target.value))}
                        maxLength={500}
                      />

                      <div className="rating-footer">
                        <div className="star-box">
                          <label>Avaliação</label>
                          <div className="estrelas">
                            {[1, 2, 3, 4, 5].map((n) => (
                              <span
                                key={n}
                                role="button"
                                tabIndex={0}
                                onClick={() => setNota(n)}
                                onKeyDown={(e) => e.key === 'Enter' && setNota(n)}
                                className={n <= nota ? 'active' : ''}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {erro && <p style={{ color: '#c0392b', fontSize: '0.9rem' }}>{erro}</p>}

                      <button
                        type="button"
                        className="save-btn"
                        onClick={lidarComSalvar}
                        disabled={loading || nota < 1}
                      >
                        {loading ? 'salvando...' : 'salvar'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

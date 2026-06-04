import { useState } from 'react';
import { useAlbumStore } from '../../store/useAlbumStore';
import { getEntityId } from '../../utils/ids';
import './CardAvaliacao.css';

export function CardAvaliacao({ id, _id, album, artist, rating, comment, user, createdAt }) {
  const [loading, setLoading] = useState(false);
  const { removerReview } = useAlbumStore();
  const currentUser = JSON.parse(localStorage.getItem('authUser') || 'null');
  const reviewId = getEntityId({ id, _id });

  const isAuthor = currentUser && user && (
    getEntityId(currentUser) === getEntityId(user) ||
    currentUser.username === user.username
  );

  const handleDelete = async () => {
    if (!window.confirm('Tem certeza que deseja deletar esta avaliação?')) {
      return;
    }

    setLoading(true);
    try {
      await removerReview(reviewId);
    } catch (error) {
      console.error('Erro ao deletar avaliação:', error);
      alert('Erro ao deletar avaliação');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    let stars = '';
    for (let i = 0; i < fullStars; i++) {
      stars += '★';
    }
    for (let i = fullStars; i < 5; i++) {
      stars += '☆';
    }
    return stars;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Data não informada';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
      });
    } catch {
      return 'Data inválida';
    }
  };

  return (
    <div className="avCT">
      <div className="review-header">
        <div className="user-info">
          <img 
            src={user?.avatar || "/img/user.jpg"} 
            className="img2 user-avatar" 
            alt="User"
            onError={(e) => {e.target.src = '/img/user.jpg'}}
          />
          <div className="user-details">
            <span className="usuario">{user?.username || user?.name || 'Usuário desconhecido'}</span>
            <div className="stars">{renderStars(rating)}</div>
          </div>
        </div>
        {isAuthor && (
          <button 
            className="btn-delete-review"
            onClick={handleDelete}
            disabled={loading}
            title="Deletar esta avaliação"
          >
            {loading ? '...' : '✕'}
          </button>
        )}
      </div>

      <div className="review-content">
        <div className="album-info">
          <strong>{album}</strong>
          <span className="artist">{artist}</span>
        </div>
        
        {comment && (
          <p className="comentario">{comment}</p>
        )}
        
        <span className="data">
          Avaliado em: {formatDate(createdAt)}
        </span>
      </div>
    </div>
  );
}
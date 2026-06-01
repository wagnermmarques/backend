import React from 'react';
import { Link } from 'react-router-dom';
import styles from './AlbumCard.module.css';

export function AlbumCard({ album }) {
  const capa = album?.capa?.startsWith('http') ? album.capa : `/${album.capa}`;
  return (
    <Link key={album.id} to={`/album/${album.id}`} className={styles.albumCard}>
      <div className={styles.capa}>
        <img src={capa} alt={album.titulo} />
      </div>
      <div className={styles.info}>
        <h3>{album.titulo}</h3>
        <p className="data-lancamento">{album.data || ''}</p>
      </div>
    </Link>
  );
}

export default AlbumCard;

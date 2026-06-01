import { Header } from '../components/Header/Header.jsx';
import { useAlbumStore } from '../store/useAlbumStore';
import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import './style/Generos.css';

export function Generos() {
  const { albuns, fetchDados } = useAlbumStore();

  useEffect(() => {
    fetchDados();
  }, [fetchDados]);

  const generos = useMemo(() => {
    const set = new Set();
    albuns.forEach(a => {
      if (Array.isArray(a.generos)) a.generos.forEach(g => set.add(g));
      else if (a.generos) set.add(String(a.generos));
    });
    return Array.from(set).sort();
  }, [albuns]);

  return (
    <div className="generos-page">
      <Header />
      <div className="generos-container">
        <h1>Gêneros</h1>
        <div className="generos-grid">
          {generos.length === 0 ? (
            <p>Nenhum gênero disponível.</p>
          ) : (
            generos.map(g => (
              <Link to={`/albuns?genero=${encodeURIComponent(g)}`} key={g} className="genero-card">
                <div className="genero-card-body">
                  <h3>{g}</h3>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

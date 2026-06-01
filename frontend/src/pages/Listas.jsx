import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAlbumStore } from '../store/useAlbumStore';
import { Header } from '../components/Header/Header.jsx';
import './style/Listas.css';

export function Listas() {
  const { listas, fetchDados } = useAlbumStore();
  const [termo, setTermo] = useState('');

  useEffect(() => {
    fetchDados();
  }, [fetchDados]);

  const resultados = listas.filter(lista => {
    const texto = termo.toLowerCase();
    return (
      lista.titulo?.toLowerCase().includes(texto) ||
      lista.descricao?.toLowerCase().includes(texto)
    );
  });

  return (
    <div className="listas-page">
      <Header />
      <div className="listas-header">
        <h1>Minhas Listas 📋</h1>
        <div className="listas-search">
          <input
            type="text"
            placeholder="Buscar listas"
            value={termo}
            onChange={(e) => setTermo(e.target.value)}
          />
        </div>
      </div>
      <div className="listas-grid">
        {resultados.length === 0 ? (
          <div className="listas-empty">Nenhuma lista encontrada.</div>
        ) : (
          resultados.map((lista) => (
            <div key={lista.id} className="lista-card">
              <img src={lista.capa?.startsWith('http') ? lista.capa : `/${lista.capa}`} alt={lista.titulo} />
              <div className="lista-card-body">
                <h2>{lista.titulo}</h2>
                <p>{lista.descricao || 'Sem descrição'}</p>
                <span>{Array.isArray(lista.itens) ? `${lista.itens.length} itens` : '0 itens'}</span>
                <Link to="/listas" className="lista-link">Abrir lista</Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
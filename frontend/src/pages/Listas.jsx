import { useEffect, useState } from 'react';
import { useAlbumStore } from '../store/useAlbumStore';
import { Header } from '../components/Header/Header.jsx';
import { maskAlbumTitle, maskBio } from '../utils/masks';
import { getEntityId } from '../utils/ids';
import { formatCapaUrl } from '../utils/format';
import './style/Listas.css';

export function Listas() {
  const { listas, fetchDados, adicionarLista } = useAlbumStore();
  const [termo, setTermo] = useState('');
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState('');

  const authUser = JSON.parse(localStorage.getItem('authUser') || '{}');
  const meuId = getEntityId(authUser);

  useEffect(() => {
    fetchDados();
  }, [fetchDados]);

  useEffect(() => {
    if (!mensagem) return undefined;
    const t = setTimeout(() => setMensagem(''), 3000);
    return () => clearTimeout(t);
  }, [mensagem]);

  const minhasListas = meuId
    ? listas.filter((lista) => getEntityId(lista.usuarioId) === meuId)
    : [];

  const resultados = minhasListas.filter((lista) => {
    const texto = termo.toLowerCase();
    return (
      lista.titulo?.toLowerCase().includes(texto) ||
      lista.descricao?.toLowerCase().includes(texto)
    );
  });

  const handleCriarLista = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!titulo.trim()) newErrors.titulo = 'Título é obrigatório';
    setErrors(newErrors);
    if (Object.keys(newErrors).length) return;

    setLoading(true);
    try {
      await adicionarLista({
        titulo: titulo.trim(),
        descricao: descricao.trim(),
      });
      setTitulo('');
      setDescricao('');
      setMensagem('Lista criada com sucesso!');
    } catch (error) {
      setErrors({ form: error.message });
    } finally {
      setLoading(false);
    }
  };

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

      <form className="listas-form" onSubmit={handleCriarLista}>
        {mensagem && <p className="listas-msg-sucesso">{mensagem}</p>}
        {errors.form && <p className="listas-msg-erro">{errors.form}</p>}
        <input
          type="text"
          placeholder="Título da nova lista"
          value={titulo}
          onChange={(e) => setTitulo(maskAlbumTitle(e.target.value))}
          maxLength={100}
        />
        {errors.titulo && <span className="listas-field-erro">{errors.titulo}</span>}
        <textarea
          placeholder="Descrição (opcional)"
          value={descricao}
          onChange={(e) => setDescricao(maskBio(e.target.value))}
          maxLength={500}
          rows={2}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Criando...' : 'Criar lista'}
        </button>
      </form>

      <div className="listas-grid">
        {resultados.length === 0 ? (
          <div className="listas-empty">Nenhuma lista encontrada.</div>
        ) : (
          resultados.map((lista) => (
            <div key={getEntityId(lista)} className="lista-card">
              <img src={formatCapaUrl(lista.capa, '/img/default-list.jpg')} alt={lista.titulo} />
              <div className="lista-card-body">
                <h2>{lista.titulo}</h2>
                <p>{lista.descricao || 'Sem descrição'}</p>
                <span>{Array.isArray(lista.itens) ? `${lista.itens.length} itens` : '0 itens'}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

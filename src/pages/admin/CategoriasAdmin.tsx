import { useEffect, useState } from 'react';
import { api } from '../../services/api';

interface Categoria {
  id: number;
  name: string;
  description: string;
  active: boolean;
}

export function CategoriasAdmin() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '', active: true });
  const [error, setError] = useState('');

  const fetchCategorias = async () => {
    try {
      const res = await api.get('/categorias');
      setCategorias(res.data);
    } catch {
      setError('Erro ao carregar categorias');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/categorias/${editingId}`, {
          name: formData.name,
          description: formData.description,
          active: formData.active,
        });
      } else {
        await api.post('/categorias', {
          name: formData.name,
          description: formData.description,
        });
      }
      setEditingId(null);
      setFormData({ name: '', description: '', active: true });
      fetchCategorias();
    } catch {
      setError('Erro ao salvar categoria');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta categoria?')) {
      try {
        await api.delete(`/categorias/${id}`);
        fetchCategorias();
      } catch {
        setError('Erro ao excluir categoria');
      }
    }
  };

  const handleEdit = (categoria: Categoria) => {
    setEditingId(categoria.id);
    setFormData({
      name: categoria.name,
      description: categoria.description || '',
      active: categoria.active,
    });
  };

  if (loading) return <div className="text-gray-600">Carregando categorias...</div>;

  return (
    <div>
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Formulário */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
        <h3 className="font-semibold text-amber-800 mb-3">
          {editingId ? '✏️ Editar Categoria' : '➕ Nova Categoria'}
        </h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Nome da categoria"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-amber-500"
            required
          />
          <input
            type="text"
            placeholder="Descrição (opcional)"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
          <label className="flex items-center gap-2 col-span-full md:col-span-1">
            <input
              type="checkbox"
              checked={formData.active}
              onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              className="rounded"
            />
            <span className="text-gray-700">Ativo</span>
          </label>
          <div className="flex gap-2 col-span-full">
            <button
              type="submit"
              className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition"
            >
              {editingId ? 'Atualizar' : 'Criar'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setFormData({ name: '', description: '', active: true });
                }}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg transition"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Tabela */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-amber-50 text-amber-800 border-b border-amber-200">
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Nome</th>
              <th className="p-3 text-left">Descrição</th>
              <th className="p-3 text-left">Ativo</th>
              <th className="p-3 text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map((cat) => (
              <tr key={cat.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                <td className="p-3 font-mono text-sm">{cat.id}</td>
                <td className="p-3 font-medium">{cat.name}</td>
                <td className="p-3 text-gray-600">{cat.description || '—'}</td>
                <td className="p-3">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      cat.active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {cat.active ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td className="p-3 space-x-2">
                  <button
                    onClick={() => handleEdit(cat)}
                    className="text-blue-600 hover:text-blue-800 transition"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="text-red-600 hover:text-red-800 transition"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {categorias.length === 0 && (
          <div className="text-center py-8 text-gray-500">Nenhuma categoria cadastrada.</div>
        )}
      </div>
    </div>
  );
}
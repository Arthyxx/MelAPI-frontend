import { useEffect, useState } from 'react';
import { api } from '../../services/api';

interface Produto {
  id: number;
  name: string;
  price: number;
  stockQuantity: number;
  description?: string;
  imageUrl?: string;
  active: boolean;
  category: { id: number; name: string };
}

interface Categoria {
  id: number;
  name: string;
}

export function ProdutosAdmin() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stockQuantity: '',
    categoryId: '',
    imageUrl: '',
    active: true,
  });
  const [error, setError] = useState('');

  const fetchProdutos = async () => {
    const res = await api.get('/produtos');
    setProdutos(res.data.content || res.data);
    setLoading(false);
  };
  const fetchCategorias = async () => {
    const res = await api.get('/categorias');
    setCategorias(res.data);
  };

  useEffect(() => {
    fetchProdutos();
    fetchCategorias();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        stockQuantity: parseInt(formData.stockQuantity),
        categoryId: parseInt(formData.categoryId),
        imageUrl: formData.imageUrl || undefined,
        active: formData.active,
      };
      if (editingId) {
        await api.put(`/produtos/${editingId}`, payload);
      } else {
        await api.post('/produtos', payload);
      }
      setEditingId(null);
      setFormData({
        name: '', description: '', price: '', stockQuantity: '', categoryId: '', imageUrl: '', active: true,
      });
      fetchProdutos();
    } catch {
      setError('Erro ao salvar produto');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Excluir este produto?')) {
      await api.delete(`/produtos/${id}`);
      fetchProdutos();
    }
  };

  const handleEdit = (p: Produto) => {
    setEditingId(p.id);
    setFormData({
      name: p.name,
      description: p.description || '',
      price: p.price.toString(),
      stockQuantity: p.stockQuantity.toString(),
      categoryId: p.category.id.toString(),
      imageUrl: p.imageUrl || '',
      active: p.active,
    });
  };

  if (loading) return <div className="text-gray-600">Carregando...</div>;

  return (
    <div className="text-gray-800">
      {error && <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 mb-4">{error}</div>}

      {/* Formulário */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
        <h3 className="font-semibold text-amber-800 mb-3">{editingId ? '✏️ Editar Produto' : '➕ Novo Produto'}</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" placeholder="Nome" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="border border-gray-300 rounded-lg p-2" required />
          <input type="text" placeholder="Descrição" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="border border-gray-300 rounded-lg p-2" />
          <input type="number" step="0.01" placeholder="Preço" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} className="border border-gray-300 rounded-lg p-2" required />
          <input type="number" placeholder="Estoque" value={formData.stockQuantity} onChange={e => setFormData({ ...formData, stockQuantity: e.target.value })} className="border border-gray-300 rounded-lg p-2" required />
          <select value={formData.categoryId} onChange={e => setFormData({ ...formData, categoryId: e.target.value })} className="border border-gray-300 rounded-lg p-2" required>
            <option value="">Selecione a categoria</option>
            {categorias.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
          </select>
          <input type="text" placeholder="URL da imagem (opcional)" value={formData.imageUrl} onChange={e => setFormData({ ...formData, imageUrl: e.target.value })} className="border border-gray-300 rounded-lg p-2" />
          <label className="flex items-center gap-2 col-span-full">
            <input type="checkbox" checked={formData.active} onChange={e => setFormData({ ...formData, active: e.target.checked })} className="rounded" />
            Produto ativo
          </label>
          <div className="flex gap-2 col-span-full">
            <button type="submit" className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition">{editingId ? 'Atualizar' : 'Criar'}</button>
            {editingId && <button type="button" onClick={() => setEditingId(null)} className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg transition">Cancelar</button>}
          </div>
        </form>
      </div>

      {/* Tabela */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-amber-50 text-amber-800 border-b border-amber-200">
              <th className="p-2 text-left">ID</th><th>Nome</th><th>Preço</th><th>Estoque</th><th>Categoria</th><th>Ativo</th><th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {produtos.map(prod => (
              <tr key={prod.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="p-2">{prod.id}</td>
                <td className="p-2">{prod.name}</td>
                <td className="p-2">R$ {prod.price.toFixed(2)}</td>
                <td className="p-2">{prod.stockQuantity}</td>
                <td className="p-2">{prod.category.name}</td>
                <td className="p-2">{prod.active ? '✅' : '❌'}</td>
                <td className="p-2 space-x-2">
                  <button onClick={() => handleEdit(prod)} className="text-blue-600 hover:text-blue-800">Editar</button>
                  <button onClick={() => handleDelete(prod.id)} className="text-red-600 hover:text-red-800">Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
import { useEffect, useState } from 'react';
import { api } from '../../services/api';

interface Cliente {
  id: number;
  name: string;
  email: string;
  role: string;
}

export function ClientesAdmin() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'CLIENTE' });
  const [error, setError] = useState('');

  const fetchClientes = async () => {
    try {
      const res = await api.get('/clientes');
      setClientes(res.data);
    } catch {
      setError('Erro ao carregar clientes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/clientes/${editingId}`, { name: formData.name, email: formData.email, role: formData.role });
      } else {
        await api.post('/clientes', { name: formData.name, email: formData.email, password: formData.password, role: formData.role });
      }
      setEditingId(null);
      setFormData({ name: '', email: '', password: '', role: 'CLIENTE' });
      fetchClientes();
    } catch {
      setError('Erro ao salvar cliente');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
      await api.delete(`/clientes/${id}`);
      fetchClientes();
    }
  };

  const handleEdit = (cliente: Cliente) => {
    setEditingId(cliente.id);
    setFormData({
      name: cliente.name,
      email: cliente.email,
      password: '',
      role: cliente.role,
    });
  };

  if (loading) return <div className="text-gray-600">Carregando clientes...</div>;

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
          {editingId ? '✏️ Editar Cliente' : '➕ Novo Cliente'}
        </h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Nome"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-amber-500"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-amber-500"
            required
          />
          {!editingId && (
            <input
              type="password"
              placeholder="Senha"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-amber-500"
              required
            />
          )}
          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            <option value="CLIENTE">CLIENTE</option>
            <option value="ADMIN">ADMIN</option>
          </select>
          <div className="flex gap-2 col-span-full md:col-span-2 lg:col-span-4">
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
                  setFormData({ name: '', email: '', password: '', role: 'CLIENTE' });
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
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((cliente) => (
              <tr key={cliente.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                <td className="p-3 font-mono text-sm">{cliente.id}</td>
                <td className="p-3 font-medium">{cliente.name}</td>
                <td className="p-3">{cliente.email}</td>
                <td className="p-3">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      cliente.role === 'ADMIN'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {cliente.role}
                  </span>
                </td>
                <td className="p-3 space-x-2">
                  <button
                    onClick={() => handleEdit(cliente)}
                    className="text-blue-600 hover:text-blue-800 transition"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(cliente.id)}
                    className="text-red-600 hover:text-red-800 transition"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {clientes.length === 0 && (
          <div className="text-center py-8 text-gray-500">Nenhum cliente cadastrado.</div>
        )}
      </div>
    </div>
  );
}
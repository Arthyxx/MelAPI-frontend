import { useEffect, useState } from 'react';
import { api } from '../../services/api';

interface Pedido {
  id: number;
  cliente: { id: number; name: string };
  totalPrice: number;
  status: string;
  createdAt: string;
}

// Mapeamento de cores para cada status (opcional, para badges)
const statusColors: Record<string, string> = {
  PENDENTE: 'bg-yellow-100 text-yellow-800',
  CONFIRMADO: 'bg-blue-100 text-blue-800',
  ENVIADO: 'bg-purple-100 text-purple-800',
  ENTREGUE: 'bg-green-100 text-green-800',
  CANCELADO: 'bg-red-100 text-red-800',
};

export function PedidosAdmin() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPedidos = async () => {
    try {
      const res = await api.get('/pedidos');
      setPedidos(res.data);
    } catch (err) {
      setError('Erro ao carregar pedidos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPedidos();
  }, []);

  const updateStatus = async (id: number, status: string) => {
    try {
      await api.patch(`/pedidos/${id}/status`, { status });
      fetchPedidos();
    } catch (err) {
      alert('Erro ao atualizar status');
    }
  };

  if (loading) return <div className="text-gray-600">Carregando pedidos...</div>;
  if (error) return <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 rounded">{error}</div>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-amber-50 text-amber-800 border-b border-amber-200">
            <th className="p-3 text-left">ID</th>
            <th className="p-3 text-left">Cliente</th>
            <th className="p-3 text-left">Total</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Data</th>
            <th className="p-3 text-left">Ações</th>
           </tr>
        </thead>
        <tbody>
          {pedidos.map((pedido) => (
            <tr key={pedido.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
              <td className="p-3 font-mono text-sm">{pedido.id}</td>
              <td className="p-3 font-medium">{pedido.cliente.name}</td>
              <td className="p-3 font-semibold text-amber-700">R$ {pedido.totalPrice.toFixed(2)}</td>
              <td className="p-3">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[pedido.status] || 'bg-gray-100 text-gray-800'}`}>
                  {pedido.status}
                </span>
              </td>
              <td className="p-3 text-sm text-gray-600">{new Date(pedido.createdAt).toLocaleDateString('pt-BR')}</td>
              <td className="p-3">
                <select
                  value={pedido.status}
                  onChange={(e) => updateStatus(pedido.id, e.target.value)}
                  className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  <option value="PENDENTE">PENDENTE</option>
                  <option value="CONFIRMADO">CONFIRMADO</option>
                  <option value="ENVIADO">ENVIADO</option>
                  <option value="ENTREGUE">ENTREGUE</option>
                  <option value="CANCELADO">CANCELADO</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {pedidos.length === 0 && (
        <div className="text-center py-8 text-gray-500">Nenhum pedido encontrado.</div>
      )}
    </div>
  );
}
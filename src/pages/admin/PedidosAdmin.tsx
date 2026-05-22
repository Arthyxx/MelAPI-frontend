import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import type { Pedido } from '../../types/pedido';
import { statusPedidoColors, statusPedidoLabels, statusPedidoOptions } from '../../constants/statusPedido';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';

export function PedidosAdmin() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPedidos = async () => {
    try {
      setError('');
      setLoading(true);

      const response = await api.get('/pedidos');

      const data = Array.isArray(response.data) ? response.data : [];
      setPedidos(data);
    } catch (err) {
      console.error('Erro ao carregar pedidos:', err);
      setError('Erro ao carregar pedidos.');
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
      await fetchPedidos();
    } catch (err: any) {
      console.error('Erro ao atualizar status:', {
        statusCode: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });

      alert(
        err.response?.data?.message ||
          err.response?.data?.error ||
          'Erro ao atualizar status.'
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10 text-gray-600">
        Carregando pedidos...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border-l-4 border-red-500 bg-red-50 p-4 text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-xl font-bold text-amber-800">
            Pedidos recebidos
          </h3>

          <p className="text-sm text-gray-500">
            Acompanhe e atualize o status dos pedidos da loja.
          </p>
        </div>

        <span className="w-fit rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-800">
          {pedidos.length} {pedidos.length === 1 ? 'pedido' : 'pedidos'}
        </span>
      </div>

      {pedidos.length === 0 ? (
        <div className="rounded-xl border border-amber-100 bg-amber-50/60 py-10 text-center text-gray-500">
          Nenhum pedido encontrado.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-amber-100 bg-white shadow-sm">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-amber-200 bg-amber-50 text-amber-800">
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Cliente</th>
                <th className="p-3 text-left">Produtos</th>
                <th className="p-3 text-left">Total</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Data</th>
                <th className="p-3 text-left">Ações</th>
              </tr>
            </thead>

            <tbody>
              {pedidos.map((pedido) => {
                const status = pedido.status ?? 'PENDENTE';

                return (
                  <tr
                    key={pedido.id}
                    className="border-b border-gray-100 transition hover:bg-gray-50"
                  >
                    <td className="p-3 font-mono text-sm text-gray-700">
                      #{pedido.id}
                    </td>

                    <td className="p-3">
                      <div className="font-medium text-gray-800">
                        {pedido.clienteName || 'Cliente não informado'}
                      </div>

                      <div className="text-xs text-gray-500">
                        ID cliente: {pedido.clienteId}
                      </div>
                    </td>

                    <td className="p-3">
                      <div className="space-y-1">
                        {pedido.items?.length > 0 ? (
                          pedido.items.map((item) => (
                            <div
                              key={item.id}
                              className="text-sm text-gray-700"
                            >
                              <span className="font-medium">
                                {item.produtoName}
                              </span>{' '}
                              <span className="text-gray-500">
                                x{item.quantity}
                              </span>
                            </div>
                          ))
                        ) : (
                          <span className="text-sm text-gray-500">
                            Nenhum item informado
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="p-3 font-semibold text-amber-700">
                      {formatCurrency(pedido.totalPrice)}
                    </td>

                    <td className="p-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          statusPedidoColors[status] ||
                          'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {statusPedidoLabels[status] || status}
                      </span>
                    </td>

                    <td className="p-3 text-sm text-gray-600">
                      {formatDate(pedido.createdAt)}
                    </td>

                    <td className="p-3">
                      <select
                        value={pedido.status}
                        onChange={(e) =>
                          updateStatus(pedido.id, e.target.value)
                        }
                        className="rounded-md border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                      >
                        {statusPedidoOptions.map((statusOption) => (
                          <option
                            key={statusOption.value}
                            value={statusOption.value}
                          >
                            {statusOption.label}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
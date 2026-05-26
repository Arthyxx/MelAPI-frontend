import { useEffect, useMemo, useState } from 'react';
import { api } from '../../services/api';
import type { Pedido } from '../../types/pedido';
import {
  statusPedidoColors,
  statusPedidoLabels,
  statusPedidoOptions,
} from '../../constants/statusPedido';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';

export function PedidosAdmin() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const totalPedidos = pedidos.length;

  const pedidosPendentes = useMemo(() => {
    return pedidos.filter((pedido) => pedido.status === 'PENDENTE').length;
  }, [pedidos]);

  const pedidosEntregues = useMemo(() => {
    return pedidos.filter((pedido) => pedido.status === 'ENTREGUE').length;
  }, [pedidos]);

  const faturamento = useMemo(() => {
    return pedidos.reduce((sum, pedido) => sum + (pedido.totalPrice || 0), 0);
  }, [pedidos]);

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
      setError('');
      setSuccess('');
      setUpdatingId(id);

      await api.patch(`/pedidos/${id}/status`, { status });

      setSuccess(`Status do pedido #${id} atualizado com sucesso.`);
      await fetchPedidos();
    } catch (err: any) {
      console.error('Erro ao atualizar status:', {
        statusCode: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          'Erro ao atualizar status.'
      );
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-amber-200 border-t-amber-700" />

        <p className="mt-4 font-semibold text-gray-600">
          Carregando pedidos...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-white text-gray-900">
      <div className="flex flex-col gap-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-amber-700">
            Administração
          </p>

          <h2 className="mt-2 text-3xl font-black tracking-tight text-gray-950">
            Pedidos
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Acompanhe pedidos, produtos comprados e status de entrega.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-center md:grid-cols-4">
          <div className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3">
            <p className="text-2xl font-black text-gray-950">
              {totalPedidos}
            </p>
            <p className="text-xs font-bold text-gray-500">Total</p>
          </div>

          <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3">
            <p className="text-2xl font-black text-amber-700">
              {pedidosPendentes}
            </p>
            <p className="text-xs font-bold text-amber-700">Pendentes</p>
          </div>

          <div className="rounded-2xl border border-green-100 bg-green-50 px-4 py-3">
            <p className="text-2xl font-black text-green-700">
              {pedidosEntregues}
            </p>
            <p className="text-xs font-bold text-green-700">Entregues</p>
          </div>

          <div className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3">
            <p className="text-lg font-black text-blue-700">
              {formatCurrency(faturamento)}
            </p>
            <p className="text-xs font-bold text-blue-700">Total vendido</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-semibold text-green-700">
          {success}
        </div>
      )}

      <section className="rounded-3xl border border-gray-100 bg-white shadow-sm">
        <div className="flex flex-col gap-2 border-b border-gray-100 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-xl font-black text-gray-950">
              Pedidos recebidos
            </h3>

            <p className="text-sm text-gray-500">
              Atualize o status conforme o andamento da venda.
            </p>
          </div>

          <span className="w-fit rounded-full bg-amber-50 px-4 py-2 text-sm font-black text-amber-700">
            {pedidos.length} {pedidos.length === 1 ? 'pedido' : 'pedidos'}
          </span>
        </div>

        {pedidos.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            Nenhum pedido encontrado.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1080px] border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs font-black uppercase tracking-wide text-gray-500">
                  <th className="px-6 py-4">Pedido</th>
                  <th className="px-6 py-4">Cliente</th>
                  <th className="px-6 py-4">Produtos</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Data</th>
                  <th className="px-6 py-4 text-right">Atualizar</th>
                </tr>
              </thead>

              <tbody>
                {pedidos.map((pedido) => {
                  const status = pedido.status ?? 'PENDENTE';
                  const isUpdating = updatingId === pedido.id;

                  return (
                    <tr
                      key={pedido.id}
                      className="border-b border-gray-100 transition hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-black text-gray-900">
                            Pedido #{pedido.id}
                          </p>

                          <p className="text-xs text-gray-500">
                            {pedido.items?.length || 0}{' '}
                            {(pedido.items?.length || 0) === 1
                              ? 'produto'
                              : 'produtos'}
                          </p>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div>
                          <p className="font-black text-gray-900">
                            {pedido.clienteName || 'Cliente não informado'}
                          </p>

                          <p className="text-xs text-gray-500">
                            ID #{pedido.clienteId}
                          </p>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="max-w-sm space-y-2">
                          {pedido.items?.length > 0 ? (
                            pedido.items.map((item) => (
                              <div
                                key={item.id}
                                className="rounded-2xl bg-gray-50 px-3 py-2 text-sm"
                              >
                                <span className="font-black text-gray-800">
                                  {item.produtoName}
                                </span>

                                <span className="ml-2 text-gray-500">
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

                      <td className="px-6 py-4 font-black text-amber-700">
                        {formatCurrency(pedido.totalPrice)}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-black ${
                            statusPedidoColors[status] ||
                            'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {statusPedidoLabels[status] || status}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-sm font-medium text-gray-600">
                        {formatDate(pedido.createdAt)}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-end">
                          <select
                            value={pedido.status}
                            onChange={(event) =>
                              updateStatus(pedido.id, event.target.value)
                            }
                            disabled={isUpdating}
                            className="h-10 rounded-xl border border-gray-200 bg-white px-3 text-sm font-bold text-gray-700 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100 disabled:cursor-not-allowed disabled:opacity-60"
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
                        </div>

                        {isUpdating && (
                          <p className="mt-2 text-right text-xs font-bold text-amber-700">
                            Atualizando...
                          </p>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

interface ItemPedido {
  id: number;
  produtoId: number;
  produtoName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

interface Pedido {
  id: number;
  clienteId: number;
  clienteName: string;
  items: ItemPedido[];
  totalPrice: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const statusColors: Record<string, string> = {
  PENDENTE: 'bg-yellow-100 text-yellow-800',
  PAGO: 'bg-blue-100 text-blue-800',
  EM_PREPARACAO: 'bg-orange-100 text-orange-800',
  ENVIADO: 'bg-purple-100 text-purple-800',
  ENTREGUE: 'bg-green-100 text-green-800',
  CANCELADO: 'bg-red-100 text-red-800',
};

const statusLabels: Record<string, string> = {
  PENDENTE: 'Pendente',
  PAGO: 'Pago',
  EM_PREPARACAO: 'Em preparação',
  ENVIADO: 'Enviado',
  ENTREGUE: 'Entregue',
  CANCELADO: 'Cancelado',
};

export function MeusPedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMeusPedidos = async () => {
      try {
        setError('');
        setLoading(true);

        const response = await api.get('/pedidos/meus-pedidos');

        const data = Array.isArray(response.data) ? response.data : [];
        setPedidos(data);
      } catch (err) {
        console.error('Erro ao carregar meus pedidos:', err);
        setError('Erro ao carregar seus pedidos.');
      } finally {
        setLoading(false);
      }
    };

    fetchMeusPedidos();
  }, []);

  const formatCurrency = (value?: number | null) => {
    return Number(value ?? 0).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const formatDate = (date?: string | null) => {
    if (!date) return 'Data não informada';

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return 'Data inválida';
    }

    return parsedDate.toLocaleDateString('pt-BR');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100 dark:from-gray-950 dark:via-gray-900 dark:to-amber-950">
        <div className="text-center">
          <div className="text-7xl animate-bounce-soft mb-4">🍯</div>
          <p className="text-xl font-semibold text-amber-700 dark:text-amber-300">
            Carregando seus pedidos...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100 dark:from-gray-950 dark:via-gray-900 dark:to-amber-950">
      <header className="sticky top-0 z-30 border-b border-amber-300/40 bg-amber-900/90 text-white shadow-xl backdrop-blur-md dark:bg-amber-950/90">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-700 shadow-inner">
                <span className="text-3xl">📦</span>
              </div>

              <div>
                <h1 className="text-2xl font-extrabold tracking-tight">
                  Meus Pedidos
                </h1>
                <p className="text-sm text-amber-100">
                  Acompanhe suas compras no Apiário Vitória Seven
                </p>
              </div>
            </div>

            <Link
              to="/produtos"
              className="inline-flex w-fit items-center gap-2 rounded-full bg-white/15 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/25"
            >
              <span>←</span>
              Voltar à loja
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10">
        {error && (
          <div className="mb-6 rounded-2xl border border-red-300 bg-red-50 px-5 py-4 text-red-700 shadow-sm dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
            {error}
          </div>
        )}

        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-amber-800">
              Histórico
            </span>

            <h2 className="mt-3 text-3xl font-extrabold text-amber-900 dark:text-amber-300">
              Suas compras
            </h2>

            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Veja o status e os produtos de cada pedido.
            </p>
          </div>

          <span className="w-fit rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-800">
            {pedidos.length} {pedidos.length === 1 ? 'pedido' : 'pedidos'}
          </span>
        </div>

        {pedidos.length === 0 ? (
          <section className="mx-auto max-w-2xl overflow-hidden rounded-3xl border border-amber-200 bg-white shadow-2xl dark:border-amber-800 dark:bg-gray-900">
            <div className="bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 px-6 py-12 text-center text-white">
              <div className="mb-4 text-7xl">🛍️</div>

              <h2 className="text-3xl font-extrabold">
                Você ainda não fez pedidos
              </h2>

              <p className="mx-auto mt-3 max-w-md text-amber-50">
                Quando você finalizar uma compra, ela aparecerá aqui.
              </p>
            </div>

            <div className="p-8 text-center">
              <Link
                to="/produtos"
                className="inline-flex items-center justify-center rounded-2xl bg-amber-600 px-8 py-3 font-bold text-white shadow-lg transition hover:bg-amber-700 hover:shadow-xl"
              >
                Ver produtos
              </Link>
            </div>
          </section>
        ) : (
          <div className="space-y-6">
            {pedidos.map((pedido) => {
              const status = pedido.status ?? 'PENDENTE';

              return (
                <article
                  key={pedido.id}
                  className="overflow-hidden rounded-3xl border border-amber-200 bg-white shadow-lg transition hover:-translate-y-1 hover:shadow-2xl dark:border-amber-800 dark:bg-gray-900"
                >
                  <div className="flex flex-col gap-4 border-b border-amber-100 bg-amber-50 px-6 py-5 md:flex-row md:items-center md:justify-between dark:border-amber-900 dark:bg-amber-950/30">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-xl font-extrabold text-amber-900 dark:text-amber-300">
                          Pedido #{pedido.id}
                        </h3>

                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${
                            statusColors[status] || 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {statusLabels[status] || status}
                        </span>
                      </div>

                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Realizado em {formatDate(pedido.createdAt)}
                      </p>
                    </div>

                    <div className="text-left md:text-right">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Total do pedido
                      </p>

                      <p className="text-2xl font-black text-amber-700 dark:text-amber-300">
                        {formatCurrency(pedido.totalPrice)}
                      </p>
                    </div>
                  </div>

                  <div className="p-6">
                    <h4 className="mb-4 font-bold text-gray-800 dark:text-gray-100">
                      Produtos
                    </h4>

                    <div className="space-y-3">
                      {pedido.items?.length > 0 ? (
                        pedido.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex flex-col gap-3 rounded-2xl border border-amber-100 bg-white p-4 sm:flex-row sm:items-center sm:justify-between dark:border-amber-900 dark:bg-gray-950"
                          >
                            <div className="flex items-center gap-4">
                              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-3xl dark:bg-amber-950">
                                🍯
                              </div>

                              <div>
                                <p className="font-bold text-amber-900 dark:text-amber-300">
                                  {item.produtoName}
                                </p>

                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {item.quantity} unidade(s) x{' '}
                                  {formatCurrency(item.unitPrice)}
                                </p>
                              </div>
                            </div>

                            <div className="text-left sm:text-right">
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Subtotal
                              </p>

                              <p className="font-extrabold text-amber-700 dark:text-amber-300">
                                {formatCurrency(item.subtotal)}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="rounded-2xl bg-gray-50 p-4 text-sm text-gray-500 dark:bg-gray-800">
                          Nenhum item informado neste pedido.
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
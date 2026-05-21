import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
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

export function DetalhePedido() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPedido = async () => {
      try {
        setError('');
        setLoading(true);

        const response = await api.get(`/pedidos/meus-pedidos/${id}`);

        setPedido(response.data);
      } catch (err) {
        console.error('Erro ao carregar detalhe do pedido:', err);
        setError('Não foi possível carregar os detalhes deste pedido.');
      } finally {
        setLoading(false);
      }
    };

    if (!id) {
      navigate('/meus-pedidos');
      return;
    }

    fetchPedido();
  }, [id, navigate]);

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

    return parsedDate.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100 dark:from-gray-950 dark:via-gray-900 dark:to-amber-950">
        <div className="text-center">
          <div className="mb-4 text-7xl animate-bounce-soft">📦</div>
          <p className="text-xl font-semibold text-amber-700 dark:text-amber-300">
            Carregando detalhes do pedido...
          </p>
        </div>
      </div>
    );
  }

  if (error || !pedido) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100 px-4 dark:from-gray-950 dark:via-gray-900 dark:to-amber-950">
        <div className="max-w-xl rounded-3xl border border-red-200 bg-white p-8 text-center shadow-2xl dark:border-red-900 dark:bg-gray-900">
          <div className="mb-4 text-6xl">⚠️</div>

          <h1 className="text-2xl font-extrabold text-red-700 dark:text-red-300">
            Pedido não encontrado
          </h1>

          <p className="mt-3 text-gray-600 dark:text-gray-400">
            {error || 'Não conseguimos encontrar esse pedido.'}
          </p>

          <Link
            to="/meus-pedidos"
            className="mt-6 inline-flex rounded-2xl bg-amber-600 px-6 py-3 font-bold text-white shadow-lg transition hover:bg-amber-700"
          >
            Voltar para meus pedidos
          </Link>
        </div>
      </div>
    );
  }

  const status = pedido.status ?? 'PENDENTE';

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
                  Pedido #{pedido.id}
                </h1>
                <p className="text-sm text-amber-100">
                  Detalhes da sua compra no Apiário Vitória Seven
                </p>
              </div>
            </div>

            <Link
              to="/meus-pedidos"
              className="inline-flex w-fit items-center gap-2 rounded-full bg-white/15 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/25"
            >
              <span>←</span>
              Voltar para meus pedidos
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10">
        <section className="mb-8 overflow-hidden rounded-3xl border border-amber-200 bg-white shadow-2xl dark:border-amber-800 dark:bg-gray-900">
          <div className="bg-gradient-to-r from-amber-700 via-yellow-600 to-amber-700 px-6 py-8 text-white">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-amber-100">
                  Resumo do pedido
                </p>

                <h2 className="mt-2 text-3xl font-black">
                  Pedido #{pedido.id}
                </h2>

                <p className="mt-2 text-amber-50">
                  Realizado em {formatDate(pedido.createdAt)}
                </p>
              </div>

              <div className="flex flex-col gap-3 md:items-end">
                <span
                  className={`w-fit rounded-full px-4 py-2 text-sm font-bold ${
                    statusColors[status] || 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {statusLabels[status] || status}
                </span>

                <div className="text-left md:text-right">
                  <p className="text-sm text-amber-100">Total pago/estimado</p>
                  <p className="text-4xl font-black">
                    {formatCurrency(pedido.totalPrice)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 p-6 md:grid-cols-3">
            <div className="rounded-2xl bg-amber-50 p-4 dark:bg-amber-950/40">
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                Cliente
              </p>
              <p className="mt-1 font-bold text-amber-900 dark:text-amber-300">
                {pedido.clienteName}
              </p>
            </div>

            <div className="rounded-2xl bg-amber-50 p-4 dark:bg-amber-950/40">
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                Quantidade de itens
              </p>
              <p className="mt-1 font-bold text-amber-900 dark:text-amber-300">
                {pedido.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0}
              </p>
            </div>

            <div className="rounded-2xl bg-amber-50 p-4 dark:bg-amber-950/40">
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                Última atualização
              </p>
              <p className="mt-1 font-bold text-amber-900 dark:text-amber-300">
                {formatDate(pedido.updatedAt)}
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-amber-200 bg-white p-6 shadow-xl dark:border-amber-800 dark:bg-gray-900">
          <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h3 className="text-2xl font-extrabold text-amber-900 dark:text-amber-300">
                Produtos do pedido
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Confira os itens comprados e seus valores.
              </p>
            </div>

            <span className="w-fit rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-800">
              {pedido.items?.length ?? 0} {pedido.items?.length === 1 ? 'produto' : 'produtos'}
            </span>
          </div>

          <div className="space-y-4">
            {pedido.items?.length > 0 ? (
              pedido.items.map((item) => (
                <article
                  key={item.id}
                  className="flex flex-col gap-4 rounded-3xl border border-amber-100 bg-amber-50/40 p-5 transition hover:bg-amber-50 md:flex-row md:items-center md:justify-between dark:border-amber-900 dark:bg-gray-950 dark:hover:bg-gray-900"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-4xl shadow-inner dark:bg-amber-950">
                      🍯
                    </div>

                    <div>
                      <h4 className="text-lg font-extrabold text-amber-900 dark:text-amber-300">
                        {item.produtoName}
                      </h4>

                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Código do produto: #{item.produtoId}
                      </p>

                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                        {item.quantity} unidade(s) x {formatCurrency(item.unitPrice)}
                      </p>
                    </div>
                  </div>

                  <div className="text-left md:text-right">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Subtotal
                    </p>

                    <p className="text-2xl font-black text-amber-700 dark:text-amber-300">
                      {formatCurrency(item.subtotal)}
                    </p>
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-2xl bg-gray-50 p-6 text-center text-gray-500 dark:bg-gray-800">
                Nenhum item encontrado neste pedido.
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
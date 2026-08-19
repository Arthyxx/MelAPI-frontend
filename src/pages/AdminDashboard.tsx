import type { AxiosError } from 'axios';
import {
  useEffect,
  useState,
} from 'react';
import { Link } from 'react-router-dom';

import { api } from '../services/api';
import { formatCurrency } from '../utils/formatCurrency';

interface DashboardSummary {
  clientes: {
    ativos: number;
  };
  categorias: {
    ativas: number;
  };
  produtos: {
    ativos: number;
    semEstoque: number;
  };
  pedidos: {
    total: number;
    pendentes: number;
    entregues: number;
    cancelados: number;
  };
  faturamento: {
    total: number;
  };
}

interface ApiErrorResponse {
  message?: string | string[];
  error?: string;
}

const initialSummary: DashboardSummary = {
  clientes: {
    ativos: 0,
  },
  categorias: {
    ativas: 0,
  },
  produtos: {
    ativos: 0,
    semEstoque: 0,
  },
  pedidos: {
    total: 0,
    pendentes: 0,
    entregues: 0,
    cancelados: 0,
  },
  faturamento: {
    total: 0,
  },
};

export function AdminDashboard() {
  const [summary, setSummary] =
    useState<DashboardSummary>(
      initialSummary,
    );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        setError('');

        const response =
          await api.get<DashboardSummary>(
            '/dashboard/summary',
          );

        setSummary(response.data);
      } catch (requestError) {
        const axiosError =
          requestError as AxiosError<ApiErrorResponse>;

        console.error(
          'Erro ao carregar dashboard:',
          {
            statusCode:
              axiosError.response?.status,
            data:
              axiosError.response?.data,
            message:
              axiosError.message,
          },
        );

        const apiMessage =
          axiosError.response?.data
            ?.message;

        setError(
          Array.isArray(apiMessage)
            ? apiMessage.join(' ')
            : apiMessage ||
                axiosError.response
                  ?.data?.error ||
                'Não foi possível carregar os dados da loja.',
        );
      } finally {
        setLoading(false);
      }
    };

    void fetchSummary();
  }, []);

  if (loading) {
    return (
      <div className="rounded-3xl border border-gray-100 bg-white p-10 text-center shadow-sm">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-amber-200 border-t-amber-700" />

        <p className="mt-4 font-semibold text-gray-600">
          Carregando informações da loja...
        </p>
      </div>
    );
  }

  const hasPendingOrders =
    summary.pedidos.pendentes > 0;

  const hasOutOfStockProducts =
    summary.produtos.semEstoque > 0;

  const needsAttention =
    hasPendingOrders ||
    hasOutOfStockProducts;

  return (
    <div className="space-y-6">
      {error && (
        <div
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700"
        >
          {error}
        </div>
      )}

      <section className="rounded-3xl border border-amber-100 bg-gradient-to-br from-amber-50 via-yellow-50 to-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-amber-700">
              Resumo da loja
            </p>

            <h2 className="mt-2 text-2xl font-black tracking-tight text-gray-950 sm:text-3xl">
              Acompanhe o que está acontecendo
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-600">
              Veja pedidos, estoque,
              clientes e faturamento
              em um único lugar.
            </p>
          </div>

          <Link
            to="/produtos"
            className="inline-flex items-center justify-center rounded-2xl bg-amber-700 px-5 py-3 text-sm font-black text-white transition hover:bg-amber-800"
          >
            🛍️ Abrir loja
          </Link>
        </div>
      </section>

      <section>
        <div className="mb-4">
          <h2 className="text-xl font-black text-gray-950">
            O que precisa de atenção
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Situações que podem exigir
            alguma ação.
          </p>
        </div>

        {!needsAttention ? (
          <div className="rounded-3xl border border-green-200 bg-green-50 p-5">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">
                ✅
              </div>

              <div>
                <h3 className="font-black text-green-900">
                  Tudo certo por aqui
                </h3>

                <p className="mt-1 text-sm leading-relaxed text-green-700">
                  Não há pedidos pendentes
                  nem produtos sem estoque
                  neste momento.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {hasPendingOrders && (
              <Link
                to="/admin/pedidos"
                className="group rounded-3xl border border-yellow-200 bg-yellow-50 p-5 transition hover:border-yellow-300 hover:shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">
                    📋
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-2xl font-black text-yellow-800">
                      {
                        summary.pedidos
                          .pendentes
                      }
                    </p>

                    <h3 className="mt-1 font-black text-yellow-900">
                      {summary.pedidos
                        .pendentes === 1
                        ? 'Pedido pendente'
                        : 'Pedidos pendentes'}
                    </h3>

                    <p className="mt-1 text-sm text-yellow-700">
                      Há pedidos esperando
                      atendimento.
                    </p>

                    <p className="mt-3 text-sm font-black text-yellow-900 group-hover:underline">
                      Ver pedidos →
                    </p>
                  </div>
                </div>
              </Link>
            )}

            {hasOutOfStockProducts && (
              <Link
                to="/admin/produtos"
                className="group rounded-3xl border border-red-200 bg-red-50 p-5 transition hover:border-red-300 hover:shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">
                    ⚠️
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-2xl font-black text-red-700">
                      {
                        summary.produtos
                          .semEstoque
                      }
                    </p>

                    <h3 className="mt-1 font-black text-red-900">
                      {summary.produtos
                        .semEstoque === 1
                        ? 'Produto sem estoque'
                        : 'Produtos sem estoque'}
                    </h3>

                    <p className="mt-1 text-sm text-red-700">
                      Atualize o estoque
                      para voltar a vender.
                    </p>

                    <p className="mt-3 text-sm font-black text-red-900 group-hover:underline">
                      Ver produtos →
                    </p>
                  </div>
                </div>
              </Link>
            )}
          </div>
        )}
      </section>

      <section>
        <div className="mb-4">
          <h2 className="text-xl font-black text-gray-950">
            Números da loja
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Informações gerais do
            Apiário Vitória Seven.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl border border-green-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-3xl">
                💰
              </span>

              <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-black text-green-700">
                Faturamento
              </span>
            </div>

            <p className="mt-5 text-3xl font-black text-gray-950">
              {formatCurrency(
                summary.faturamento.total,
              )}
            </p>

            <p className="mt-1 text-sm font-semibold text-gray-500">
              Total dos pedidos válidos
            </p>
          </div>

          <div className="rounded-3xl border border-amber-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-3xl">
                📦
              </span>

              <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-black text-amber-700">
                Pedidos
              </span>
            </div>

            <p className="mt-5 text-3xl font-black text-gray-950">
              {summary.pedidos.total}
            </p>

            <p className="mt-1 text-sm font-semibold text-gray-500">
              Pedidos registrados
            </p>
          </div>

          <div className="rounded-3xl border border-blue-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-3xl">
                👥
              </span>

              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700">
                Clientes
              </span>
            </div>

            <p className="mt-5 text-3xl font-black text-gray-950">
              {summary.clientes.ativos}
            </p>

            <p className="mt-1 text-sm font-semibold text-gray-500">
              Clientes ativos
            </p>
          </div>

          <div className="rounded-3xl border border-purple-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-3xl">
                🍯
              </span>

              <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-black text-purple-700">
                Produtos
              </span>
            </div>

            <p className="mt-5 text-3xl font-black text-gray-950">
              {summary.produtos.ativos}
            </p>

            <p className="mt-1 text-sm font-semibold text-gray-500">
              Produtos ativos
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-xl font-black text-gray-950">
                Situação dos pedidos
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Acompanhe o andamento
                das vendas.
              </p>
            </div>

            <Link
              to="/admin/pedidos"
              className="text-sm font-black text-amber-700 hover:text-amber-900"
            >
              Ver todos →
            </Link>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-yellow-50 p-4">
              <p className="text-2xl font-black text-yellow-700">
                {
                  summary.pedidos
                    .pendentes
                }
              </p>

              <p className="mt-1 text-sm font-bold text-yellow-800">
                Pendentes
              </p>
            </div>

            <div className="rounded-2xl bg-green-50 p-4">
              <p className="text-2xl font-black text-green-700">
                {
                  summary.pedidos
                    .entregues
                }
              </p>

              <p className="mt-1 text-sm font-bold text-green-800">
                Entregues
              </p>
            </div>

            <div className="rounded-2xl bg-red-50 p-4">
              <p className="text-2xl font-black text-red-700">
                {
                  summary.pedidos
                    .cancelados
                }
              </p>

              <p className="mt-1 text-sm font-bold text-red-800">
                Cancelados
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-xl font-black text-gray-950">
                Catálogo
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Produtos disponíveis
                para venda.
              </p>
            </div>

            <Link
              to="/admin/produtos"
              className="text-sm font-black text-amber-700 hover:text-amber-900"
            >
              Ver produtos →
            </Link>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-amber-50 p-4">
              <p className="text-2xl font-black text-amber-800">
                {
                  summary.categorias
                    .ativas
                }
              </p>

              <p className="mt-1 text-sm font-bold text-amber-800">
                Categorias
              </p>
            </div>

            <div className="rounded-2xl bg-green-50 p-4">
              <p className="text-2xl font-black text-green-700">
                {
                  summary.produtos
                    .ativos
                }
              </p>

              <p className="mt-1 text-sm font-bold text-green-800">
                Produtos ativos
              </p>
            </div>

            <div className="rounded-2xl bg-red-50 p-4">
              <p className="text-2xl font-black text-red-700">
                {
                  summary.produtos
                    .semEstoque
                }
              </p>

              <p className="mt-1 text-sm font-bold text-red-800">
                Sem estoque
              </p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4">
          <h2 className="text-xl font-black text-gray-950">
            Acesso rápido
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Escolha o que deseja
            administrar.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Link
            to="/admin/produtos"
            className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-amber-200 hover:shadow-md"
          >
            <span className="text-3xl">
              📦
            </span>

            <h3 className="mt-4 font-black text-gray-950">
              Produtos
            </h3>

            <p className="mt-1 text-sm leading-relaxed text-gray-500">
              Cadastre produtos,
              altere preços, fotos e
              estoque.
            </p>
          </Link>

          <Link
            to="/admin/categorias"
            className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-amber-200 hover:shadow-md"
          >
            <span className="text-3xl">
              🏷️
            </span>

            <h3 className="mt-4 font-black text-gray-950">
              Categorias
            </h3>

            <p className="mt-1 text-sm leading-relaxed text-gray-500">
              Organize os produtos
              da loja por categoria.
            </p>
          </Link>

          <Link
            to="/admin/clientes"
            className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-amber-200 hover:shadow-md"
          >
            <span className="text-3xl">
              👥
            </span>

            <h3 className="mt-4 font-black text-gray-950">
              Clientes
            </h3>

            <p className="mt-1 text-sm leading-relaxed text-gray-500">
              Consulte os clientes
              cadastrados na loja.
            </p>
          </Link>

          <Link
            to="/admin/pedidos"
            className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-amber-200 hover:shadow-md"
          >
            <span className="text-3xl">
              📋
            </span>

            <h3 className="mt-4 font-black text-gray-950">
              Pedidos
            </h3>

            <p className="mt-1 text-sm leading-relaxed text-gray-500">
              Acompanhe pedidos,
              pagamentos e entregas.
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
}
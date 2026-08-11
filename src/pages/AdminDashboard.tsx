import {
  useEffect,
  useState,
} from 'react';
import { Link } from 'react-router-dom';
import type { AxiosError } from 'axios';

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
                'Erro ao carregar o dashboard.',
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
          Carregando dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      <section className="rounded-3xl border border-gray-100 bg-gradient-to-br from-amber-50 to-yellow-50 p-6 shadow-sm">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-amber-700">
          Visão geral
        </p>

        <h2 className="mt-2 text-3xl font-black tracking-tight text-gray-950">
          Dashboard administrativo
        </h2>

        <p className="mt-2 max-w-2xl text-sm text-gray-600">
          Acompanhe os principais indicadores do
          Apiário Vitória Seven.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
            Pedidos válidos para faturamento
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
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-black text-gray-950">
                Situação dos pedidos
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Resumo dos principais status.
              </p>
            </div>

            <Link
              to="/admin/pedidos"
              className="text-sm font-black text-amber-700 hover:text-amber-900"
            >
              Ver pedidos →
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

              <p className="mt-1 text-sm font-bold text-yellow-700">
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

              <p className="mt-1 text-sm font-bold text-green-700">
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

              <p className="mt-1 text-sm font-bold text-red-700">
                Cancelados
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-black text-gray-950">
            Catálogo
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Estado atual dos itens disponíveis.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-amber-50 p-4">
              <p className="text-2xl font-black text-amber-800">
                {
                  summary.categorias
                    .ativas
                }
              </p>

              <p className="mt-1 text-sm font-bold text-amber-700">
                Categorias ativas
              </p>
            </div>

            <div className="rounded-2xl bg-green-50 p-4">
              <p className="text-2xl font-black text-green-700">
                {
                  summary.produtos
                    .ativos
                }
              </p>

              <p className="mt-1 text-sm font-bold text-green-700">
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

              <p className="mt-1 text-sm font-bold text-red-700">
                Sem estoque
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Link
          to="/admin/produtos"
          className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-amber-200 hover:shadow-md"
        >
          <span className="text-3xl">
            📦
          </span>

          <h3 className="mt-4 font-black text-gray-950">
            Gerenciar produtos
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Estoque, preços e vitrine.
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
            Gerenciar categorias
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Organização do catálogo.
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
            Gerenciar clientes
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Contas e permissões.
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
            Gerenciar pedidos
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Compras e entregas.
          </p>
        </Link>
      </section>
    </div>
  );
}
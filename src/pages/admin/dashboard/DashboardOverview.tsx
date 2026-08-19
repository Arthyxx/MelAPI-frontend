import { Link } from 'react-router-dom';

import type {
  DashboardSummary,
} from './dashboard.types';

interface DashboardOverviewProps {
  summary: DashboardSummary;
}

export function DashboardOverview({
  summary,
}: DashboardOverviewProps) {
  return (
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
  );
}
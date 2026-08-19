import {
  formatCurrency,
} from '../../../utils/formatCurrency';

import type {
  DashboardSummary,
} from './dashboard.types';

interface DashboardNumbersProps {
  summary: DashboardSummary;
}

export function DashboardNumbers({
  summary,
}: DashboardNumbersProps) {
  return (
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
              summary.faturamento
                .total,
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
            {
              summary.clientes
                .ativos
            }
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
            {
              summary.produtos
                .ativos
            }
          </p>

          <p className="mt-1 text-sm font-semibold text-gray-500">
            Produtos ativos
          </p>
        </div>
      </div>
    </section>
  );
}
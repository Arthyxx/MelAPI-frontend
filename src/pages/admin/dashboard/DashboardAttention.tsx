import { Link } from 'react-router-dom';

import type {
  DashboardSummary,
} from './dashboard.types';

interface DashboardAttentionProps {
  summary: DashboardSummary;
}

export function DashboardAttention({
  summary,
}: DashboardAttentionProps) {
  const hasPendingOrders =
    summary.pedidos.pendentes > 0;

  const hasOutOfStockProducts =
    summary.produtos.semEstoque > 0;

  const needsAttention =
    hasPendingOrders ||
    hasOutOfStockProducts;

  return (
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
  );
}
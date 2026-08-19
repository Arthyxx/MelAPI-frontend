import { formatCurrency } from '../../../utils/formatCurrency';

interface PedidosSummaryProps {
  totalItems: number;
  pedidosPendentesNaPagina: number;
  pedidosEntreguesNaPagina: number;
  faturamentoNaPagina: number;
}

export function PedidosSummary({
  totalItems,
  pedidosPendentesNaPagina,
  pedidosEntreguesNaPagina,
  faturamentoNaPagina,
}: PedidosSummaryProps) {
  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p className="text-sm font-black uppercase tracking-[0.2em] text-amber-700">
          Administração
        </p>

        <h2 className="mt-2 text-3xl font-black tracking-tight text-gray-950">
          Pedidos
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          Acompanhe pedidos, produtos
          comprados e status de entrega.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 text-center md:grid-cols-4">
        <div className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3">
          <p className="text-2xl font-black text-gray-950">
            {totalItems}
          </p>

          <p className="text-xs font-bold text-gray-500">
            Encontrados
          </p>
        </div>

        <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3">
          <p className="text-2xl font-black text-amber-700">
            {pedidosPendentesNaPagina}
          </p>

          <p className="text-xs font-bold text-amber-700">
            Pendentes na página
          </p>
        </div>

        <div className="rounded-2xl border border-green-100 bg-green-50 px-4 py-3">
          <p className="text-2xl font-black text-green-700">
            {pedidosEntreguesNaPagina}
          </p>

          <p className="text-xs font-bold text-green-700">
            Entregues na página
          </p>
        </div>

        <div className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3">
          <p className="text-lg font-black text-blue-700">
            {formatCurrency(
              faturamentoNaPagina,
            )}
          </p>

          <p className="text-xs font-bold text-blue-700">
            Total da página
          </p>
        </div>
      </div>
    </div>
  );
}
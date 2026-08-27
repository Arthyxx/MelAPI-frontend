import {
  formatCurrency,
} from '../../utils/formatCurrency';

interface CarrinhoSummaryProps {
  totalItems: number;
  subtotal: number;
  discount: number;
  shippingLabel: string;
  finalTotal: number;
  loading: boolean;
  isEmpty: boolean;
  shippingSelected: boolean;
  onFinishOrder: () => void;
}

export function CarrinhoSummary({
  totalItems,
  subtotal,
  discount,
  shippingLabel,
  finalTotal,
  loading,
  isEmpty,
  shippingSelected,
  onFinishOrder,
}: CarrinhoSummaryProps) {
  const canFinishOrder =
    !loading &&
    !isEmpty &&
    shippingSelected;

  return (
    <aside className="h-fit rounded-[2rem] border border-amber-200 bg-white/90 p-6 shadow-2xl backdrop-blur-xl dark:border-amber-800 dark:bg-gray-900/90 lg:sticky lg:top-28">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-100 to-yellow-100 text-2xl shadow-inner dark:from-amber-950 dark:to-gray-900">
          🧾
        </div>

        <div>
          <h2 className="text-xl font-black text-amber-950 dark:text-amber-300">
            Resumo do pedido
          </h2>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            Confira os valores antes
            de finalizar
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-4 border-t border-amber-100 pt-6 dark:border-amber-900">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">
            Quantidade
          </span>

          <span className="font-black text-gray-900 dark:text-white">
            {totalItems}{' '}
            {totalItems === 1
              ? 'item'
              : 'itens'}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">
            Subtotal
          </span>

          <span className="font-black text-gray-900 dark:text-white">
            {formatCurrency(
              subtotal,
            )}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">
            Frete
          </span>

          <span className="font-black text-amber-700 dark:text-amber-300">
            {shippingLabel}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">
            Desconto
          </span>

          <span className="font-black text-gray-900 dark:text-white">
            {formatCurrency(
              discount,
            )}
          </span>
        </div>

        <div className="rounded-3xl bg-amber-50 p-5 dark:bg-amber-950/30">
          <p className="text-sm font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Total do pedido
          </p>

          <p className="mt-1 text-4xl font-black text-amber-700 dark:text-amber-300">
            {formatCurrency(
              finalTotal,
            )}
          </p>

          <p className="mt-2 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
            {shippingSelected
              ? 'O valor acima já inclui o frete selecionado.'
              : 'Calcule o frete e selecione uma opção de entrega para continuar.'}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onFinishOrder}
        disabled={!canFinishOrder}
        className="group relative mt-6 w-full overflow-hidden rounded-2xl bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 px-6 py-4 font-black text-white shadow-xl transition hover:-translate-y-1 hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-70"
      >
        <span className="absolute inset-0 translate-x-[-100%] bg-white/20 transition duration-700 group-hover:translate-x-[100%]" />

        <span className="relative flex items-center justify-center gap-2">
          {loading ? (
            <>
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />

              Finalizando...
            </>
          ) : (
            <>
              Finalizar pedido

              <span className="transition group-hover:translate-x-1">
                →
              </span>
            </>
          )}
        </span>
      </button>

      <p className="mt-4 text-center text-xs leading-relaxed text-gray-500 dark:text-gray-400">
        {shippingSelected
          ? 'Após finalizar, o pedido aparecerá em “Meus pedidos” para acompanhamento.'
          : 'Selecione uma opção de frete antes de finalizar o pedido.'}
      </p>
    </aside>
  );
}

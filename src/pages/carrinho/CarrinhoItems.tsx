import type {
  CartItem,
} from '../../utils/cart';
import {
  formatCurrency,
} from '../../utils/formatCurrency';

interface CarrinhoItemsProps {
  items: CartItem[];
  totalItems: number;
  onUpdateQuantity: (
    productId: number,
    quantity: number,
  ) => void;
  onRemoveItem: (
    productId: number,
  ) => void;
  onOpenClearCartModal: () => void;
}

export function CarrinhoItems({
  items,
  totalItems,
  onUpdateQuantity,
  onRemoveItem,
  onOpenClearCartModal,
}: CarrinhoItemsProps) {
  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 rounded-[2rem] border border-amber-200 bg-white/85 p-5 shadow-sm backdrop-blur-xl dark:border-amber-800 dark:bg-gray-900/85 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-black text-amber-950 dark:text-amber-300">
            Produtos selecionados
          </h2>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {totalItems}{' '}
            {totalItems === 1
              ? 'item'
              : 'itens'}{' '}
            no carrinho
          </p>
        </div>

        <button
          type="button"
          onClick={
            onOpenClearCartModal
          }
          className="w-fit rounded-2xl border border-red-200 bg-white px-5 py-3 text-sm font-black text-red-600 shadow-sm transition hover:-translate-y-0.5 hover:bg-red-50 hover:shadow-md dark:border-red-900 dark:bg-gray-950 dark:text-red-300 dark:hover:bg-red-950/30"
        >
          Limpar carrinho
        </button>
      </div>

      {items.map((item) => (
        <article
          key={item.id}
          className="overflow-hidden rounded-[2rem] border border-amber-200 bg-white/90 shadow-lg backdrop-blur-xl transition hover:-translate-y-1 hover:shadow-2xl dark:border-amber-800 dark:bg-gray-900/90"
        >
          <div className="grid gap-0 md:grid-cols-[180px_1fr]">
            <div className="relative flex min-h-[180px] items-center justify-center bg-gradient-to-br from-amber-100 via-yellow-100 to-orange-100 dark:from-amber-950 dark:via-gray-900 dark:to-gray-950">
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-7xl drop-shadow-md">
                  🍯
                </span>
              )}
            </div>

            <div className="flex flex-col gap-5 p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-xl font-black text-amber-950 dark:text-amber-300">
                    {item.name}
                  </h3>

                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Estoque disponível:{' '}
                    {
                      item.stockQuantity
                    }
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    onRemoveItem(
                      item.id,
                    )
                  }
                  className="w-fit rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-black text-red-600 shadow-sm transition hover:-translate-y-0.5 hover:bg-red-50 hover:shadow-md dark:border-red-900 dark:bg-gray-950 dark:text-red-300 dark:hover:bg-red-950/30"
                >
                  Remover
                </button>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Preço unitário
                  </p>

                  <p className="text-2xl font-black text-amber-700 dark:text-amber-300">
                    {formatCurrency(
                      item.price,
                    )}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      onUpdateQuantity(
                        item.id,
                        item.quantity -
                          1,
                      )
                    }
                    disabled={
                      item.quantity <= 1
                    }
                    className="flex h-11 w-11 items-center justify-center rounded-2xl border border-amber-200 bg-white text-xl font-black text-amber-800 shadow-sm transition hover:-translate-y-0.5 hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-amber-800 dark:bg-gray-950 dark:text-amber-300"
                  >
                    −
                  </button>

                  <span className="min-w-10 text-center text-lg font-black text-gray-900 dark:text-white">
                    {item.quantity}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      onUpdateQuantity(
                        item.id,
                        item.quantity +
                          1,
                      )
                    }
                    disabled={
                      item.quantity >=
                      item.stockQuantity
                    }
                    className="flex h-11 w-11 items-center justify-center rounded-2xl border border-amber-200 bg-white text-xl font-black text-amber-800 shadow-sm transition hover:-translate-y-0.5 hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-amber-800 dark:bg-gray-950 dark:text-amber-300"
                  >
                    +
                  </button>
                </div>

                <div className="text-left sm:text-right">
                  <p className="text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Subtotal
                  </p>

                  <p className="text-2xl font-black text-amber-700 dark:text-amber-300">
                    {formatCurrency(
                      item.price *
                        item.quantity,
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
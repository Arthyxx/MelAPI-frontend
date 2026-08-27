import { Link } from 'react-router-dom';

import {
  ConfirmModal,
} from '../components/ui/ConfirmModal';
import {
  formatCurrency,
} from '../utils/formatCurrency';

import {
  CarrinhoFrete,
} from './carrinho/CarrinhoFrete';
import {
  CarrinhoHeader,
} from './carrinho/CarrinhoHeader';
import {
  CarrinhoItems,
} from './carrinho/CarrinhoItems';
import {
  CarrinhoSummary,
} from './carrinho/CarrinhoSummary';
import {
  useCarrinho,
} from './carrinho/useCarrinho';
import {
  useFinalizarPedido,
} from './carrinho/useFinalizarPedido';
import {
  useFrete,
} from './carrinho/useFrete';

export function Carrinho() {
  const carrinho = useCarrinho();

  const frete = useFrete({
    items: carrinho.items,
  });

  const pedido =
    useFinalizarPedido({
      items: carrinho.items,

      shippingServiceId:
        frete.selectedOption
          ?.serviceId,

      onOrderCreated:
        carrinho.clearItemsAfterOrder,
    });

  const shippingPrice =
    frete.selectedOption
      ?.price ?? 0;

  const shippingLabel =
    frete.selectedOption
      ? formatCurrency(
          shippingPrice,
        )
      : 'Não calculado';

  const finalTotal =
    carrinho.subtotal -
    carrinho.discount +
    shippingPrice;

  const handleUpdateQuantity = (
    productId: number,
    quantity: number,
  ) => {
    carrinho.updateQuantity(
      productId,
      quantity,
    );

    frete.invalidateFrete();
  };

  const handleRemoveItem = (
    productId: number,
  ) => {
    carrinho.removeItem(
      productId,
    );

    frete.invalidateFrete();
  };

  const handleOpenClearCartModal =
    () => {
      pedido.clearMessages();
      carrinho.openClearCartModal();
    };

  const handleConfirmClearCart =
    () => {
      carrinho.clearAllItems();
      frete.invalidateFrete();

      pedido.setSuccessMessage(
        'Carrinho limpo com sucesso.',
      );
    };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100 dark:from-gray-950 dark:via-gray-900 dark:to-amber-950">
      <CarrinhoHeader />

      <main className="container mx-auto px-4 py-10">
        {pedido.error && (
          <div
            role="alert"
            className="mb-6 rounded-2xl border border-red-300 bg-red-50 px-5 py-4 text-sm font-medium text-red-700 shadow-sm dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
          >
            {pedido.error}
          </div>
        )}

        {pedido.success && (
          <div
            role="status"
            className="mb-6 rounded-2xl border border-green-300 bg-green-50 px-5 py-4 text-sm font-medium text-green-700 shadow-sm dark:border-green-900 dark:bg-green-950/40 dark:text-green-300"
          >
            {pedido.success}
          </div>
        )}

        {carrinho.isEmpty ? (
          <section className="mx-auto max-w-2xl overflow-hidden rounded-[2rem] border border-amber-200 bg-white/90 p-10 text-center shadow-2xl backdrop-blur-xl dark:border-amber-800 dark:bg-gray-900/90">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[2rem] bg-gradient-to-br from-amber-100 to-yellow-100 text-6xl shadow-inner dark:from-amber-950 dark:to-gray-900">
              🧺
            </div>

            <h2 className="mt-6 text-3xl font-black text-amber-950 dark:text-amber-300">
              Seu carrinho está vazio
            </h2>

            <p className="mx-auto mt-3 max-w-md text-gray-600 dark:text-gray-400">
              Adicione produtos de mel à
              sua cesta antes de
              finalizar o pedido.
            </p>

            <Link
              to="/produtos"
              className="mt-7 inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 px-7 py-4 font-black text-white shadow-xl transition hover:-translate-y-1 hover:shadow-2xl"
            >
              <span>🍯</span>
              Ver produtos
            </Link>
          </section>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
            <CarrinhoItems
              items={carrinho.items}
              totalItems={
                carrinho.totalItems
              }
              onUpdateQuantity={
                handleUpdateQuantity
              }
              onRemoveItem={
                handleRemoveItem
              }
              onOpenClearCartModal={
                handleOpenClearCartModal
              }
            />

            <div className="space-y-4">
              <CarrinhoFrete
                zipCode={
                  frete.zipCode
                }
                options={
                  frete.options
                }
                selectedOption={
                  frete.selectedOption
                }
                loading={
                  frete.loading
                }
                error={
                  frete.error
                }
                onZipCodeChange={
                  frete.handleZipCodeChange
                }
                onCalculate={
                  frete.calcularFrete
                }
                onSelectOption={
                  frete.selectOption
                }
              />

              <CarrinhoSummary
                totalItems={
                  carrinho.totalItems
                }
                subtotal={
                  carrinho.subtotal
                }
                discount={
                  carrinho.discount
                }
                shippingLabel={
                  shippingLabel
                }
                finalTotal={
                  finalTotal
                }
                loading={
                  pedido.loading
                }
                isEmpty={
                  carrinho.isEmpty
                }
                onFinishOrder={
                  pedido.finalizarPedido
                }
              />
            </div>
          </div>
        )}
      </main>

      <ConfirmModal
        open={
          carrinho.clearCartModalOpen
        }
        title="Limpar carrinho?"
        description="Todos os produtos adicionados serão removidos da sua cesta. Essa ação não finaliza pedido nenhum, apenas limpa sua seleção atual."
        confirmText="Sim, limpar"
        cancelText="Manter produtos"
        variant="warning"
        onConfirm={
          handleConfirmClearCart
        }
        onCancel={
          carrinho.closeClearCartModal
        }
      />
    </div>
  );
}

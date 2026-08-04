import { useEffect, useMemo, useState } from 'react';
import type { AxiosError } from 'axios';
import { Link, useNavigate } from 'react-router-dom';

import { ConfirmModal } from '../components/ui/ConfirmModal';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';

import {
  clearCart,
  getCart,
  removeFromCart,
  saveCart,
  type CartItem,
} from '../utils/cart';
import { formatCurrency } from '../utils/formatCurrency';

interface ApiErrorResponse {
  message?: string | string[];
  error?: string;
}

export function Carrinho() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [clearCartModalOpen, setClearCartModalOpen] =
    useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    setItems(getCart());
  }, []);

  const total = useMemo(() => {
    return items.reduce(
      (sum, item) =>
        sum + item.price * item.quantity,
      0,
    );
  }, [items]);

  const totalItems = useMemo(() => {
    return items.reduce(
      (sum, item) =>
        sum + item.quantity,
      0,
    );
  }, [items]);

  const subtotal = total;
  const discount = 0;
  const shippingLabel = 'A combinar';
  const finalTotal = subtotal - discount;

  const updateQuantity = (
    productId: number,
    quantity: number,
  ) => {
    const updatedItems = items.map((item) => {
      if (item.id !== productId) {
        return item;
      }

      const safeQuantity = Math.max(
        1,
        Math.min(
          quantity,
          item.stockQuantity,
        ),
      );

      return {
        ...item,
        quantity: safeQuantity,
      };
    });

    setItems(updatedItems);
    saveCart(updatedItems);
  };

  const handleRemove = (productId: number) => {
    const updatedItems =
      removeFromCart(productId);

    setItems(updatedItems);
  };

  const handleOpenClearCartModal = () => {
    if (items.length === 0) {
      return;
    }

    setError('');
    setSuccess('');
    setClearCartModalOpen(true);
  };

  const handleConfirmClearCart = () => {
    clearCart();
    setItems([]);
    setClearCartModalOpen(false);
    setSuccess(
      'Carrinho limpo com sucesso.',
    );
  };

  const handleFinishOrder = async () => {
    try {
      setError('');
      setSuccess('');

      if (!isAuthenticated) {
        navigate('/login', {
          replace: true,
        });

        return;
      }

      if (items.length === 0) {
        setError(
          'O carrinho está vazio.',
        );

        return;
      }

      setLoading(true);

      const payload = {
        items: items.map((item) => ({
          produtoId: item.id,
          quantity: item.quantity,
        })),
      };

      await api.post('/pedidos', payload);

      clearCart();
      setItems([]);

      setSuccess(
        'Pedido criado com sucesso!',
      );

      window.setTimeout(() => {
        navigate('/meus-pedidos', {
          replace: true,
        });
      }, 1200);
    } catch (error) {
      const axiosError =
        error as AxiosError<ApiErrorResponse>;

      const apiMessage =
        axiosError.response?.data?.message;

      console.error(
        'Erro ao finalizar pedido:',
        {
          statusCode:
            axiosError.response?.status,
          data:
            axiosError.response?.data,
          message:
            axiosError.message,
        },
      );

      if (Array.isArray(apiMessage)) {
        setError(apiMessage.join(' '));
        return;
      }

      setError(
        apiMessage ||
          axiosError.response?.data?.error ||
          'Erro ao finalizar pedido. Verifique o estoque dos produtos e tente novamente.',
      );
    } finally {
      setLoading(false);
    }
  };

  const isEmpty = items.length === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100 dark:from-gray-950 dark:via-gray-900 dark:to-amber-950">
      <header className="sticky top-0 z-30 border-b border-amber-300/40 bg-amber-950/90 text-white shadow-xl backdrop-blur-md dark:bg-gray-950/90">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <Link
              to="/produtos"
              className="flex items-center gap-3"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-600 shadow-inner">
                <span className="text-3xl">
                  🛒
                </span>
              </div>

              <div>
                <h1 className="text-2xl font-black tracking-tight">
                  Meu Carrinho
                </h1>

                <p className="text-sm text-amber-100">
                  Revise seus produtos antes de
                  finalizar o pedido
                </p>
              </div>
            </Link>

            <div className="flex flex-wrap gap-2">
              <Link
                to="/meus-pedidos"
                className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-white/20 hover:shadow-lg"
              >
                <span>📦</span>
                Meus pedidos
              </Link>

              <Link
                to="/produtos"
                className="inline-flex w-fit items-center gap-2 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 px-5 py-2 text-sm font-black text-amber-950 shadow-lg transition hover:-translate-y-0.5 hover:from-yellow-300 hover:to-amber-400 hover:shadow-xl"
              >
                <span>←</span>
                Continuar comprando
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10">
        {error && (
          <div className="mb-6 rounded-2xl border border-red-300 bg-red-50 px-5 py-4 text-sm font-medium text-red-700 shadow-sm dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-2xl border border-green-300 bg-green-50 px-5 py-4 text-sm font-medium text-green-700 shadow-sm dark:border-green-900 dark:bg-green-950/40 dark:text-green-300">
            {success}
          </div>
        )}

        {isEmpty ? (
          <section className="mx-auto max-w-2xl overflow-hidden rounded-[2rem] border border-amber-200 bg-white/90 p-10 text-center shadow-2xl backdrop-blur-xl dark:border-amber-800 dark:bg-gray-900/90">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[2rem] bg-gradient-to-br from-amber-100 to-yellow-100 text-6xl shadow-inner dark:from-amber-950 dark:to-gray-900">
              🧺
            </div>

            <h2 className="mt-6 text-3xl font-black text-amber-950 dark:text-amber-300">
              Seu carrinho está vazio
            </h2>

            <p className="mx-auto mt-3 max-w-md text-gray-600 dark:text-gray-400">
              Adicione produtos de mel à sua cesta
              antes de finalizar o pedido.
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
                    handleOpenClearCartModal
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
                            {item.stockQuantity}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            handleRemove(
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
                              updateQuantity(
                                item.id,
                                item.quantity - 1,
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
                              updateQuantity(
                                item.id,
                                item.quantity + 1,
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
                    Confira os valores antes de
                    finalizar
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
                    Total dos produtos
                  </p>

                  <p className="mt-1 text-4xl font-black text-amber-700 dark:text-amber-300">
                    {formatCurrency(
                      finalTotal,
                    )}
                  </p>

                  <p className="mt-2 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                    Confira os valores antes de
                    finalizar o pedido.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleFinishOrder}
                disabled={
                  loading || isEmpty
                }
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
                Após finalizar, o pedido aparecerá
                em “Meus pedidos” para acompanhamento.
              </p>
            </aside>
          </div>
        )}
      </main>

      <ConfirmModal
        open={clearCartModalOpen}
        title="Limpar carrinho?"
        description="Todos os produtos adicionados serão removidos da sua cesta. Essa ação não finaliza pedido nenhum, apenas limpa sua seleção atual."
        confirmText="Sim, limpar"
        cancelText="Manter produtos"
        variant="warning"
        onConfirm={
          handleConfirmClearCart
        }
        onCancel={() =>
          setClearCartModalOpen(false)
        }
      />
    </div>
  );
}
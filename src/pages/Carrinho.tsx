import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  clearCart,
  getCart,
  removeFromCart,
  saveCart,
  type CartItem,
} from '../utils/cart';
import { api } from '../services/api';
import { decodeToken } from '../utils/decodeToken';

export function Carrinho() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    setItems(getCart());
  }, []);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const updateQuantity = (productId: number, quantity: number) => {
    const updatedItems = items.map((item) => {
      if (item.id !== productId) return item;

      const safeQuantity = Math.max(1, Math.min(quantity, item.stockQuantity));

      return {
        ...item,
        quantity: safeQuantity,
      };
    });

    setItems(updatedItems);
    saveCart(updatedItems);
  };

  const handleRemove = (productId: number) => {
    const updatedItems = removeFromCart(productId);
    setItems(updatedItems);
  };

  const handleClearCart = () => {
    const confirmed = window.confirm('Tem certeza que deseja limpar o carrinho?');

    if (!confirmed) return;

    clearCart();
    setItems([]);
  };

  const handleFinishOrder = async () => {
    try {
      setError('');
      setSuccess('');
      setLoading(true);

      const token = localStorage.getItem('token');

      if (!token) {
        navigate('/login');
        return;
      }

      const decoded = decodeToken(token);

      if (!decoded?.id) {
        setError('Não foi possível identificar o cliente logado.');
        return;
      }

      if (items.length === 0) {
        setError('O carrinho está vazio.');
        return;
      }

      const payload = {
        clienteId: decoded.id,
        items: items.map((item) => ({
          produtoId: item.id,
          quantity: item.quantity,
        })),
      };

      await api.post('/pedidos', payload);

      clearCart();
      setItems([]);

      setSuccess('Pedido criado com sucesso!');

      setTimeout(() => {
        navigate('/produtos');
      }, 1500);
    } catch {
      setError('Erro ao finalizar pedido. Verifique o estoque dos produtos e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100 dark:from-gray-950 dark:via-gray-900 dark:to-amber-950">
      <header className="sticky top-0 z-30 border-b border-amber-300/40 bg-amber-900/90 text-white shadow-xl backdrop-blur-md dark:bg-amber-950/90">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-700 shadow-inner">
                <span className="text-3xl">🛒</span>
              </div>

              <div>
                <h1 className="text-2xl font-extrabold tracking-tight">
                  Meu Carrinho
                </h1>
                <p className="text-sm text-amber-100">
                  Revise seus produtos antes de finalizar o pedido
                </p>
              </div>
            </div>

            <Link
              to="/produtos"
              className="inline-flex w-fit items-center gap-2 rounded-full bg-white/15 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/25"
            >
              <span>←</span>
              Continuar comprando
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10">
        {error && (
          <div className="mb-6 rounded-2xl border border-red-300 bg-red-50 px-5 py-4 text-red-700 shadow-sm dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-2xl border border-green-300 bg-green-50 px-5 py-4 text-green-700 shadow-sm dark:border-green-900 dark:bg-green-950/40 dark:text-green-300">
            {success}
          </div>
        )}

        {items.length === 0 ? (
          <section className="mx-auto max-w-2xl overflow-hidden rounded-3xl border border-amber-200 bg-white shadow-2xl dark:border-amber-800 dark:bg-gray-900">
            <div className="bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 px-6 py-12 text-center text-white">
              <div className="mb-4 text-7xl">🍯</div>

              <h2 className="text-3xl font-extrabold">
                Seu carrinho está vazio
              </h2>

              <p className="mx-auto mt-3 max-w-md text-amber-50">
                Adicione alguns produtos naturais do apiário antes de finalizar seu pedido.
              </p>
            </div>

            <div className="p-8 text-center">
              <Link
                to="/produtos"
                className="inline-flex items-center justify-center rounded-2xl bg-amber-600 px-8 py-3 font-bold text-white shadow-lg transition hover:bg-amber-700 hover:shadow-xl"
              >
                Ver produtos disponíveis
              </Link>
            </div>
          </section>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <section className="lg:col-span-2">
              <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-amber-800">
                    Checkout
                  </span>

                  <h2 className="mt-3 text-3xl font-extrabold text-amber-900 dark:text-amber-300">
                    Produtos selecionados
                  </h2>

                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {totalItems} {totalItems === 1 ? 'item no carrinho' : 'itens no carrinho'}
                  </p>
                </div>

                <button
                  onClick={handleClearCart}
                  className="w-fit rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
                >
                  Limpar carrinho
                </button>
              </div>

              <div className="space-y-5">
                {items.map((item) => (
                  <article
                    key={item.id}
                    className="group overflow-hidden rounded-3xl border border-amber-200 bg-white shadow-lg transition hover:-translate-y-1 hover:shadow-2xl dark:border-amber-800 dark:bg-gray-900"
                  >
                    <div className="flex flex-col md:flex-row">
                      <div className="relative flex h-48 items-center justify-center bg-gradient-to-br from-amber-100 via-yellow-100 to-orange-100 md:h-auto md:w-52 dark:from-amber-950 dark:via-gray-800 dark:to-gray-900">
                        <span className="text-7xl drop-shadow-md transition duration-500 group-hover:scale-110">
                          🍯
                        </span>

                        {item.quantity >= item.stockQuantity && (
                          <span className="absolute left-3 top-3 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white shadow-md">
                            Máximo no estoque
                          </span>
                        )}
                      </div>

                      <div className="flex flex-1 flex-col justify-between p-5">
                        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                          <div>
                            <h3 className="text-xl font-extrabold text-amber-900 dark:text-amber-300">
                              {item.name}
                            </h3>

                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                              Produto natural selecionado para seu pedido.
                            </p>

                            <div className="mt-3 flex flex-wrap gap-2">
                              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                                100% natural
                              </span>

                              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                                Estoque: {item.stockQuantity}
                              </span>
                            </div>
                          </div>

                          <div className="text-left md:text-right">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Preço unitário
                            </p>

                            <p className="text-2xl font-extrabold text-amber-700 dark:text-amber-300">
                              R$ {item.price.toFixed(2)}
                            </p>
                          </div>
                        </div>

                        <div className="mt-6 flex flex-col gap-4 border-t border-amber-100 pt-5 md:flex-row md:items-center md:justify-between dark:border-amber-900">
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                              Quantidade
                            </span>

                            <div className="flex overflow-hidden rounded-2xl border border-amber-200 bg-white shadow-sm dark:border-amber-800 dark:bg-gray-950">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="px-4 py-2 font-bold text-amber-800 transition hover:bg-amber-100 dark:text-amber-300 dark:hover:bg-gray-800"
                              >
                                -
                              </button>

                              <input
                                type="number"
                                min={1}
                                max={item.stockQuantity}
                                value={item.quantity}
                                onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                                className="w-16 border-x border-amber-100 bg-white px-2 py-2 text-center font-bold text-gray-900 outline-none dark:border-amber-900 dark:bg-gray-950 dark:text-white"
                              />

                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="px-4 py-2 font-bold text-amber-800 transition hover:bg-amber-100 dark:text-amber-300 dark:hover:bg-gray-800"
                              >
                                +
                              </button>
                            </div>
                          </div>

                          <div className="flex items-center justify-between gap-5 md:justify-end">
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Subtotal
                              </p>

                              <p className="text-xl font-extrabold text-amber-800 dark:text-amber-300">
                                R$ {(item.price * item.quantity).toFixed(2)}
                              </p>
                            </div>

                            <button
                              onClick={() => handleRemove(item.id)}
                              className="rounded-full bg-red-50 px-4 py-2 text-sm font-bold text-red-600 transition hover:bg-red-100 dark:bg-red-950/40 dark:text-red-300"
                            >
                              Remover
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <aside className="lg:sticky lg:top-28 lg:h-fit">
              <div className="overflow-hidden rounded-3xl border border-amber-200 bg-white shadow-2xl dark:border-amber-800 dark:bg-gray-900">
                <div className="bg-gradient-to-r from-amber-700 via-yellow-600 to-amber-700 px-6 py-6 text-white">
                  <p className="text-sm font-semibold uppercase tracking-wide text-amber-100">
                    Resumo
                  </p>

                  <h2 className="mt-1 text-3xl font-extrabold">
                    Seu pedido
                  </h2>
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between text-gray-600 dark:text-gray-300">
                      <span>Itens</span>
                      <span className="font-semibold">{totalItems}</span>
                    </div>

                    <div className="flex justify-between text-gray-600 dark:text-gray-300">
                      <span>Subtotal</span>
                      <span className="font-semibold">R$ {total.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between text-gray-600 dark:text-gray-300">
                      <span>Entrega</span>
                      <span className="font-semibold text-amber-700 dark:text-amber-300">
                        A combinar
                      </span>
                    </div>

                    <div className="rounded-2xl bg-amber-50 p-4 text-sm text-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
                      <p className="font-bold">📦 Entrega</p>
                      <p className="mt-1">
                        O valor/frete pode ser confirmado pelo vendedor após o pedido.
                      </p>
                    </div>
                  </div>

                  <div className="my-6 border-t border-amber-100 dark:border-amber-900"></div>

                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Total estimado
                      </p>

                      <p className="text-xs text-gray-400">
                        Sem taxa de entrega
                      </p>
                    </div>

                    <p className="text-3xl font-black text-amber-700 dark:text-amber-300">
                      R$ {total.toFixed(2)}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleFinishOrder}
                    disabled={loading}
                    className="mt-6 w-full rounded-2xl bg-gradient-to-r from-amber-600 to-yellow-600 py-4 font-extrabold text-white shadow-lg transition hover:from-amber-700 hover:to-yellow-700 hover:shadow-xl active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? 'Finalizando pedido...' : 'Finalizar pedido'}
                  </button>

                  <Link
                    to="/produtos"
                    className="mt-3 block rounded-2xl border border-amber-200 px-4 py-3 text-center text-sm font-bold text-amber-800 transition hover:bg-amber-50 dark:border-amber-800 dark:text-amber-300 dark:hover:bg-gray-800"
                  >
                    Adicionar mais produtos
                  </Link>

                  <div className="mt-6 grid grid-cols-3 gap-2 text-center text-xs text-gray-500 dark:text-gray-400">
                    <div className="rounded-2xl bg-gray-50 p-3 dark:bg-gray-800">
                      <div className="text-lg">🐝</div>
                      Natural
                    </div>

                    <div className="rounded-2xl bg-gray-50 p-3 dark:bg-gray-800">
                      <div className="text-lg">🍯</div>
                      Artesanal
                    </div>

                    <div className="rounded-2xl bg-gray-50 p-3 dark:bg-gray-800">
                      <div className="text-lg">📦</div>
                      Entrega
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}
import { useEffect, useRef, useState } from 'react';
import {
  Link,
  useNavigate,
  useParams,
} from 'react-router-dom';

import { StoreFooter } from '../components/layout/StoreFooter';
import { StoreHeader } from '../components/layout/StoreHeader';
import { StoreSidebarMenu } from '../components/layout/StoreSidebarMenu';
import { ProdutosGrid } from '../components/produtos/ProdutosGrid';
import { CartToast } from '../components/ui/CartToast';

import { useAuth } from '../contexts/AuthContext';

import {
  findAllCategorias,
  findCategoriaById,
} from '../services/categoriaService';
import { findAllProdutos } from '../services/produtoService';

import type { Categoria } from '../types/categoria';
import type { Produto } from '../types/produto';

import {
  addToCart,
  getCartItemsCount,
} from '../utils/cart';

const ordenacoes = [
  {
    label: 'Padrão',
    value: '',
  },
  {
    label: 'Menor preço',
    value: 'price,asc',
  },
  {
    label: 'Maior preço',
    value: 'price,desc',
  },
  {
    label: 'Nome A-Z',
    value: 'name,asc',
  },
];

export function CategoriaProdutos() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    user,
    isAuthenticated,
    signOut,
  } = useAuth();

  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoria, setCategoria] =
    useState<Categoria | null>(null);

  const [primeiroCarregamento, setPrimeiroCarregamento] =
    useState(true);
  const [filtrando, setFiltrando] = useState(false);
  const [erro, setErro] = useState('');

  const [busca, setBusca] = useState('');
  const [somenteDisponiveis, setSomenteDisponiveis] =
    useState(false);
  const [ordenacao, setOrdenacao] = useState('');

  const [cartItemsCount, setCartItemsCount] = useState(
    getCartItemsCount(),
  );
  const [menuOpen, setMenuOpen] = useState(false);

  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const toastTimeoutRef = useRef<number | null>(null);

  const hasFilters = Boolean(
    busca || ordenacao || somenteDisponiveis,
  );

  useEffect(() => {
    const buscarCategorias = async () => {
      try {
        const categoriasData = await findAllCategorias();
        setCategorias(categoriasData);
      } catch (error) {
        console.error(
          'Erro ao carregar categorias:',
          error,
        );
      }
    };

    void buscarCategorias();
  }, []);

  useEffect(() => {
    const buscarCategoria = async () => {
      if (!id) {
        setErro('Categoria não encontrada.');
        setPrimeiroCarregamento(false);
        return;
      }

      try {
        const categoriaData =
          await findCategoriaById(id);

        setCategoria(categoriaData);
      } catch (error) {
        console.error(
          'Erro ao carregar categoria:',
          error,
        );

        setErro('Categoria não encontrada.');
      }
    };

    void buscarCategoria();
  }, [id]);

  useEffect(() => {
    const buscarProdutosDaCategoria = async () => {
      if (!id) {
        setPrimeiroCarregamento(false);
        return;
      }

      const categoryId = Number(id);

      if (!Number.isInteger(categoryId) || categoryId <= 0) {
        setErro('Categoria não encontrada.');
        setPrimeiroCarregamento(false);
        return;
      }

      try {
        setErro('');

        if (!primeiroCarregamento) {
          setFiltrando(true);
        }

        const produtosData = await findAllProdutos({
          name: busca,
          categoryId,
          active: true,
          sort: ordenacao || undefined,
        });

        const produtosFiltradosPorEstoque =
          somenteDisponiveis
            ? produtosData.filter(
                (produto) =>
                  produto.stockQuantity > 0,
              )
            : produtosData;

        setProdutos(produtosFiltradosPorEstoque);
      } catch (error) {
        console.error(
          'Erro ao carregar produtos da categoria:',
          error,
        );

        setErro(
          'Erro ao carregar produtos desta categoria.',
        );
      } finally {
        setPrimeiroCarregamento(false);
        setFiltrando(false);
      }
    };

    const timeoutId = window.setTimeout(
      () => {
        void buscarProdutosDaCategoria();
      },
      primeiroCarregamento ? 0 : 350,
    );

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [
    id,
    busca,
    somenteDisponiveis,
    ordenacao,
    primeiroCarregamento,
  ]);

  useEffect(() => {
    const atualizarQuantidadeCarrinho = () => {
      setCartItemsCount(getCartItemsCount());
    };

    window.addEventListener(
      'storage',
      atualizarQuantidadeCarrinho,
    );

    return () => {
      window.removeEventListener(
        'storage',
        atualizarQuantidadeCarrinho,
      );

      if (toastTimeoutRef.current !== null) {
        window.clearTimeout(
          toastTimeoutRef.current,
        );
      }
    };
  }, []);

  const showCartToast = (message: string) => {
    setToastMessage(message);
    setToastVisible(true);

    if (toastTimeoutRef.current !== null) {
      window.clearTimeout(
        toastTimeoutRef.current,
      );
    }

    toastTimeoutRef.current = window.setTimeout(
      () => {
        setToastVisible(false);
      },
      3000,
    );
  };

  const handleLogout = () => {
    signOut();

    setCartItemsCount(0);
    setMenuOpen(false);

    navigate('/produtos', {
      replace: true,
    });
  };

  const handleAddToCart = (produto: Produto) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      const updatedCart = addToCart({
        id: produto.id,
        name: produto.name,
        price: produto.price,
        stockQuantity: produto.stockQuantity,
        imageUrl: produto.imageUrl,
      });

      const totalItems = updatedCart.reduce(
        (total, item) =>
          total + item.quantity,
        0,
      );

      setCartItemsCount(totalItems);

      showCartToast(
        `${produto.name} foi adicionado ao carrinho.`,
      );
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
        return;
      }

      alert(
        'Erro ao adicionar produto ao carrinho.',
      );
    }
  };

  const handleClearFilters = () => {
    setBusca('');
    setOrdenacao('');
    setSomenteDisponiveis(false);
  };

  if (primeiroCarregamento) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100 dark:from-gray-950 dark:via-gray-900 dark:to-amber-950">
        <div className="relative">
          <div className="mb-4 animate-spin-slow text-8xl drop-shadow-lg">
            🍯
          </div>

          <div className="absolute inset-0 animate-pulse-gentle rounded-full bg-amber-200/30 blur-xl" />
        </div>

        <p className="mt-4 text-xl font-bold text-amber-700 dark:text-amber-300">
          Carregando categoria...
        </p>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100 px-4 dark:from-gray-950 dark:via-gray-900 dark:to-amber-950">
        <div className="max-w-md rounded-3xl border border-red-200 bg-white p-8 text-center shadow-2xl dark:border-red-900 dark:bg-gray-900">
          <div className="mb-4 text-6xl">
            ⚠️
          </div>

          <h2 className="text-2xl font-black text-red-700 dark:text-red-300">
            Ops!
          </h2>

          <p className="mt-3 text-gray-600 dark:text-gray-400">
            {erro}
          </p>

          <Link
            to="/produtos"
            className="mt-6 inline-flex rounded-2xl bg-amber-600 px-6 py-3 font-bold text-white shadow-lg transition hover:-translate-y-1 hover:bg-amber-700 hover:shadow-xl"
          >
            Voltar para produtos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100 dark:from-gray-950 dark:via-gray-900 dark:to-amber-950">
      <StoreHeader
        isLogged={isAuthenticated}
        cartItemsCount={cartItemsCount}
        categorias={categorias}
        onOpenMenu={() =>
          setMenuOpen(true)
        }
      />

      <StoreSidebarMenu
        isLogged={isAuthenticated}
        menuOpen={menuOpen}
        cartItemsCount={cartItemsCount}
        role={user?.role ?? null}
        onClose={() =>
          setMenuOpen(false)
        }
        onLogout={handleLogout}
      />

      <CartToast
        message={toastMessage}
        visible={toastVisible}
        onClose={() =>
          setToastVisible(false)
        }
      />

      <main className="container mx-auto px-4 py-10">
        <section className="rounded-[2rem] border border-amber-200 bg-white/90 p-6 text-center shadow-sm backdrop-blur-xl dark:border-amber-800 dark:bg-gray-900/90 md:p-8">
          <div className="mx-auto max-w-3xl">
            <Link
              to="/produtos"
              className="inline-flex rounded-full bg-amber-50 px-4 py-2 text-sm font-black text-amber-800 transition hover:bg-amber-100 dark:bg-amber-950/30 dark:text-amber-300"
            >
              ← Todos os produtos
            </Link>

            <p className="mt-6 text-xs font-black uppercase tracking-[0.25em] text-amber-700 dark:text-amber-300">
              Categoria
            </p>

            <h1 className="mt-2 text-4xl font-black tracking-tight text-amber-950 dark:text-amber-300 md:text-5xl">
              {categoria?.name || 'Categoria'}
            </h1>

            {categoria?.description && (
              <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                {categoria.description}
              </p>
            )}

            <div className="mx-auto mt-7 max-w-2xl">
              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg">
                  🔎
                </span>

                <input
                  type="text"
                  value={busca}
                  onChange={(event) =>
                    setBusca(event.target.value)
                  }
                  placeholder="Buscar nesta categoria..."
                  className="h-14 w-full rounded-2xl border border-amber-200 bg-white px-12 text-center font-semibold text-gray-900 shadow-sm outline-none transition placeholder:text-gray-400 focus:border-amber-400 focus:ring-4 focus:ring-amber-100 dark:border-amber-800 dark:bg-gray-950 dark:text-white dark:focus:ring-amber-900"
                />
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              {ordenacoes.map((item) => {
                const selected =
                  ordenacao === item.value;

                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() =>
                      setOrdenacao(item.value)
                    }
                    className={`rounded-full px-4 py-2 text-sm font-black transition ${
                      selected
                        ? 'bg-amber-700 text-white shadow-sm'
                        : 'bg-amber-50 text-amber-800 hover:bg-amber-100 dark:bg-amber-950/30 dark:text-amber-300'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() =>
                  setSomenteDisponiveis(
                    (previousValue) =>
                      !previousValue,
                  )
                }
                className={`rounded-full px-4 py-2 text-sm font-black transition ${
                  somenteDisponiveis
                    ? 'bg-amber-950 text-white shadow-sm'
                    : 'bg-amber-50 text-amber-800 hover:bg-amber-100 dark:bg-amber-950/30 dark:text-amber-300'
                }`}
              >
                Disponíveis
                {somenteDisponiveis && ' ✓'}
              </button>

              {hasFilters && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="rounded-full px-4 py-2 text-sm font-black text-gray-500 transition hover:bg-gray-100 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                >
                  Limpar
                </button>
              )}
            </div>
          </div>
        </section>

        <div className="relative mt-8">
          {filtrando && (
            <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex justify-center">
              <div className="mt-4 rounded-full border border-amber-200 bg-white/90 px-4 py-2 text-sm font-black text-amber-800 shadow-lg backdrop-blur-md dark:border-amber-800 dark:bg-gray-950/90 dark:text-amber-300">
                Atualizando produtos...
              </div>
            </div>
          )}

          <div
            className={`transition duration-300 ${
              filtrando
                ? 'opacity-60'
                : 'opacity-100'
            }`}
          >
            <ProdutosGrid
              produtos={produtos}
              isLogged={isAuthenticated}
              onAddToCart={
                handleAddToCart
              }
              onClearSearch={
                handleClearFilters
              }
            />
          </div>
        </div>
      </main>

      <StoreFooter
        isLogged={isAuthenticated}
      />
    </div>
  );
}
import {
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Link,
  useNavigate,
  useParams,
} from 'react-router-dom';

import {
  StoreFooter,
} from '../components/layout/StoreFooter';
import {
  StoreHeader,
} from '../components/layout/StoreHeader';
import {
  StoreSidebarMenu,
} from '../components/layout/StoreSidebarMenu';
import {
  ProdutosGrid,
} from '../components/produtos/ProdutosGrid';
import {
  CartToast,
} from '../components/ui/CartToast';

import {
  useAuth,
} from '../contexts/useAuth';

import type {
  Produto,
} from '../types/produto';

import {
  addToCart,
  getCartItemsCount,
  type CartItem,
} from '../utils/cart';

import {
  CategoriaProdutosHero,
} from './categoria-produtos/CategoriaProdutosHero';
import {
  useCategoriaProdutos,
} from './categoria-produtos/useCategoriaProdutos';

export function CategoriaProdutos() {
  const { id } = useParams();

  const navigate = useNavigate();

  const {
    user,
    isAuthenticated,
    signOut,
  } = useAuth();

  const categoriaProdutos =
    useCategoriaProdutos({
      id,
    });

  const [
    cartItemsCount,
    setCartItemsCount,
  ] = useState(
    getCartItemsCount(),
  );

  const [
    menuOpen,
    setMenuOpen,
  ] = useState(false);

  const [
    toastVisible,
    setToastVisible,
  ] = useState(false);

  const [
    toastMessage,
    setToastMessage,
  ] = useState('');

  const toastTimeoutRef =
    useRef<number | null>(
      null,
    );

  useEffect(() => {
    const atualizarQuantidadeCarrinho =
      () => {
        setCartItemsCount(
          getCartItemsCount(),
        );
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

      if (
        toastTimeoutRef.current !==
        null
      ) {
        window.clearTimeout(
          toastTimeoutRef.current,
        );
      }
    };
  }, []);

  const showCartToast = (
    message: string,
  ) => {
    setToastMessage(message);
    setToastVisible(true);

    if (
      toastTimeoutRef.current !== null
    ) {
      window.clearTimeout(
        toastTimeoutRef.current,
      );
    }

    toastTimeoutRef.current =
      window.setTimeout(() => {
        setToastVisible(false);
      }, 3000);
  };

  const handleLogout = () => {
    signOut();

    setCartItemsCount(0);
    setMenuOpen(false);

    navigate('/produtos', {
      replace: true,
    });
  };

  const handleAddToCart = (
    produto: Produto,
  ) => {
    if (!isAuthenticated) {
      navigate('/login');

      return;
    }

    try {
      const updatedCart =
        addToCart({
          id: produto.id,
          name: produto.name,
          price: produto.price,
          stockQuantity:
            produto.stockQuantity,
          imageUrl:
            produto.imageUrl,
        });

      const totalItems =
        updatedCart.reduce(
          (
            total: number,
            item: CartItem,
          ) =>
            total +
            item.quantity,
          0,
        );

      setCartItemsCount(
        totalItems,
      );

      showCartToast(
        `${produto.name} foi adicionado ao carrinho.`,
      );
    } catch (error) {
      if (
        error instanceof Error
      ) {
        alert(error.message);

        return;
      }

      alert(
        'Erro ao adicionar produto ao carrinho.',
      );
    }
  };

  if (
    categoriaProdutos
      .primeiroCarregamento
  ) {
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

  if (categoriaProdutos.erro) {
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
            {categoriaProdutos.erro}
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
        isLogged={
          isAuthenticated
        }
        cartItemsCount={
          cartItemsCount
        }
        categorias={
          categoriaProdutos
            .categorias
        }
        onOpenMenu={() =>
          setMenuOpen(true)
        }
      />

      <StoreSidebarMenu
        isLogged={
          isAuthenticated
        }
        menuOpen={menuOpen}
        cartItemsCount={
          cartItemsCount
        }
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
        <CategoriaProdutosHero
          categoria={
            categoriaProdutos
              .categoria
          }
          busca={
            categoriaProdutos.busca
          }
          ordenacao={
            categoriaProdutos
              .ordenacao
          }
          somenteDisponiveis={
            categoriaProdutos
              .somenteDisponiveis
          }
          hasFilters={
            categoriaProdutos
              .hasFilters
          }
          onBuscaChange={
            categoriaProdutos
              .setBusca
          }
          onOrdenacaoChange={
            categoriaProdutos
              .setOrdenacao
          }
          onToggleDisponiveis={
            categoriaProdutos
              .toggleSomenteDisponiveis
          }
          onClearFilters={
            categoriaProdutos
              .clearFilters
          }
        />

        <div className="relative mt-8">
          {categoriaProdutos
            .filtrando && (
            <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex justify-center">
              <div className="mt-4 rounded-full border border-amber-200 bg-white/90 px-4 py-2 text-sm font-black text-amber-800 shadow-lg backdrop-blur-md dark:border-amber-800 dark:bg-gray-950/90 dark:text-amber-300">
                Atualizando produtos...
              </div>
            </div>
          )}

          <div
            className={`transition duration-300 ${
              categoriaProdutos
                .filtrando
                ? 'opacity-60'
                : 'opacity-100'
            }`}
          >
            <ProdutosGrid
              produtos={
                categoriaProdutos
                  .produtos
              }
              isLogged={
                isAuthenticated
              }
              onAddToCart={
                handleAddToCart
              }
              onClearSearch={
                categoriaProdutos
                  .clearFilters
              }
            />
          </div>
        </div>
      </main>

      <StoreFooter
        isLogged={
          isAuthenticated
        }
      />
    </div>
  );
}
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { StoreFooter } from '../components/layout/StoreFooter';
import { StoreHeader } from '../components/layout/StoreHeader';
import { StoreSidebarMenu } from '../components/layout/StoreSidebarMenu';
import { ProdutosBenefits } from '../components/produtos/ProdutosBenefits';
import { ProdutosGrid } from '../components/produtos/ProdutosGrid';
import { ProdutosHero } from '../components/produtos/ProdutosHero';
import { ProdutosInstitutional } from '../components/produtos/ProdutosInstitutional';
import { CartToast } from '../components/ui/CartToast';

import { useAuth } from '../contexts/AuthContext';
import { findAllCategorias } from '../services/categoriaService';
import { findAllProdutos } from '../services/produtoService';

import type { Categoria } from '../types/categoria';
import type { Produto } from '../types/produto';

import { addToCart, getCartItemsCount } from '../utils/cart';

export function Produtos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);

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

  const navigate = useNavigate();

  const {
    user,
    isAuthenticated,
    signOut,
  } = useAuth();

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
    const buscarProdutos = async () => {
      try {
        setErro('');

        if (!primeiroCarregamento) {
          setFiltrando(true);
        }

        const produtosData = await findAllProdutos({
          name: busca,
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
          'Erro ao carregar produtos:',
          error,
        );

        setErro(
          'Erro ao carregar produtos. Tente novamente em instantes.',
        );
      } finally {
        setPrimeiroCarregamento(false);
        setFiltrando(false);
      }
    };

    const timeoutId = window.setTimeout(
      () => {
        void buscarProdutos();
      },
      primeiroCarregamento ? 0 : 350,
    );

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [
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
          Carregando produtos...
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

          <button
            type="button"
            onClick={() =>
              window.location.reload()
            }
            className="mt-6 rounded-2xl bg-amber-600 px-6 py-3 font-bold text-white shadow-lg transition hover:-translate-y-1 hover:bg-amber-700 hover:shadow-xl"
          >
            Tentar novamente
          </button>
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

      <ProdutosHero
        busca={busca}
        isLogged={isAuthenticated}
        somenteDisponiveis={
          somenteDisponiveis
        }
        ordenacao={ordenacao}
        onBuscaChange={setBusca}
        onSomenteDisponiveisChange={
          setSomenteDisponiveis
        }
        onOrdenacaoChange={setOrdenacao}
      />

      <ProdutosBenefits />

      <div className="relative">
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

      <ProdutosInstitutional />

      <StoreFooter
        isLogged={isAuthenticated}
      />
    </div>
  );
}
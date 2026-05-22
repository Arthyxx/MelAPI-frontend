import { useEffect, useMemo, useState } from 'react';
import { setAuthToken } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { getUserRole } from '../utils/decodeToken';
import { addToCart, getCartItemsCount } from '../utils/cart';
import { findAllProdutos } from '../services/produtoService';

import { StoreFooter } from '../components/layout/StoreFooter';
import { StoreSidebarMenu } from '../components/layout/StoreSidebarMenu';
import { StoreHeader } from '../components/layout/StoreHeader';

import { ProdutosHero } from '../components/produtos/ProdutosHero';
import { ProdutosBenefits } from '../components/produtos/ProdutosBenefits';
import { ProdutosInstitutional } from '../components/produtos/ProdutosInstitutional';
import { ProdutosGrid } from '../components/produtos/ProdutosGrid';

import type { Produto } from '../types/produto';

export function Produtos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [busca, setBusca] = useState('');
  const [cartItemsCount, setCartItemsCount] = useState(getCartItemsCount());
  const [isLogged, setIsLogged] = useState(!!localStorage.getItem('token'));
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();
  const role = getUserRole();

  useEffect(() => {
  const buscarProdutos = async () => {
    try {
      setErro('');

      const produtos = await findAllProdutos();

      setProdutos(produtos);
    } catch (err) {
      console.error('Erro ao carregar produtos:', err);
      setErro('Erro ao carregar produtos. Tente novamente em instantes.');
    } finally {
      setCarregando(false);
    }
  };

  buscarProdutos();
}, []);

  useEffect(() => {
    const atualizarEstadoLogin = () => {
      setIsLogged(!!localStorage.getItem('token'));
      setCartItemsCount(getCartItemsCount());
    };

    window.addEventListener('storage', atualizarEstadoLogin);

    return () => {
      window.removeEventListener('storage', atualizarEstadoLogin);
    };
  }, []);

  const produtosFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    if (!termo) {
      return produtos;
    }

    return produtos.filter((produto) => {
      const nome = produto.name?.toLowerCase() || '';
      const descricao = produto.description?.toLowerCase() || '';

      return nome.includes(termo) || descricao.includes(termo);
    });
  }, [produtos, busca]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');

    setAuthToken(null);
    setIsLogged(false);
    setCartItemsCount(0);
    setMenuOpen(false);

    navigate('/produtos');
  };

  const handleAddToCart = (produto: Produto) => {
    if (!isLogged) {
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
        (total, item) => total + item.quantity,
        0
      );

      setCartItemsCount(totalItems);

      alert(`🍯 ${produto.name} adicionado ao carrinho!`);
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('Erro ao adicionar produto ao carrinho.');
      }
    }
  };

  if (carregando) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100 dark:from-gray-950 dark:via-gray-900 dark:to-amber-950">
        <div className="relative">
          <div className="mb-4 text-8xl drop-shadow-lg animate-spin-slow">
            🍯
          </div>
          <div className="absolute inset-0 rounded-full bg-amber-200/30 blur-xl animate-pulse-gentle" />
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
          <div className="mb-4 text-6xl">⚠️</div>

          <h2 className="text-2xl font-black text-red-700 dark:text-red-300">
            Ops!
          </h2>

          <p className="mt-3 text-gray-600 dark:text-gray-400">{erro}</p>

          <button
            type="button"
            onClick={() => window.location.reload()}
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
        isLogged={isLogged}
        cartItemsCount={cartItemsCount}
        onOpenMenu={() => setMenuOpen(true)}
      />

      <StoreSidebarMenu
        isLogged={isLogged}
        menuOpen={menuOpen}
        cartItemsCount={cartItemsCount}
        role={role}
        onClose={() => setMenuOpen(false)}
        onLogout={handleLogout}
      />

      <ProdutosHero
        busca={busca}
        isLogged={isLogged}
        onBuscaChange={setBusca}
      />

      <ProdutosBenefits />

      <ProdutosGrid
        produtos={produtosFiltrados}
        isLogged={isLogged}
        onAddToCart={handleAddToCart}
        onClearSearch={() => setBusca('')}
      />

      <ProdutosInstitutional />

      <StoreFooter isLogged={isLogged} />
    </div>
  );
}
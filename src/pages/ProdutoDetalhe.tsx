import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { findProdutoById } from '../services/produtoService';
import {
  canReviewProduto,
  findAvaliacoesByProdutoId,
} from '../services/avaliacaoProdutoService';
import type { Produto } from '../types/produto';
import type {
  AvaliacaoProduto,
  CanReviewProduto,
} from '../types/avaliacaoProduto';
import { addToCart, getCartItemsCount } from '../utils/cart';
import { decodeToken } from '../utils/decodeToken';

import { ProdutoDetalheHeader } from '../components/produtos/detalhe/ProdutoDetalheHeader';
import { ProdutoDetalheMain } from '../components/produtos/detalhe/ProdutoDetalheMain';
import { ProdutoDetalheInfoCards } from '../components/produtos/detalhe/ProdutoDetalheInfoCards';
import { ProdutoDetalheLoading } from '../components/produtos/detalhe/ProdutoDetalheLoading';
import { ProdutoDetalheError } from '../components/produtos/detalhe/ProdutoDetalheError';
import { AvaliacoesProduto } from '../components/produtos/AvaliacoesProduto';
import { CartToast } from '../components/ui/CartToast';

export function ProdutoDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [produto, setProduto] = useState<Produto | null>(null);
  const [avaliacoes, setAvaliacoes] = useState<AvaliacaoProduto[]>([]);
  const [canReview, setCanReview] = useState<CanReviewProduto | null>(null);

  const [loading, setLoading] = useState(true);
  const [loadingAvaliacoes, setLoadingAvaliacoes] = useState(true);
  const [loadingCanReview, setLoadingCanReview] = useState(false);

  const [error, setError] = useState('');
  const [cartItemsCount, setCartItemsCount] = useState(getCartItemsCount());

  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const toastTimeoutRef = useRef<number | null>(null);

  const token = localStorage.getItem('token');
  const isLogged = !!token;

  const decodedToken = token ? decodeToken(token) : null;
  const clienteId = decodedToken?.id;

  const minhaAvaliacao = useMemo(() => {
    if (clienteId == null) {
      return null;
    }

    return (
      avaliacoes.find(
        (avaliacao) => Number(avaliacao.clienteId) === Number(clienteId)
      ) || null
    );
  }, [avaliacoes, clienteId]);

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        window.clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  const showCartToast = (message: string) => {
    setToastMessage(message);
    setToastVisible(true);

    if (toastTimeoutRef.current) {
      window.clearTimeout(toastTimeoutRef.current);
    }

    toastTimeoutRef.current = window.setTimeout(() => {
      setToastVisible(false);
    }, 3000);
  };

  const reloadCanReview = async () => {
    if (!id || !token) {
      setCanReview(null);
      setLoadingCanReview(false);
      return;
    }

    try {
      setLoadingCanReview(true);

      const canReviewData = await canReviewProduto(id);

      setCanReview(canReviewData);
    } catch (err: any) {
      console.error('Erro ao verificar permissão de avaliação:', {
        statusCode: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });

      setCanReview({
        canReview: false,
        message:
          'Não foi possível verificar se você pode avaliar este produto agora.',
      });
    } finally {
      setLoadingCanReview(false);
    }
  };

  const reloadAvaliacoes = async () => {
    if (!id) return;

    try {
      setLoadingAvaliacoes(true);

      const avaliacoesData = await findAvaliacoesByProdutoId(id);

      setAvaliacoes(avaliacoesData);
    } catch (err: any) {
      console.error('Erro ao recarregar avaliações:', {
        statusCode: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });
    } finally {
      setLoadingAvaliacoes(false);
    }

    await reloadCanReview();
  };

  useEffect(() => {
    const fetchProdutoDetalhe = async () => {
      try {
        setError('');
        setLoading(true);
        setLoadingAvaliacoes(true);

        if (!id) {
          navigate('/produtos');
          return;
        }

        const produtoData = await findProdutoById(id);
        setProduto(produtoData);

        const avaliacoesData = await findAvaliacoesByProdutoId(id);
        setAvaliacoes(avaliacoesData);
      } catch (err: any) {
        console.error('Erro ao carregar detalhe do produto:', {
          statusCode: err.response?.status,
          data: err.response?.data,
          message: err.message,
        });

        setError('Não foi possível carregar os detalhes deste produto.');
      } finally {
        setLoading(false);
        setLoadingAvaliacoes(false);
      }
    };

    fetchProdutoDetalhe();
  }, [id, navigate]);

  useEffect(() => {
    reloadCanReview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, token]);

  const handleAddToCart = () => {
    if (!produto) return;

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

      showCartToast(`${produto.name} foi adicionado ao carrinho.`);
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('Erro ao adicionar produto ao carrinho.');
      }
    }
  };

  if (loading) {
    return <ProdutoDetalheLoading />;
  }

  if (error || !produto) {
    return <ProdutoDetalheError message={error} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100 dark:from-gray-950 dark:via-gray-900 dark:to-amber-950">
      <ProdutoDetalheHeader
        isLogged={isLogged}
        cartItemsCount={cartItemsCount}
      />

      <CartToast
        message={toastMessage}
        visible={toastVisible}
        onClose={() => setToastVisible(false)}
      />

      <main className="container mx-auto px-4 py-10">
        <ProdutoDetalheMain
          produto={produto}
          isLogged={isLogged}
          onAddToCart={handleAddToCart}
        />

        <ProdutoDetalheInfoCards />

        <AvaliacoesProduto
          produtoId={produto.id}
          avaliacoes={avaliacoes}
          loading={loadingAvaliacoes}
          isLogged={isLogged}
          minhaAvaliacao={minhaAvaliacao}
          canReview={canReview}
          loadingCanReview={loadingCanReview}
          onSuccess={reloadAvaliacoes}
        />
      </main>
    </div>
  );
}
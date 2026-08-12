import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { AxiosError } from 'axios';
import {
  useNavigate,
  useParams,
} from 'react-router-dom';

import { AvaliacoesProduto } from '../components/produtos/AvaliacoesProduto';
import { ProdutoDetalheError } from '../components/produtos/detalhe/ProdutoDetalheError';
import { ProdutoDetalheHeader } from '../components/produtos/detalhe/ProdutoDetalheHeader';
import { ProdutoDetalheInfoCards } from '../components/produtos/detalhe/ProdutoDetalheInfoCards';
import { ProdutoDetalheLoading } from '../components/produtos/detalhe/ProdutoDetalheLoading';
import { ProdutoDetalheMain } from '../components/produtos/detalhe/ProdutoDetalheMain';
import { CartToast } from '../components/ui/CartToast';

import { useAuth } from '../contexts/useAuth';

import {
  canReviewProduto,
  findAvaliacoesByProdutoId,
} from '../services/avaliacaoProdutoService';
import { findProdutoById } from '../services/produtoService';

import type {
  AvaliacaoProduto,
  CanReviewProduto,
} from '../types/avaliacaoProduto';
import type { Produto } from '../types/produto';

import {
  addToCart,
  getCartItemsCount,
} from '../utils/cart';

interface ApiErrorResponse {
  message?: string | string[];
  error?: string;
}

export function ProdutoDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    user,
    isAuthenticated,
  } = useAuth();

  const [produto, setProduto] =
    useState<Produto | null>(null);

  const [avaliacoes, setAvaliacoes] =
    useState<AvaliacaoProduto[]>([]);

  const [canReview, setCanReview] =
    useState<CanReviewProduto | null>(
      null,
    );

  const [loading, setLoading] =
    useState(true);

  const [
    loadingAvaliacoes,
    setLoadingAvaliacoes,
  ] = useState(true);

  const [
    loadingCanReview,
    setLoadingCanReview,
  ] = useState(false);

  const [error, setError] =
    useState('');

  const [
    cartItemsCount,
    setCartItemsCount,
  ] = useState(
    getCartItemsCount(),
  );

  const [
    toastVisible,
    setToastVisible,
  ] = useState(false);

  const [
    toastMessage,
    setToastMessage,
  ] = useState('');

  const toastTimeoutRef =
    useRef<number | null>(null);

  const clienteId = user?.id;

  const minhaAvaliacao =
    useMemo(() => {
      if (
        clienteId === undefined
      ) {
        return null;
      }

      return (
        avaliacoes.find(
          (avaliacao) =>
            Number(
              avaliacao.clienteId,
            ) ===
            Number(clienteId),
        ) ?? null
      );
    }, [
      avaliacoes,
      clienteId,
    ]);

  useEffect(() => {
    return () => {
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

  const reloadCanReview =
    useCallback(async () => {
      if (
        !id ||
        !isAuthenticated
      ) {
        setCanReview(null);
        setLoadingCanReview(false);

        return;
      }

      try {
        setLoadingCanReview(true);

        const canReviewData =
          await canReviewProduto(id);

        setCanReview(canReviewData);
      } catch (error) {
        const axiosError =
          error as AxiosError<ApiErrorResponse>;

        console.error(
          'Erro ao verificar permissão de avaliação:',
          {
            statusCode:
              axiosError.response
                ?.status,
            data:
              axiosError.response
                ?.data,
            message:
              axiosError.message,
          },
        );

        setCanReview({
          canReview: false,
          message:
            'Não foi possível verificar se você pode avaliar este produto agora.',
        });
      } finally {
        setLoadingCanReview(false);
      }
    }, [id, isAuthenticated]);

  const reloadAvaliacoes =
    useCallback(async () => {
      if (!id) {
        return;
      }

      try {
        setLoadingAvaliacoes(true);

        const avaliacoesData =
          await findAvaliacoesByProdutoId(
            id,
          );

        setAvaliacoes(
          avaliacoesData,
        );
      } catch (error) {
        const axiosError =
          error as AxiosError<ApiErrorResponse>;

        console.error(
          'Erro ao recarregar avaliações:',
          {
            statusCode:
              axiosError.response
                ?.status,
            data:
              axiosError.response
                ?.data,
            message:
              axiosError.message,
          },
        );
      } finally {
        setLoadingAvaliacoes(false);
      }

      await reloadCanReview();
    }, [id, reloadCanReview]);

  useEffect(() => {
    const fetchProdutoDetalhe =
      async () => {
        if (!id) {
          navigate('/produtos', {
            replace: true,
          });

          return;
        }

        try {
          setError('');
          setLoading(true);
          setLoadingAvaliacoes(true);

          const produtoData =
            await findProdutoById(
              id,
            );

          setProduto(produtoData);

          const avaliacoesData =
            await findAvaliacoesByProdutoId(
              id,
            );

          setAvaliacoes(
            avaliacoesData,
          );
        } catch (error) {
          const axiosError =
            error as AxiosError<ApiErrorResponse>;

          console.error(
            'Erro ao carregar detalhe do produto:',
            {
              statusCode:
                axiosError.response
                  ?.status,
              data:
                axiosError.response
                  ?.data,
              message:
                axiosError.message,
            },
          );

          setError(
            'Não foi possível carregar os detalhes deste produto.',
          );
        } finally {
          setLoading(false);
          setLoadingAvaliacoes(false);
        }
      };

    void fetchProdutoDetalhe();
  }, [id, navigate]);

  useEffect(() => {
    const fetchCanReview =
      async () => {
        if (
          !id ||
          !isAuthenticated
        ) {
          setCanReview(null);
          setLoadingCanReview(false);

          return;
        }

        try {
          setLoadingCanReview(true);

          const canReviewData =
            await canReviewProduto(id);

          setCanReview(
            canReviewData,
          );
        } catch (error) {
          const axiosError =
            error as AxiosError<ApiErrorResponse>;

          console.error(
            'Erro ao verificar permissão de avaliação:',
            {
              statusCode:
                axiosError.response
                  ?.status,
              data:
                axiosError.response
                  ?.data,
              message:
                axiosError.message,
            },
          );

          setCanReview({
            canReview: false,
            message:
              'Não foi possível verificar se você pode avaliar este produto agora.',
          });
        } finally {
          setLoadingCanReview(false);
        }
      };

    void fetchCanReview();
  }, [id, isAuthenticated]);

  const handleAddToCart = () => {
    if (!produto) {
      return;
    }

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
          (total, item) =>
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

  if (loading) {
    return (
      <ProdutoDetalheLoading />
    );
  }

  if (error || !produto) {
    return (
      <ProdutoDetalheError
        message={error}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100 dark:from-gray-950 dark:via-gray-900 dark:to-amber-950">
      <ProdutoDetalheHeader
        isLogged={isAuthenticated}
        cartItemsCount={
          cartItemsCount
        }
      />

      <CartToast
        message={toastMessage}
        visible={toastVisible}
        onClose={() =>
          setToastVisible(false)
        }
      />

      <main className="container mx-auto px-4 py-10">
        <ProdutoDetalheMain
          produto={produto}
          isLogged={
            isAuthenticated
          }
          onAddToCart={
            handleAddToCart
          }
        />

        <ProdutoDetalheInfoCards />

        <AvaliacoesProduto
          produtoId={produto.id}
          avaliacoes={avaliacoes}
          loading={
            loadingAvaliacoes
          }
          isLogged={
            isAuthenticated
          }
          minhaAvaliacao={
            minhaAvaliacao
          }
          canReview={canReview}
          loadingCanReview={
            loadingCanReview
          }
          onSuccess={
            reloadAvaliacoes
          }
        />
      </main>
    </div>
  );
}
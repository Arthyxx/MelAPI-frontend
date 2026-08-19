import type {
  AxiosError,
} from 'axios';
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  useNavigate,
} from 'react-router-dom';

import {
  canReviewProduto,
  findAvaliacoesByProdutoId,
} from '../../services/avaliacaoProdutoService';
import {
  findProdutoById,
} from '../../services/produtoService';

import type {
  AvaliacaoProduto,
  CanReviewProduto,
} from '../../types/avaliacaoProduto';
import type {
  Produto,
} from '../../types/produto';

interface ApiErrorResponse {
  message?: string | string[];
  error?: string;
}

interface UseProdutoDetalheDataOptions {
  id?: string;
  isAuthenticated: boolean;
  clienteId?: number;
}

export function useProdutoDetalheData({
  id,
  isAuthenticated,
  clienteId,
}: UseProdutoDetalheDataOptions) {
  const navigate = useNavigate();

  const [produto, setProduto] =
    useState<Produto | null>(null);

  const [
    avaliacoes,
    setAvaliacoes,
  ] = useState<
    AvaliacaoProduto[]
  >([]);

  const [
    canReview,
    setCanReview,
  ] =
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

  const reloadCanReview =
    useCallback(async () => {
      if (
        !id ||
        !isAuthenticated
      ) {
        setCanReview(null);
        setLoadingCanReview(
          false,
        );

        return;
      }

      try {
        setLoadingCanReview(true);

        const data =
          await canReviewProduto(id);

        setCanReview(data);
      } catch (requestError) {
        const axiosError =
          requestError as AxiosError<ApiErrorResponse>;

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
        setLoadingCanReview(
          false,
        );
      }
    }, [
      id,
      isAuthenticated,
    ]);

  const reloadAvaliacoes =
    useCallback(async () => {
      if (!id) {
        return;
      }

      try {
        setLoadingAvaliacoes(
          true,
        );

        const data =
          await findAvaliacoesByProdutoId(
            id,
          );

        setAvaliacoes(data);
      } catch (requestError) {
        const axiosError =
          requestError as AxiosError<ApiErrorResponse>;

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
        setLoadingAvaliacoes(
          false,
        );
      }

      await reloadCanReview();
    }, [
      id,
      reloadCanReview,
    ]);

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

          setLoadingAvaliacoes(
            true,
          );

          const produtoData =
            await findProdutoById(
              id,
            );

          setProduto(
            produtoData,
          );

          const avaliacoesData =
            await findAvaliacoesByProdutoId(
              id,
            );

          setAvaliacoes(
            avaliacoesData,
          );

          void reloadCanReview();
        } catch (requestError) {
          const axiosError =
            requestError as AxiosError<ApiErrorResponse>;

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

          setLoadingAvaliacoes(
            false,
          );
        }
      };

    void fetchProdutoDetalhe();
  }, [
    id,
    navigate,
    reloadCanReview,
  ]);

  return {
    produto,
    avaliacoes,
    canReview,
    minhaAvaliacao,

    loading,
    loadingAvaliacoes,
    loadingCanReview,
    error,

    reloadAvaliacoes,
  };
}
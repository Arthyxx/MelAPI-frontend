import type { AxiosError } from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  canReviewProduto,
  findAvaliacoesByProdutoId,
} from "../../services/avaliacaoProdutoService";
import { findProdutoById } from "../../services/produtoService";

import type {
  AvaliacaoProduto,
  CanReviewProduto,
} from "../../types/avaliacaoProduto";
import type { Produto } from "../../types/produto";

interface ApiErrorResponse {
  message?: string | string[];
  error?: string;
}

interface UseProdutoDetalheDataOptions {
  id?: string;
  isAuthenticated: boolean;
  clienteId?: number;
}

interface ProdutoRequestState {
  id: string;
  produto: Produto | null;
  error: string;
}

interface AvaliacoesRequestState {
  id: string;
  avaliacoes: AvaliacaoProduto[];
}

interface CanReviewRequestState {
  key: string;
  data: CanReviewProduto;
}

function logRequestError(message: string, requestError: unknown) {
  const axiosError = requestError as AxiosError<ApiErrorResponse>;

  console.error(message, {
    statusCode: axiosError.response?.status,
    data: axiosError.response?.data,
    message: axiosError.message,
  });
}

export function useProdutoDetalheData({
  id,
  isAuthenticated,
  clienteId,
}: UseProdutoDetalheDataOptions) {
  const navigate = useNavigate();

  const [produtoState, setProdutoState] = useState<ProdutoRequestState | null>(
    null,
  );

  const [avaliacoesState, setAvaliacoesState] =
    useState<AvaliacoesRequestState | null>(null);

  const [canReviewState, setCanReviewState] =
    useState<CanReviewRequestState | null>(null);

  const latestProdutoRequestIdRef = useRef(0);

  const latestAvaliacoesRequestIdRef = useRef(0);

  const latestCanReviewRequestIdRef = useRef(0);

  const canReviewKey =
    id && isAuthenticated ? `${id}:${clienteId ?? "unknown"}` : null;

  const produto = id && produtoState?.id === id ? produtoState.produto : null;

  const error = id && produtoState?.id === id ? produtoState.error : "";

  const loading = !id || produtoState?.id !== id;

  const avaliacoes =
    id && avaliacoesState?.id === id ? avaliacoesState.avaliacoes : [];

  const loadingAvaliacoes = Boolean(id && avaliacoesState?.id !== id);

  const canReview =
    canReviewKey && canReviewState?.key === canReviewKey
      ? canReviewState.data
      : null;

  const loadingCanReview = Boolean(
    canReviewKey && canReviewState?.key !== canReviewKey,
  );

  const minhaAvaliacao =
    clienteId === undefined
      ? null
      : (avaliacoes.find(
          (avaliacao) => Number(avaliacao.clienteId) === Number(clienteId),
        ) ?? null);

  const reloadCanReview = useCallback(async () => {
    if (!id || !isAuthenticated || !canReviewKey) {
      return;
    }

    const requestId = ++latestCanReviewRequestIdRef.current;

    try {
      const data = await canReviewProduto(id);

      if (requestId !== latestCanReviewRequestIdRef.current) {
        return;
      }

      setCanReviewState({
        key: canReviewKey,
        data,
      });
    } catch (requestError) {
      if (requestId !== latestCanReviewRequestIdRef.current) {
        return;
      }

      logRequestError(
        "Erro ao verificar permissão de avaliação:",
        requestError,
      );

      setCanReviewState({
        key: canReviewKey,
        data: {
          canReview: false,
          message:
            "Não foi possível verificar se você pode avaliar este produto agora.",
        },
      });
    }
  }, [id, isAuthenticated, canReviewKey]);

  const reloadAvaliacoes = useCallback(async () => {
    if (!id) {
      return;
    }

    const requestId = ++latestAvaliacoesRequestIdRef.current;

    try {
      const data = await findAvaliacoesByProdutoId(id);

      if (requestId !== latestAvaliacoesRequestIdRef.current) {
        return;
      }

      setAvaliacoesState({
        id,
        avaliacoes: data,
      });
    } catch (requestError) {
      if (requestId !== latestAvaliacoesRequestIdRef.current) {
        return;
      }

      logRequestError("Erro ao recarregar avaliações:", requestError);
    }

    if (requestId !== latestAvaliacoesRequestIdRef.current) {
      return;
    }

    await reloadCanReview();
  }, [id, reloadCanReview]);

  useEffect(() => {
    if (!id) {
      navigate("/produtos", {
        replace: true,
      });

      return;
    }

    const requestId = ++latestProdutoRequestIdRef.current;

    const fetchProduto = async () => {
      try {
        const produtoData = await findProdutoById(id);

        if (requestId !== latestProdutoRequestIdRef.current) {
          return;
        }

        setProdutoState({
          id,
          produto: produtoData,
          error: "",
        });
      } catch (requestError) {
        if (requestId !== latestProdutoRequestIdRef.current) {
          return;
        }

        logRequestError("Erro ao carregar detalhe do produto:", requestError);

        setProdutoState({
          id,
          produto: null,
          error: "Não foi possível carregar os detalhes deste produto.",
        });
      }
    };

    void fetchProduto();

    return () => {
      if (latestProdutoRequestIdRef.current === requestId) {
        latestProdutoRequestIdRef.current += 1;
      }
    };
  }, [id, navigate]);

  useEffect(() => {
    if (!id) {
      return;
    }

    const requestId = ++latestAvaliacoesRequestIdRef.current;

    const fetchAvaliacoes = async () => {
      try {
        const data = await findAvaliacoesByProdutoId(id);

        if (requestId !== latestAvaliacoesRequestIdRef.current) {
          return;
        }

        setAvaliacoesState({
          id,
          avaliacoes: data,
        });
      } catch (requestError) {
        if (requestId !== latestAvaliacoesRequestIdRef.current) {
          return;
        }

        logRequestError("Erro ao carregar avaliações:", requestError);

        setAvaliacoesState({
          id,
          avaliacoes: [],
        });
      }
    };

    void fetchAvaliacoes();

    return () => {
      if (latestAvaliacoesRequestIdRef.current === requestId) {
        latestAvaliacoesRequestIdRef.current += 1;
      }
    };
  }, [id]);

  useEffect(() => {
    if (!id || !isAuthenticated || !canReviewKey) {
      return;
    }

    const requestId = ++latestCanReviewRequestIdRef.current;

    const fetchCanReview = async () => {
      try {
        const data = await canReviewProduto(id);

        if (requestId !== latestCanReviewRequestIdRef.current) {
          return;
        }

        setCanReviewState({
          key: canReviewKey,
          data,
        });
      } catch (requestError) {
        if (requestId !== latestCanReviewRequestIdRef.current) {
          return;
        }

        logRequestError(
          "Erro ao verificar permissão de avaliação:",
          requestError,
        );

        setCanReviewState({
          key: canReviewKey,
          data: {
            canReview: false,
            message:
              "Não foi possível verificar se você pode avaliar este produto agora.",
          },
        });
      }
    };

    void fetchCanReview();

    return () => {
      if (latestCanReviewRequestIdRef.current === requestId) {
        latestCanReviewRequestIdRef.current += 1;
      }
    };
  }, [id, isAuthenticated, canReviewKey]);

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

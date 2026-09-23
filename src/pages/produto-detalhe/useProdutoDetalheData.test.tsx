import { act, renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

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

import { useProdutoDetalheData } from "./useProdutoDetalheData";

vi.mock("../../services/avaliacaoProdutoService", () => ({
  canReviewProduto: vi.fn(),
  findAvaliacoesByProdutoId: vi.fn(),
}));

vi.mock("../../services/produtoService", () => ({
  findProdutoById: vi.fn(),
}));

interface Deferred<T> {
  promise: Promise<T>;
  resolve: (value: T) => void;
  reject: (reason?: unknown) => void;
}

function createDeferred<T>(): Deferred<T> {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;

  const promise = new Promise<T>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });

  return {
    promise,
    resolve,
    reject,
  };
}

function createProduto(id: number, name: string): Produto {
  return {
    id,
    name,
    price: 49.9,
    stockQuantity: 10,
    active: true,
  } as Produto;
}

function createAvaliacao(
  id: number,
  produtoId: number,
  clienteId: number,
  comment: string,
): AvaliacaoProduto {
  return {
    id,
    produtoId,
    clienteId,
    rating: 5,
    comment,
  } as AvaliacaoProduto;
}

function createCanReview(
  canReview: boolean,
  message: string,
): CanReviewProduto {
  return {
    canReview,
    message,
  } as CanReviewProduto;
}

function RouterWrapper({ children }: { children: ReactNode }) {
  return <MemoryRouter>{children}</MemoryRouter>;
}

describe("useProdutoDetalheData", () => {
  const mockedFindProdutoById = vi.mocked(findProdutoById);

  const mockedFindAvaliacoes = vi.mocked(findAvaliacoesByProdutoId);

  const mockedCanReview = vi.mocked(canReviewProduto);

  beforeEach(() => {
    vi.clearAllMocks();

    vi.spyOn(console, "error").mockImplementation(() => {});

    mockedFindAvaliacoes.mockResolvedValue([]);

    mockedCanReview.mockResolvedValue(createCanReview(true, "Pode avaliar."));
  });

  it("deve ignorar resposta antiga de produto quando o id mudar", async () => {
    const produtoAntigo = createDeferred<Produto>();

    const produtoAtual = createDeferred<Produto>();

    mockedFindProdutoById
      .mockImplementationOnce(() => produtoAntigo.promise)
      .mockImplementationOnce(() => produtoAtual.promise);

    const { result, rerender } = renderHook(
      ({ id }: { id: string }) =>
        useProdutoDetalheData({
          id,
          isAuthenticated: false,
        }),
      {
        initialProps: {
          id: "1",
        },
        wrapper: RouterWrapper,
      },
    );

    await waitFor(() => {
      expect(mockedFindProdutoById).toHaveBeenCalledWith("1");
    });

    rerender({
      id: "2",
    });

    await waitFor(() => {
      expect(mockedFindProdutoById).toHaveBeenCalledWith("2");
    });

    await act(async () => {
      produtoAtual.resolve(createProduto(2, "Mel atual"));

      await produtoAtual.promise;
    });

    await waitFor(() => {
      expect(result.current.produto?.id).toBe(2);
    });

    await act(async () => {
      produtoAntigo.resolve(createProduto(1, "Mel antigo"));

      await produtoAntigo.promise;
    });

    expect(result.current.produto?.id).toBe(2);

    expect(result.current.produto?.name).toBe("Mel atual");
  });

  it("não deve derrubar o produto quando o carregamento das avaliações falhar", async () => {
    mockedFindProdutoById.mockResolvedValue(createProduto(1, "Mel Silvestre"));

    mockedFindAvaliacoes.mockRejectedValue(new Error("Falha nas avaliações"));

    const { result } = renderHook(
      () =>
        useProdutoDetalheData({
          id: "1",
          isAuthenticated: false,
        }),
      {
        wrapper: RouterWrapper,
      },
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.produto?.name).toBe("Mel Silvestre");

    expect(result.current.error).toBe("");

    await waitFor(() => {
      expect(result.current.loadingAvaliacoes).toBe(false);
    });

    expect(result.current.avaliacoes).toEqual([]);
  });

  it("deve ignorar resposta antiga de canReview após mudar o produto", async () => {
    const canReviewAntigo = createDeferred<CanReviewProduto>();

    const canReviewAtual = createDeferred<CanReviewProduto>();

    mockedFindProdutoById.mockImplementation(async (id) =>
      createProduto(Number(id), `Produto ${id}`),
    );

    mockedCanReview
      .mockImplementationOnce(() => canReviewAntigo.promise)
      .mockImplementationOnce(() => canReviewAtual.promise);

    const { result, rerender } = renderHook(
      ({ id }: { id: string }) =>
        useProdutoDetalheData({
          id,
          isAuthenticated: true,
          clienteId: 10,
        }),
      {
        initialProps: {
          id: "1",
        },
        wrapper: RouterWrapper,
      },
    );

    await waitFor(() => {
      expect(mockedCanReview).toHaveBeenCalledWith("1");
    });

    rerender({
      id: "2",
    });

    await waitFor(() => {
      expect(mockedCanReview).toHaveBeenCalledWith("2");
    });

    await act(async () => {
      canReviewAtual.resolve(createCanReview(true, "Permissão atual."));

      await canReviewAtual.promise;
    });

    await waitFor(() => {
      expect(result.current.canReview).toEqual(
        createCanReview(true, "Permissão atual."),
      );
    });

    await act(async () => {
      canReviewAntigo.resolve(createCanReview(false, "Permissão antiga."));

      await canReviewAntigo.promise;
    });

    expect(result.current.canReview).toEqual(
      createCanReview(true, "Permissão atual."),
    );
  });

  it("não deve buscar o produto novamente quando apenas a autenticação mudar", async () => {
    mockedFindProdutoById.mockResolvedValue(createProduto(1, "Mel Silvestre"));

    const { rerender } = renderHook(
      ({ isAuthenticated }: { isAuthenticated: boolean }) =>
        useProdutoDetalheData({
          id: "1",
          isAuthenticated,
          clienteId: isAuthenticated ? 10 : undefined,
        }),
      {
        initialProps: {
          isAuthenticated: false,
        },
        wrapper: RouterWrapper,
      },
    );

    await waitFor(() => {
      expect(mockedFindProdutoById).toHaveBeenCalledTimes(1);
    });

    rerender({
      isAuthenticated: true,
    });

    await waitFor(() => {
      expect(mockedCanReview).toHaveBeenCalledTimes(1);
    });

    expect(mockedFindProdutoById).toHaveBeenCalledTimes(1);

    expect(mockedFindAvaliacoes).toHaveBeenCalledTimes(1);
  });

  it("deve recarregar avaliações e depois atualizar canReview", async () => {
    mockedFindProdutoById.mockResolvedValue(createProduto(1, "Mel Silvestre"));

    mockedFindAvaliacoes
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([createAvaliacao(1, 1, 10, "Excelente produto.")]);

    mockedCanReview
      .mockResolvedValueOnce(createCanReview(true, "Pode avaliar."))
      .mockResolvedValueOnce(createCanReview(false, "Produto já avaliado."));

    const { result } = renderHook(
      () =>
        useProdutoDetalheData({
          id: "1",
          isAuthenticated: true,
          clienteId: 10,
        }),
      {
        wrapper: RouterWrapper,
      },
    );

    await waitFor(() => {
      expect(mockedFindAvaliacoes).toHaveBeenCalledTimes(1);

      expect(mockedCanReview).toHaveBeenCalledTimes(1);
    });

    await act(async () => {
      await result.current.reloadAvaliacoes();
    });

    expect(mockedFindAvaliacoes).toHaveBeenCalledTimes(2);

    expect(mockedCanReview).toHaveBeenCalledTimes(2);

    expect(result.current.avaliacoes).toHaveLength(1);

    expect(result.current.minhaAvaliacao?.comment).toBe("Excelente produto.");

    expect(result.current.canReview).toEqual(
      createCanReview(false, "Produto já avaliado."),
    );
  });
});

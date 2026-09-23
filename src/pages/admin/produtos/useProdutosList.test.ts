import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { fetchCategoriasApi, fetchProdutosApi } from "./produto.api";
import { initialPagination } from "./produto.constants";
import type { Produto } from "./produto.types";
import { useProdutosList } from "./useProdutosList";

vi.mock("./produto.api", () => ({
  fetchCategoriasApi: vi.fn(),
  fetchProdutosApi: vi.fn(),
}));

type FetchProdutosResult = Awaited<ReturnType<typeof fetchProdutosApi>>;

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

function createResponse(id: number, name: string): FetchProdutosResult {
  return {
    content: [
      {
        id,
        name,
        active: true,
        stockQuantity: 10,
      } as Produto,
    ],
    pagination: initialPagination,
  };
}

describe("useProdutosList", () => {
  const mockedFetchProdutos = vi.mocked(fetchProdutosApi);

  const mockedFetchCategorias = vi.mocked(fetchCategoriasApi);

  beforeEach(() => {
    vi.clearAllMocks();

    mockedFetchCategorias.mockResolvedValue([]);
  });

  it("deve ignorar uma resposta antiga que termine depois da requisição mais recente", async () => {
    const firstRequest = createDeferred<FetchProdutosResult>();

    const secondRequest = createDeferred<FetchProdutosResult>();

    mockedFetchProdutos
      .mockImplementationOnce(() => firstRequest.promise)
      .mockImplementationOnce(() => secondRequest.promise);

    const { result } = renderHook(() => useProdutosList());

    await waitFor(() => {
      expect(mockedFetchProdutos).toHaveBeenCalledTimes(1);
    });

    act(() => {
      result.current.handleCategoryFilterChange("2");
    });

    await waitFor(() => {
      expect(mockedFetchProdutos).toHaveBeenCalledTimes(2);
    });

    await act(async () => {
      secondRequest.resolve(createResponse(2, "Mel mais recente"));

      await secondRequest.promise;
    });

    await waitFor(() => {
      expect(result.current.produtos[0]?.id).toBe(2);
    });

    await act(async () => {
      firstRequest.resolve(createResponse(1, "Mel antigo"));

      await firstRequest.promise;
    });

    expect(result.current.produtos[0]?.id).toBe(2);

    expect(result.current.error).toBe("");
  });

  it("deve ignorar erro de uma requisição antiga após uma requisição mais recente ter sucesso", async () => {
    const firstRequest = createDeferred<FetchProdutosResult>();

    const secondRequest = createDeferred<FetchProdutosResult>();

    mockedFetchProdutos
      .mockImplementationOnce(() => firstRequest.promise)
      .mockImplementationOnce(() => secondRequest.promise);

    const { result } = renderHook(() => useProdutosList());

    await waitFor(() => {
      expect(mockedFetchProdutos).toHaveBeenCalledTimes(1);
    });

    act(() => {
      result.current.handleSortChange("name,asc");
    });

    await waitFor(() => {
      expect(mockedFetchProdutos).toHaveBeenCalledTimes(2);
    });

    await act(async () => {
      secondRequest.resolve(createResponse(3, "Mel atualizado"));

      await secondRequest.promise;
    });

    await waitFor(() => {
      expect(result.current.produtos[0]?.id).toBe(3);
    });

    await act(async () => {
      firstRequest.reject(new Error("Resposta antiga falhou"));

      try {
        await firstRequest.promise;
      } catch {
        // A rejeição é esperada neste teste.
      }
    });

    expect(result.current.produtos[0]?.id).toBe(3);

    expect(result.current.error).toBe("");
  });

  it("deve invalidar imediatamente a requisição anterior enquanto a nova busca aguarda o debounce", async () => {
    const firstRequest = createDeferred<FetchProdutosResult>();

    const secondRequest = createDeferred<FetchProdutosResult>();

    mockedFetchProdutos
      .mockImplementationOnce(() => firstRequest.promise)
      .mockImplementationOnce(() => secondRequest.promise);

    const { result } = renderHook(() => useProdutosList());

    await waitFor(() => {
      expect(mockedFetchProdutos).toHaveBeenCalledTimes(1);
    });

    act(() => {
      result.current.handleSearchChange("silvestre");
    });

    expect(mockedFetchProdutos).toHaveBeenCalledTimes(1);

    await act(async () => {
      firstRequest.resolve(createResponse(10, "Resultado antigo"));

      await firstRequest.promise;
    });

    expect(result.current.produtos).toEqual([]);

    await waitFor(
      () => {
        expect(mockedFetchProdutos).toHaveBeenCalledTimes(2);
      },
      {
        timeout: 1000,
      },
    );

    expect(mockedFetchProdutos.mock.calls[1][0]).toEqual(
      expect.objectContaining({
        name: "silvestre",
      }),
    );

    await act(async () => {
      secondRequest.resolve(createResponse(11, "Mel Silvestre"));

      await secondRequest.promise;
    });

    await waitFor(() => {
      expect(result.current.produtos[0]?.id).toBe(11);
    });

    expect(result.current.error).toBe("");
  });
});

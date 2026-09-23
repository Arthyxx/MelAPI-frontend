import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { fetchCategoriasApi } from "./categoria.api";
import { initialPagination } from "./categoria.constants";
import type { Categoria } from "./categoria.types";
import { useCategoriasList } from "./useCategoriasList";

vi.mock("./categoria.api", () => ({
  fetchCategoriasApi: vi.fn(),
}));

type FetchCategoriasResult = Awaited<ReturnType<typeof fetchCategoriasApi>>;

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

function createResponse(id: number, name: string): FetchCategoriasResult {
  return {
    content: [
      {
        id,
        name,
        active: true,
      } as Categoria,
    ],
    pagination: initialPagination,
  };
}

describe("useCategoriasList", () => {
  const mockedFetchCategorias = vi.mocked(fetchCategoriasApi);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve ignorar uma resposta antiga que termine depois da requisição mais recente", async () => {
    const firstRequest = createDeferred<FetchCategoriasResult>();

    const secondRequest = createDeferred<FetchCategoriasResult>();

    mockedFetchCategorias
      .mockImplementationOnce(() => firstRequest.promise)
      .mockImplementationOnce(() => secondRequest.promise);

    const { result } = renderHook(() => useCategoriasList());

    await waitFor(() => {
      expect(mockedFetchCategorias).toHaveBeenCalledTimes(1);
    });

    act(() => {
      result.current.handleActiveFilterChange("true");
    });

    await waitFor(() => {
      expect(mockedFetchCategorias).toHaveBeenCalledTimes(2);
    });

    await act(async () => {
      secondRequest.resolve(createResponse(2, "Méis especiais"));

      await secondRequest.promise;
    });

    await waitFor(() => {
      expect(result.current.categorias[0]?.id).toBe(2);
    });

    await act(async () => {
      firstRequest.resolve(createResponse(1, "Categoria antiga"));

      await firstRequest.promise;
    });

    expect(result.current.categorias[0]?.id).toBe(2);
    expect(result.current.error).toBe("");
  });

  it("deve ignorar erro de uma requisição antiga após uma requisição mais recente ter sucesso", async () => {
    const firstRequest = createDeferred<FetchCategoriasResult>();

    const secondRequest = createDeferred<FetchCategoriasResult>();

    mockedFetchCategorias
      .mockImplementationOnce(() => firstRequest.promise)
      .mockImplementationOnce(() => secondRequest.promise);

    const { result } = renderHook(() => useCategoriasList());

    await waitFor(() => {
      expect(mockedFetchCategorias).toHaveBeenCalledTimes(1);
    });

    act(() => {
      result.current.handleActiveFilterChange("false");
    });

    await waitFor(() => {
      expect(mockedFetchCategorias).toHaveBeenCalledTimes(2);
    });

    await act(async () => {
      secondRequest.resolve(createResponse(3, "Categoria atualizada"));

      await secondRequest.promise;
    });

    await waitFor(() => {
      expect(result.current.categorias[0]?.id).toBe(3);
    });

    await act(async () => {
      firstRequest.reject(new Error("Resposta antiga falhou"));

      try {
        await firstRequest.promise;
      } catch {
        // A rejeição é esperada neste teste.
      }
    });

    expect(result.current.categorias[0]?.id).toBe(3);
    expect(result.current.error).toBe("");
  });

  it("deve invalidar imediatamente a requisição anterior enquanto a nova busca aguarda o debounce", async () => {
    const firstRequest = createDeferred<FetchCategoriasResult>();

    const secondRequest = createDeferred<FetchCategoriasResult>();

    mockedFetchCategorias
      .mockImplementationOnce(() => firstRequest.promise)
      .mockImplementationOnce(() => secondRequest.promise);

    const { result } = renderHook(() => useCategoriasList());

    await waitFor(() => {
      expect(mockedFetchCategorias).toHaveBeenCalledTimes(1);
    });

    act(() => {
      result.current.handleSearchChange("silvestre");
    });

    expect(mockedFetchCategorias).toHaveBeenCalledTimes(1);

    await act(async () => {
      firstRequest.resolve(createResponse(10, "Resultado antigo"));

      await firstRequest.promise;
    });

    expect(result.current.categorias).toEqual([]);

    await waitFor(
      () => {
        expect(mockedFetchCategorias).toHaveBeenCalledTimes(2);
      },
      {
        timeout: 1000,
      },
    );

    expect(mockedFetchCategorias.mock.calls[1][0]).toEqual(
      expect.objectContaining({
        search: "silvestre",
      }),
    );

    await act(async () => {
      secondRequest.resolve(createResponse(11, "Mel Silvestre"));

      await secondRequest.promise;
    });

    await waitFor(() => {
      expect(result.current.categorias[0]?.id).toBe(11);
    });

    expect(result.current.error).toBe("");
  });
});

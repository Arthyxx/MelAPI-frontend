import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { fetchClientesApi } from "./cliente.api";
import { initialPagination } from "./cliente.constants";
import type { Cliente } from "./cliente.types";
import { useClientesList } from "./useClientesList";

vi.mock("./cliente.api", () => ({
  fetchClientesApi: vi.fn(),
}));

type FetchClientesResult = Awaited<ReturnType<typeof fetchClientesApi>>;

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

function createResponse(id: number, name: string): FetchClientesResult {
  return {
    content: [
      {
        id,
        name,
        role: "CLIENTE",
        active: true,
      } as Cliente,
    ],
    pagination: initialPagination,
  };
}

describe("useClientesList", () => {
  const mockedFetchClientes = vi.mocked(fetchClientesApi);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve ignorar uma resposta antiga que termine depois da requisição mais recente", async () => {
    const firstRequest = createDeferred<FetchClientesResult>();

    const secondRequest = createDeferred<FetchClientesResult>();

    mockedFetchClientes
      .mockImplementationOnce(() => firstRequest.promise)
      .mockImplementationOnce(() => secondRequest.promise);

    const { result } = renderHook(() => useClientesList());

    await waitFor(() => {
      expect(mockedFetchClientes).toHaveBeenCalledTimes(1);
    });

    act(() => {
      result.current.handleRoleFilterChange("ADMIN");
    });

    await waitFor(() => {
      expect(mockedFetchClientes).toHaveBeenCalledTimes(2);
    });

    await act(async () => {
      secondRequest.resolve(createResponse(2, "Cliente mais recente"));

      await secondRequest.promise;
    });

    await waitFor(() => {
      expect(result.current.clientes[0]?.id).toBe(2);
    });

    await act(async () => {
      firstRequest.resolve(createResponse(1, "Cliente antigo"));

      await firstRequest.promise;
    });

    expect(result.current.clientes[0]?.id).toBe(2);
    expect(result.current.error).toBe("");
  });

  it("deve ignorar erro de uma requisição antiga após uma requisição mais recente ter sucesso", async () => {
    const firstRequest = createDeferred<FetchClientesResult>();

    const secondRequest = createDeferred<FetchClientesResult>();

    mockedFetchClientes
      .mockImplementationOnce(() => firstRequest.promise)
      .mockImplementationOnce(() => secondRequest.promise);

    const { result } = renderHook(() => useClientesList());

    await waitFor(() => {
      expect(mockedFetchClientes).toHaveBeenCalledTimes(1);
    });

    act(() => {
      result.current.handleActiveFilterChange("true");
    });

    await waitFor(() => {
      expect(mockedFetchClientes).toHaveBeenCalledTimes(2);
    });

    await act(async () => {
      secondRequest.resolve(createResponse(3, "Cliente atualizado"));

      await secondRequest.promise;
    });

    await waitFor(() => {
      expect(result.current.clientes[0]?.id).toBe(3);
    });

    await act(async () => {
      firstRequest.reject(new Error("Resposta antiga falhou"));

      try {
        await firstRequest.promise;
      } catch {
        // A rejeição é esperada neste teste.
      }
    });

    expect(result.current.clientes[0]?.id).toBe(3);
    expect(result.current.error).toBe("");
  });

  it("deve invalidar imediatamente a requisição anterior enquanto a nova busca aguarda o debounce", async () => {
    const firstRequest = createDeferred<FetchClientesResult>();

    const secondRequest = createDeferred<FetchClientesResult>();

    mockedFetchClientes
      .mockImplementationOnce(() => firstRequest.promise)
      .mockImplementationOnce(() => secondRequest.promise);

    const { result } = renderHook(() => useClientesList());

    await waitFor(() => {
      expect(mockedFetchClientes).toHaveBeenCalledTimes(1);
    });

    act(() => {
      result.current.handleSearchChange("arthur");
    });

    expect(mockedFetchClientes).toHaveBeenCalledTimes(1);

    await act(async () => {
      firstRequest.resolve(createResponse(10, "Resultado antigo"));

      await firstRequest.promise;
    });

    expect(result.current.clientes).toEqual([]);

    await waitFor(
      () => {
        expect(mockedFetchClientes).toHaveBeenCalledTimes(2);
      },
      {
        timeout: 1000,
      },
    );

    expect(mockedFetchClientes.mock.calls[1][0]).toEqual(
      expect.objectContaining({
        search: "arthur",
      }),
    );

    await act(async () => {
      secondRequest.resolve(createResponse(11, "Arthur Cliente"));

      await secondRequest.promise;
    });

    await waitFor(() => {
      expect(result.current.clientes[0]?.id).toBe(11);
    });

    expect(result.current.error).toBe("");
  });
});

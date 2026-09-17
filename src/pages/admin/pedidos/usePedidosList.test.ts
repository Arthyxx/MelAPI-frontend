import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Pedido } from "../../../types/pedido";

import { fetchPedidosApi } from "./pedido.api";
import { initialPagination } from "./pedido.constants";
import { usePedidosList } from "./usePedidosList";

vi.mock("./pedido.api", () => ({
  fetchPedidosApi: vi.fn(),
}));

type FetchPedidosResult = Awaited<ReturnType<typeof fetchPedidosApi>>;

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

function createResponse(id: number, status: string): FetchPedidosResult {
  return {
    content: [
      {
        id,
        status,
      } as Pedido,
    ],
    pagination: initialPagination,
  };
}

describe("usePedidosList", () => {
  const mockedFetchPedidos = vi.mocked(fetchPedidosApi);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve ignorar uma resposta antiga que termine depois da requisição mais recente", async () => {
    const firstRequest = createDeferred<FetchPedidosResult>();

    const secondRequest = createDeferred<FetchPedidosResult>();

    mockedFetchPedidos
      .mockImplementationOnce(() => firstRequest.promise)
      .mockImplementationOnce(() => secondRequest.promise);

    const { result } = renderHook(() => usePedidosList());

    await waitFor(() => {
      expect(mockedFetchPedidos).toHaveBeenCalledTimes(1);
    });

    act(() => {
      result.current.handleStatusFilterChange("PAGO");
    });

    await waitFor(() => {
      expect(mockedFetchPedidos).toHaveBeenCalledTimes(2);
    });

    await act(async () => {
      secondRequest.resolve(createResponse(2, "PAGO"));

      await secondRequest.promise;
    });

    await waitFor(() => {
      expect(result.current.pedidos[0]?.id).toBe(2);
    });

    await act(async () => {
      firstRequest.resolve(createResponse(1, "PENDENTE"));

      await firstRequest.promise;
    });

    expect(result.current.pedidos[0]?.id).toBe(2);

    expect(result.current.error).toBe("");
  });

  it("deve ignorar erro de uma requisição antiga após uma requisição mais recente ter sucesso", async () => {
    const firstRequest = createDeferred<FetchPedidosResult>();

    const secondRequest = createDeferred<FetchPedidosResult>();

    mockedFetchPedidos
      .mockImplementationOnce(() => firstRequest.promise)
      .mockImplementationOnce(() => secondRequest.promise);

    const { result } = renderHook(() => usePedidosList());

    await waitFor(() => {
      expect(mockedFetchPedidos).toHaveBeenCalledTimes(1);
    });

    act(() => {
      result.current.handleStatusFilterChange("ENTREGUE");
    });

    await waitFor(() => {
      expect(mockedFetchPedidos).toHaveBeenCalledTimes(2);
    });

    await act(async () => {
      secondRequest.resolve(createResponse(3, "ENTREGUE"));

      await secondRequest.promise;
    });

    await waitFor(() => {
      expect(result.current.pedidos[0]?.id).toBe(3);
    });

    await act(async () => {
      firstRequest.reject(new Error("Resposta antiga falhou"));

      try {
        await firstRequest.promise;
      } catch {
        // A rejeição é esperada neste teste.
      }
    });

    expect(result.current.pedidos[0]?.id).toBe(3);

    expect(result.current.error).toBe("");
  });

  it("deve invalidar imediatamente a requisição anterior enquanto a nova busca aguarda o debounce", async () => {
    const firstRequest = createDeferred<FetchPedidosResult>();

    const secondRequest = createDeferred<FetchPedidosResult>();

    mockedFetchPedidos
      .mockImplementationOnce(() => firstRequest.promise)
      .mockImplementationOnce(() => secondRequest.promise);

    const { result } = renderHook(() => usePedidosList());

    await waitFor(() => {
      expect(mockedFetchPedidos).toHaveBeenCalledTimes(1);
    });

    act(() => {
      result.current.handleSearchChange("mel");
    });

    expect(mockedFetchPedidos).toHaveBeenCalledTimes(1);

    await act(async () => {
      firstRequest.resolve(createResponse(10, "PENDENTE"));

      await firstRequest.promise;
    });

    expect(result.current.pedidos).toEqual([]);

    await waitFor(
      () => {
        expect(mockedFetchPedidos).toHaveBeenCalledTimes(2);
      },
      {
        timeout: 1000,
      },
    );

    expect(mockedFetchPedidos.mock.calls[1][0]).toEqual(
      expect.objectContaining({
        search: "mel",
      }),
    );

    await act(async () => {
      secondRequest.resolve(createResponse(11, "PAGO"));

      await secondRequest.promise;
    });

    await waitFor(() => {
      expect(result.current.pedidos[0]?.id).toBe(11);
    });

    expect(result.current.error).toBe("");
  });
});

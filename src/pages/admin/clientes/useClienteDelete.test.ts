import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { deleteClienteApi } from "./cliente.api";
import type { Cliente } from "./cliente.types";
import { useClienteDelete } from "./useClienteDelete";

vi.mock("./cliente.api", () => ({
  deleteClienteApi: vi.fn(),
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

describe("useClienteDelete", () => {
  it("deve impedir duas exclusões simultâneas em confirmações duplicadas", async () => {
    const request = createDeferred<void>();

    const mockedDeleteCliente = vi.mocked(deleteClienteApi);

    mockedDeleteCliente.mockImplementation(() => request.promise);

    const clientes = [
      {
        id: 10,
        name: "Cliente Teste",
        email: "cliente@teste.com",
        role: "CLIENTE",
        active: true,
      } as Cliente,
    ];

    const onDeleted = vi.fn().mockResolvedValue(undefined);

    const { result } = renderHook(() =>
      useClienteDelete({
        clientes,
        onDeleted,
      }),
    );

    act(() => {
      result.current.handleDelete(10);
    });

    expect(result.current.deleteId).toBe(10);

    let firstDelete!: Promise<void>;
    let secondDelete!: Promise<void>;

    act(() => {
      firstDelete = result.current.handleConfirmDelete();
      secondDelete = result.current.handleConfirmDelete();
    });

    expect(mockedDeleteCliente).toHaveBeenCalledTimes(1);
    expect(mockedDeleteCliente).toHaveBeenCalledWith(10);
    expect(result.current.deleting).toBe(true);

    await act(async () => {
      request.resolve();

      await Promise.all([firstDelete, secondDelete]);
    });

    await waitFor(() => {
      expect(result.current.deleting).toBe(false);
    });

    expect(mockedDeleteCliente).toHaveBeenCalledTimes(1);
    expect(onDeleted).toHaveBeenCalledTimes(1);
    expect(result.current.deleteId).toBeNull();

    expect(result.current.success).toBe(
      "Operação concluída. O cliente foi excluído ou desativado para preservar o histórico.",
    );
  });

  it("não deve fechar a confirmação enquanto a exclusão estiver em andamento", async () => {
    const request = createDeferred<void>();

    vi.mocked(deleteClienteApi).mockImplementation(() => request.promise);

    const clientes = [
      {
        id: 10,
        name: "Cliente Teste",
        email: "cliente@teste.com",
        role: "CLIENTE",
        active: true,
      } as Cliente,
    ];

    const { result } = renderHook(() =>
      useClienteDelete({
        clientes,
        onDeleted: vi.fn().mockResolvedValue(undefined),
      }),
    );

    act(() => {
      result.current.handleDelete(10);
    });

    let deletion!: Promise<void>;

    act(() => {
      deletion = result.current.handleConfirmDelete();
    });

    act(() => {
      result.current.handleCancelDelete();
    });

    expect(result.current.deleteId).toBe(10);

    await act(async () => {
      request.resolve();

      await deletion;
    });

    expect(result.current.deleteId).toBeNull();
  });
});

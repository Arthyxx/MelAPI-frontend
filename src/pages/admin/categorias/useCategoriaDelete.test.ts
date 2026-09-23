import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { deleteCategoriaApi } from "./categoria.api";
import type { Categoria } from "./categoria.types";
import { useCategoriaDelete } from "./useCategoriaDelete";

vi.mock("./categoria.api", () => ({
  deleteCategoriaApi: vi.fn(),
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

describe("useCategoriaDelete", () => {
  it("deve impedir duas exclusões simultâneas em confirmações duplicadas", async () => {
    const request = createDeferred<void>();

    const mockedDeleteCategoria = vi.mocked(deleteCategoriaApi);

    mockedDeleteCategoria.mockImplementation(() => request.promise);

    const categorias = [
      {
        id: 10,
        name: "Mel Puro",
        description: null,
        active: true,
      } as Categoria,
    ];

    const onDeleted = vi.fn().mockResolvedValue(undefined);

    const { result } = renderHook(() =>
      useCategoriaDelete({
        categorias,
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

    expect(mockedDeleteCategoria).toHaveBeenCalledTimes(1);
    expect(mockedDeleteCategoria).toHaveBeenCalledWith(10);
    expect(result.current.deleting).toBe(true);

    await act(async () => {
      request.resolve();

      await Promise.all([firstDelete, secondDelete]);
    });

    await waitFor(() => {
      expect(result.current.deleting).toBe(false);
    });

    expect(mockedDeleteCategoria).toHaveBeenCalledTimes(1);
    expect(onDeleted).toHaveBeenCalledTimes(1);
    expect(result.current.deleteId).toBeNull();
    expect(result.current.success).toBe(
      "Categoria excluída ou desativada com sucesso.",
    );
  });

  it("não deve fechar a confirmação enquanto a exclusão estiver em andamento", async () => {
    const request = createDeferred<void>();

    vi.mocked(deleteCategoriaApi).mockImplementation(() => request.promise);

    const categorias = [
      {
        id: 10,
        name: "Mel Puro",
        description: null,
        active: true,
      } as Categoria,
    ];

    const { result } = renderHook(() =>
      useCategoriaDelete({
        categorias,
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

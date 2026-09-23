import { act, renderHook, waitFor } from "@testing-library/react";
import type { FormEvent } from "react";
import { describe, expect, it, vi } from "vitest";

import { createCategoriaApi } from "./categoria.api";
import { useCategoriaForm } from "./useCategoriaForm";

vi.mock("./categoria.api", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./categoria.api")>();

  return {
    ...actual,
    createCategoriaApi: vi.fn(),
  };
});

type CreateCategoriaResult = Awaited<ReturnType<typeof createCategoriaApi>>;

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

describe("useCategoriaForm", () => {
  it("deve impedir duas criações simultâneas em submits duplicados", async () => {
    const request = createDeferred<CreateCategoriaResult>();

    const mockedCreateCategoria = vi.mocked(createCategoriaApi);

    mockedCreateCategoria.mockImplementation(() => request.promise);

    const onCreated = vi.fn().mockResolvedValue(undefined);
    const onUpdated = vi.fn().mockResolvedValue(undefined);

    const { result } = renderHook(() =>
      useCategoriaForm({
        onCreated,
        onUpdated,
      }),
    );

    act(() => {
      result.current.handleFieldChange("name", "Mel Puro");
    });

    const event = {
      preventDefault: vi.fn(),
    } as unknown as FormEvent<HTMLFormElement>;

    let firstSubmit!: Promise<void>;
    let secondSubmit!: Promise<void>;

    act(() => {
      firstSubmit = result.current.handleSubmit(event);
      secondSubmit = result.current.handleSubmit(event);
    });

    expect(mockedCreateCategoria).toHaveBeenCalledTimes(1);

    expect(result.current.saving).toBe(true);

    await act(async () => {
      request.resolve(undefined as CreateCategoriaResult);

      await Promise.all([firstSubmit, secondSubmit]);
    });

    await waitFor(() => {
      expect(result.current.saving).toBe(false);
    });

    expect(mockedCreateCategoria).toHaveBeenCalledTimes(1);
    expect(onCreated).toHaveBeenCalledTimes(1);
    expect(onUpdated).not.toHaveBeenCalled();
  });
});

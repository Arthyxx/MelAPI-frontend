import { act, renderHook, waitFor } from "@testing-library/react";
import type { FormEvent } from "react";
import { describe, expect, it, vi } from "vitest";

import { createClienteApi } from "./cliente.api";
import { useClienteForm } from "./useClienteForm";

vi.mock("./cliente.api", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./cliente.api")>();

  return {
    ...actual,
    createClienteApi: vi.fn(),
  };
});

type CreateClienteResult = Awaited<ReturnType<typeof createClienteApi>>;

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

describe("useClienteForm", () => {
  it("deve impedir duas criações simultâneas em submits duplicados", async () => {
    const request = createDeferred<CreateClienteResult>();

    const mockedCreateCliente = vi.mocked(createClienteApi);

    mockedCreateCliente.mockImplementation(() => request.promise);

    const onSaved = vi.fn().mockResolvedValue(undefined);

    const { result } = renderHook(() =>
      useClienteForm({
        onSaved,
      }),
    );

    act(() => {
      result.current.handleFieldChange("name", "Cliente Teste");

      result.current.handleFieldChange("email", "cliente@teste.com");

      result.current.handleFieldChange("password", "Senha123!");
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

    expect(mockedCreateCliente).toHaveBeenCalledTimes(1);

    expect(result.current.saving).toBe(true);

    await act(async () => {
      request.resolve(undefined as CreateClienteResult);

      await Promise.all([firstSubmit, secondSubmit]);
    });

    await waitFor(() => {
      expect(result.current.saving).toBe(false);
    });

    expect(mockedCreateCliente).toHaveBeenCalledTimes(1);

    expect(onSaved).toHaveBeenCalledTimes(1);

    expect(result.current.success).toBe("Cliente criado com sucesso.");
  });
});

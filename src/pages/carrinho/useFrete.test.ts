import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useAuth } from "../../contexts/useAuth";
import { api } from "../../services/api";

import { fetchPerfilApi } from "../perfil/perfil.api";

import { type FreteOption, useFrete } from "./useFrete";

vi.mock("../../contexts/useAuth", () => ({
  useAuth: vi.fn(),
}));

vi.mock("../../services/api", () => ({
  api: {
    post: vi.fn(),
  },
}));

vi.mock("../perfil/perfil.api", () => ({
  fetchPerfilApi: vi.fn(),
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

const items = [
  {
    id: 1,
    name: "Mel Silvestre",
    price: 49.9,
    quantity: 1,
    stockQuantity: 10,
  },
];

const freteOption: FreteOption = {
  serviceId: "1",
  serviceName: "PAC",
  companyName: "Correios",
  price: 22.17,
  deliveryTime: 8,
};

describe("useFrete", () => {
  const mockedUseAuth = vi.mocked(useAuth);

  const mockedFetchPerfil = vi.mocked(fetchPerfilApi);

  const mockedApiPost = vi.mocked(api.post);

  beforeEach(() => {
    vi.clearAllMocks();

    mockedUseAuth.mockReturnValue({
      user: null,
      token: null,
      isAuthenticated: false,
      isAdmin: false,
      signIn: vi.fn(),
      signOut: vi.fn(),
    });
  });

  it("deve ignorar resposta antiga de frete após a cotação ser invalidada", async () => {
    const request = createDeferred<{
      data: FreteOption[];
    }>();

    mockedApiPost.mockImplementationOnce(() => request.promise);

    const { result } = renderHook(() =>
      useFrete({
        items,
      }),
    );

    act(() => {
      result.current.handleZipCodeChange("60421-410");
    });

    act(() => {
      void result.current.calcularFrete();
    });

    await waitFor(() => {
      expect(mockedApiPost).toHaveBeenCalledTimes(1);
    });

    act(() => {
      result.current.invalidateFrete();
    });

    await act(async () => {
      request.resolve({
        data: [freteOption],
      });

      await request.promise;
    });

    expect(result.current.options).toEqual([]);

    expect(result.current.selectedOption).toBeNull();

    expect(result.current.loading).toBe(false);
  });

  it("deve invalidar cotação feita antes de o CEP do perfil terminar de carregar", async () => {
    const profileRequest =
      createDeferred<Awaited<ReturnType<typeof fetchPerfilApi>>>();

    mockedUseAuth.mockReturnValue({
      user: {
        id: 10,
      } as ReturnType<typeof useAuth>["user"],
      token: "token",
      isAuthenticated: true,
      isAdmin: false,
      signIn: vi.fn(),
      signOut: vi.fn(),
    });

    mockedFetchPerfil.mockImplementationOnce(() => profileRequest.promise);

    mockedApiPost.mockResolvedValueOnce({
      data: [freteOption],
    });

    const { result } = renderHook(() =>
      useFrete({
        items,
      }),
    );

    act(() => {
      result.current.handleZipCodeChange("60123-456");
    });

    await act(async () => {
      await result.current.calcularFrete();
    });

    expect(result.current.options).toEqual([freteOption]);

    act(() => {
      result.current.selectOption(freteOption);
    });

    expect(result.current.selectedOption).toEqual(freteOption);

    await act(async () => {
      profileRequest.resolve({
        zipCode: "60421-410",
      } as Awaited<ReturnType<typeof fetchPerfilApi>>);

      await profileRequest.promise;
    });

    await waitFor(() => {
      expect(result.current.zipCode).toBe("60421-410");
    });

    expect(result.current.zipCodeReadOnly).toBe(true);

    expect(result.current.options).toEqual([]);

    expect(result.current.selectedOption).toBeNull();

    expect(result.current.error).toBe("");
  });

  it("deve limpar CEP do perfil e frete selecionado ao sair da conta", async () => {
    mockedUseAuth.mockReturnValue({
      user: {
        id: 10,
      } as ReturnType<typeof useAuth>["user"],
      token: "token",
      isAuthenticated: true,
      isAdmin: false,
      signIn: vi.fn(),
      signOut: vi.fn(),
    });

    mockedFetchPerfil.mockResolvedValue({
      zipCode: "60421-410",
    } as Awaited<ReturnType<typeof fetchPerfilApi>>);

    mockedApiPost.mockResolvedValue({
      data: [freteOption],
    });

    const { result, rerender } = renderHook(() =>
      useFrete({
        items,
      }),
    );

    await waitFor(() => {
      expect(result.current.zipCode).toBe("60421-410");
    });

    await act(async () => {
      await result.current.calcularFrete();
    });

    act(() => {
      result.current.selectOption(freteOption);
    });

    expect(result.current.selectedOption).toEqual(freteOption);

    mockedUseAuth.mockReturnValue({
      user: null,
      token: null,
      isAuthenticated: false,
      isAdmin: false,
      signIn: vi.fn(),
      signOut: vi.fn(),
    });

    rerender();

    await waitFor(() => {
      expect(result.current.zipCode).toBe("");
    });

    expect(result.current.zipCodeReadOnly).toBe(false);

    expect(result.current.options).toEqual([]);

    expect(result.current.selectedOption).toBeNull();
  });

  it("deve ignorar resposta antiga do perfil após o usuário sair da conta", async () => {
    const profileRequest =
      createDeferred<Awaited<ReturnType<typeof fetchPerfilApi>>>();

    mockedUseAuth.mockReturnValue({
      user: {
        id: 10,
      } as ReturnType<typeof useAuth>["user"],
      token: "token",
      isAuthenticated: true,
      isAdmin: false,
      signIn: vi.fn(),
      signOut: vi.fn(),
    });

    mockedFetchPerfil.mockImplementationOnce(() => profileRequest.promise);

    const { result, rerender } = renderHook(() =>
      useFrete({
        items,
      }),
    );

    await waitFor(() => {
      expect(mockedFetchPerfil).toHaveBeenCalledTimes(1);
    });

    mockedUseAuth.mockReturnValue({
      user: null,
      token: null,
      isAuthenticated: false,
      isAdmin: false,
      signIn: vi.fn(),
      signOut: vi.fn(),
    });

    rerender();

    await waitFor(() => {
      expect(result.current.zipCode).toBe("");
    });

    await act(async () => {
      profileRequest.resolve({
        zipCode: "60421-410",
      } as Awaited<ReturnType<typeof fetchPerfilApi>>);

      await profileRequest.promise;
    });

    expect(result.current.zipCode).toBe("");

    expect(result.current.zipCodeReadOnly).toBe(false);
  });
});

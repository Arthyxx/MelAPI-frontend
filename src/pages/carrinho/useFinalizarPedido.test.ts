import {
  act,
  renderHook,
} from "@testing-library/react";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import { useAuth } from "../../contexts/useAuth";
import { api } from "../../services/api";
import { useFinalizarPedido } from "./useFinalizarPedido";

const navigateMock = vi.fn();

vi.mock("react-router-dom", () => ({
  useNavigate: () => navigateMock,
}));

vi.mock("../../contexts/useAuth", () => ({
  useAuth: vi.fn(),
}));

vi.mock("../../services/api", () => ({
  api: {
    post: vi.fn(),
  },
}));

describe("useFinalizarPedido - idempotência", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    sessionStorage.clear();

    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: true,
    } as ReturnType<typeof useAuth>);

    vi.spyOn(
      console,
      "error",
    ).mockImplementation(
      () => undefined,
    );

    vi.spyOn(
      window,
      "setTimeout",
    ).mockImplementation(
      (() => 1) as typeof window.setTimeout,
    );
  });

  afterEach(() => {
    sessionStorage.clear();

    vi.restoreAllMocks();
  });

  it("deve reutilizar a mesma Idempotency-Key após erro de rede na criação do pedido", async () => {
    const onOrderCreated =
      vi.fn();

    const postMock =
      vi.mocked(api.post);

    postMock
      .mockRejectedValueOnce({
        isAxiosError: true,
        message:
          "Network Error",
        response: undefined,
      })
      .mockResolvedValueOnce({
        data: {
          id: 77,
        },
      })
      .mockRejectedValueOnce({
        isAxiosError: true,
        message:
          "Falha ao iniciar checkout",
        response: {
          status: 503,
          data: {
            message:
              "Checkout indisponível.",
          },
        },
      });

    const { result } =
      renderHook(() =>
        useFinalizarPedido({
          items: [
            {
              id: 5,
              name: "Mel Silvestre",
              price: 25,
              quantity: 2,
              stockQuantity: 10,
            },
          ],
          shippingServiceId:
            "1",
          quotedShippingPrice:
            12.5,
          quotedZipCode:
            "60421410",
          onOrderCreated,
        }),
      );

    await act(async () => {
      await result.current.finalizarPedido();
    });

    expect(
      postMock,
    ).toHaveBeenCalledTimes(
      1,
    );

    const firstPedidoCall =
      postMock.mock.calls[0];

    expect(
      firstPedidoCall[0],
    ).toBe("/pedidos");

    const firstConfig =
      firstPedidoCall[2];

    const firstIdempotencyKey =
      firstConfig?.headers?.[
        "Idempotency-Key"
      ];

    expect(
      firstIdempotencyKey,
    ).toEqual(
      expect.any(String),
    );

    await act(async () => {
      await result.current.finalizarPedido();
    });

    expect(
      postMock,
    ).toHaveBeenCalledTimes(
      3,
    );

    const secondPedidoCall =
      postMock.mock.calls[1];

    expect(
      secondPedidoCall[0],
    ).toBe("/pedidos");

    const secondConfig =
      secondPedidoCall[2];

    const secondIdempotencyKey =
      secondConfig?.headers?.[
        "Idempotency-Key"
      ];

    expect(
      secondIdempotencyKey,
    ).toBe(
      firstIdempotencyKey,
    );

    expect(
      postMock.mock.calls[2][0],
    ).toBe(
      "/pagamentos/pedidos/77/checkout",
    );

    expect(
      onOrderCreated,
    ).toHaveBeenCalledTimes(
      1,
    );

    expect(
      result.current.error,
    ).toBe(
      "O pedido #77 foi criado, mas não foi possível abrir o pagamento. Acesse “Meus pedidos” para tentar pagar novamente.",
    );

    expect(
      sessionStorage.getItem(
        "mel:pedido:idempotency-attempt",
      ),
    ).toBeNull();
  });

  it("deve gerar uma nova Idempotency-Key quando os dados do pedido mudarem após erro de rede", async () => {
    const onOrderCreated =
      vi.fn();

    const postMock =
      vi.mocked(api.post);

    postMock.mockRejectedValue({
      isAxiosError: true,
      message:
        "Network Error",
      response: undefined,
    });

    const {
      result,
      rerender,
    } = renderHook(
      ({
        quantity,
      }: {
        quantity: number;
      }) =>
        useFinalizarPedido({
          items: [
            {
              id: 5,
              name: "Mel Silvestre",
              price: 25,
              quantity,
              stockQuantity: 10,
            },
          ],
          shippingServiceId:
            "1",
          quotedShippingPrice:
            12.5,
          quotedZipCode:
            "60421410",
          onOrderCreated,
        }),
      {
        initialProps: {
          quantity: 2,
        },
      },
    );

    await act(async () => {
      await result.current.finalizarPedido();
    });

    expect(
      postMock,
    ).toHaveBeenCalledTimes(
      1,
    );

    const firstConfig =
      postMock.mock.calls[0][2];

    const firstIdempotencyKey =
      firstConfig?.headers?.[
        "Idempotency-Key"
      ];

    expect(
      firstIdempotencyKey,
    ).toEqual(
      expect.any(String),
    );

    rerender({
      quantity: 3,
    });

    await act(async () => {
      await result.current.finalizarPedido();
    });

    expect(
      postMock,
    ).toHaveBeenCalledTimes(
      2,
    );

    const secondConfig =
      postMock.mock.calls[1][2];

    const secondIdempotencyKey =
      secondConfig?.headers?.[
        "Idempotency-Key"
      ];

    expect(
      secondIdempotencyKey,
    ).toEqual(
      expect.any(String),
    );

    expect(
      secondIdempotencyKey,
    ).not.toBe(
      firstIdempotencyKey,
    );

    expect(
      onOrderCreated,
    ).not.toHaveBeenCalled();
  });

  it("deve recuperar a mesma Idempotency-Key do sessionStorage após recarregar a página", async () => {
    const onOrderCreated =
      vi.fn();

    const postMock =
      vi.mocked(api.post);

    postMock.mockRejectedValue({
      isAxiosError: true,
      message:
        "Network Error",
      response: undefined,
    });

    const options = {
      items: [
        {
          id: 5,
          name: "Mel Silvestre",
          price: 25,
          quantity: 2,
          stockQuantity: 10,
        },
      ],
      shippingServiceId:
        "1",
      quotedShippingPrice:
        12.5,
      quotedZipCode:
        "60421410",
      onOrderCreated,
    };

    const firstRender =
      renderHook(() =>
        useFinalizarPedido(
          options,
        ),
      );

    await act(async () => {
      await firstRender.result.current.finalizarPedido();
    });

    expect(
      postMock,
    ).toHaveBeenCalledTimes(
      1,
    );

    const firstConfig =
      postMock.mock.calls[0][2];

    const firstIdempotencyKey =
      firstConfig?.headers?.[
        "Idempotency-Key"
      ];

    expect(
      firstIdempotencyKey,
    ).toEqual(
      expect.any(String),
    );

    expect(
      sessionStorage.getItem(
        "mel:pedido:idempotency-attempt",
      ),
    ).not.toBeNull();

    firstRender.unmount();

    const secondRender =
      renderHook(() =>
        useFinalizarPedido(
          options,
        ),
      );

    await act(async () => {
      await secondRender.result.current.finalizarPedido();
    });

    expect(
      postMock,
    ).toHaveBeenCalledTimes(
      2,
    );

    const secondConfig =
      postMock.mock.calls[1][2];

    const secondIdempotencyKey =
      secondConfig?.headers?.[
        "Idempotency-Key"
      ];

    expect(
      secondIdempotencyKey,
    ).toBe(
      firstIdempotencyKey,
    );

    expect(
      onOrderCreated,
    ).not.toHaveBeenCalled();
  });
});

import type { AxiosError } from "axios";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../contexts/useAuth";
import { api } from "../../services/api";
import type { CartItem } from "../../utils/cart";

interface ApiErrorResponse {
  message?: string | string[];
  error?: string;
}

interface PedidoCriadoResponse {
  id: number;
}

interface CheckoutResponse {
  pedidoId: number;
  preferenceId: string;
  checkoutUrl: string;
}

interface UseFinalizarPedidoOptions {
  items: CartItem[];

  shippingServiceId?: string | null;

  quotedShippingPrice?: number | null;

  quotedZipCode?: string | null;

  onOrderCreated: () => void;
}

interface IdempotencyAttempt {
  key: string;
  fingerprint: string;
}

interface PedidoPayload {
  items: Array<{
    produtoId: number;
    quantity: number;
  }>;

  shippingServiceId: string;
  quotedShippingPrice: number;
  quotedZipCode: string;
}

const IDEMPOTENCY_STORAGE_KEY =
  "mel:pedido:idempotency-attempt";

function getApiErrorMessage(
  error: AxiosError<ApiErrorResponse>,
  fallbackMessage: string,
) {
  const apiMessage = error.response?.data?.message;

  if (Array.isArray(apiMessage)) {
    return apiMessage.join(" ");
  }

  return apiMessage || error.response?.data?.error || fallbackMessage;
}

function normalizeZipCode(value: string) {
  return value.replace(/\D/g, "");
}

function createIdempotencyKey() {
  return crypto.randomUUID();
}

function createPedidoFingerprint(payload: PedidoPayload) {
  return JSON.stringify({
    items: [...payload.items]
      .sort(
        (firstItem, secondItem) =>
          firstItem.produtoId - secondItem.produtoId,
      )
      .map((item) => ({
        produtoId: item.produtoId,
        quantity: item.quantity,
      })),

    shippingServiceId: payload.shippingServiceId,

    quotedShippingPrice: payload.quotedShippingPrice,

    quotedZipCode: payload.quotedZipCode,
  });
}

function isIdempotencyAttempt(
  value: unknown,
): value is IdempotencyAttempt {
  if (
    typeof value !== "object" ||
    value === null
  ) {
    return false;
  }

  const candidate =
    value as Partial<IdempotencyAttempt>;

  return (
    typeof candidate.key === "string" &&
    typeof candidate.fingerprint === "string"
  );
}

function loadIdempotencyAttempt() {
  try {
    const storedValue =
      sessionStorage.getItem(
        IDEMPOTENCY_STORAGE_KEY,
      );

    if (!storedValue) {
      return null;
    }

    const parsedValue: unknown =
      JSON.parse(storedValue);

    if (
      !isIdempotencyAttempt(
        parsedValue,
      )
    ) {
      sessionStorage.removeItem(
        IDEMPOTENCY_STORAGE_KEY,
      );

      return null;
    }

    return parsedValue;
  } catch {
    sessionStorage.removeItem(
      IDEMPOTENCY_STORAGE_KEY,
    );

    return null;
  }
}

function saveIdempotencyAttempt(
  attempt: IdempotencyAttempt,
) {
  sessionStorage.setItem(
    IDEMPOTENCY_STORAGE_KEY,
    JSON.stringify(attempt),
  );
}

function clearIdempotencyAttempt() {
  sessionStorage.removeItem(
    IDEMPOTENCY_STORAGE_KEY,
  );
}

export function useFinalizarPedido({
  items,
  shippingServiceId = null,
  quotedShippingPrice = null,
  quotedZipCode = null,
  onOrderCreated,
}: UseFinalizarPedidoOptions) {
  const navigate = useNavigate();

  const { isAuthenticated } = useAuth();

  const idempotencyAttemptRef =
    useRef<IdempotencyAttempt | null>(
      loadIdempotencyAttempt(),
    );

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  const finalizarPedido =
    async () => {
      clearMessages();

      if (!isAuthenticated) {
        navigate("/login", {
          replace: true,
        });

        return;
      }

      if (items.length === 0) {
        setError(
          "O carrinho está vazio.",
        );

        return;
      }

      if (
        !shippingServiceId ||
        quotedShippingPrice ===
          null ||
        !quotedZipCode
      ) {
        setError(
          "Calcule o frete e selecione uma opção de entrega antes de finalizar o pedido.",
        );

        return;
      }

      const normalizedZipCode =
        normalizeZipCode(
          quotedZipCode,
        );

      if (
        normalizedZipCode.length !==
        8
      ) {
        setError(
          "Calcule o frete novamente antes de finalizar o pedido.",
        );

        return;
      }

      const pedidoPayload: PedidoPayload =
        {
          items: items.map(
            (item) => ({
              produtoId:
                item.id,
              quantity:
                item.quantity,
            }),
          ),

          shippingServiceId,

          quotedShippingPrice,

          quotedZipCode:
            normalizedZipCode,
        };

      const fingerprint =
        createPedidoFingerprint(
          pedidoPayload,
        );

      let idempotencyAttempt =
        idempotencyAttemptRef.current;

      if (
        !idempotencyAttempt ||
        idempotencyAttempt.fingerprint !==
          fingerprint
      ) {
        idempotencyAttempt = {
          key: createIdempotencyKey(),
          fingerprint,
        };

        idempotencyAttemptRef.current =
          idempotencyAttempt;

        saveIdempotencyAttempt(
          idempotencyAttempt,
        );
      }

      const idempotencyKey =
        idempotencyAttempt.key;

      setLoading(true);

      let pedidoId:
        | number
        | null = null;

      try {
        const pedidoResponse =
          await api.post<PedidoCriadoResponse>(
            "/pedidos",
            pedidoPayload,
            {
              headers: {
                "Idempotency-Key":
                  idempotencyKey,
              },
            },
          );

        pedidoId =
          pedidoResponse.data.id;

        idempotencyAttemptRef.current =
          null;

        clearIdempotencyAttempt();

        onOrderCreated();

        setSuccess(
          `Pedido #${pedidoId} criado. Abrindo pagamento...`,
        );

        const checkoutResponse =
          await api.post<CheckoutResponse>(
            `/pagamentos/pedidos/${pedidoId}/checkout`,
          );

        const checkoutUrl =
          checkoutResponse.data
            .checkoutUrl;

        if (!checkoutUrl) {
          throw new Error(
            "URL de pagamento não retornada.",
          );
        }

        window.location.assign(
          checkoutUrl,
        );
      } catch (requestError) {
        if (pedidoId !== null) {
          console.error(
            "Pedido criado, mas não foi possível iniciar o pagamento:",
            requestError,
          );

          setError(
            `O pedido #${pedidoId} foi criado, mas não foi possível abrir o pagamento. Acesse “Meus pedidos” para tentar pagar novamente.`,
          );

          setSuccess("");

          window.setTimeout(() => {
            navigate(
              `/meus-pedidos/${pedidoId}`,
              {
                replace: true,
              },
            );
          }, 2500);

          return;
        }

        const axiosError =
          requestError as AxiosError<ApiErrorResponse>;

        console.error(
          "Erro ao finalizar pedido:",
          {
            statusCode:
              axiosError.response
                ?.status,

            data:
              axiosError.response
                ?.data,

            message:
              axiosError.message,
          },
        );

        setError(
          getApiErrorMessage(
            axiosError,
            "Erro ao finalizar pedido. Verifique o estoque dos produtos e tente novamente.",
          ),
        );
      } finally {
        setLoading(false);
      }
    };

  const setSuccessMessage = (
    message: string,
  ) => {
    setError("");
    setSuccess(message);
  };

  return {
    loading,
    error,
    success,

    finalizarPedido,
    clearMessages,
    setSuccessMessage,
  };
}

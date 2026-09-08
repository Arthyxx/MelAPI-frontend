import { api } from '../../../services/api';

import type { Pedido } from '../../../types/pedido';

import type {
  PedidosResponse,
} from './pedido.types';

interface FetchPedidosParams {
  page: number;
  limit: number;
  search?: string;
  status?: string;
}

interface ReembolsoPedidoResponse {
  pedidoId: number;
  status: string;
  refunded: boolean;
  refundId?: string;
  refundAmount?: number;
}

export async function fetchPedidosApi(
  params: FetchPedidosParams,
) {
  const response =
    await api.get<PedidosResponse<Pedido>>(
      '/pedidos',
      {
        params,
      },
    );

  return response.data;
}

export async function updatePedidoStatusApi(
  pedidoId: number,
  status: string,
) {
  await api.patch(
    `/pedidos/${pedidoId}/status`,
    {
      status,
    },
  );
}

export async function refundPedidoApi(
  pedidoId: number,
) {
  const response =
    await api.post<ReembolsoPedidoResponse>(
      `/pagamentos/pedidos/${pedidoId}/reembolso`,
    );

  return response.data;
}

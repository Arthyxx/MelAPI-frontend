import {
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import type { Pedido } from '../../../types/pedido';
import { PedidosTable } from './PedidosTable';

const pedido: Pedido = {
  id: 42,
  clienteId: 7,
  clienteName: 'Cliente de teste',
  clienteEmail: 'cliente@example.com',
  items: [
    {
      id: 1,
      produtoId: 10,
      produtoName: 'Mel 500g',
      quantity: 1,
      unitPrice: 50,
      subtotal: 50,
    },
  ],
  totalPrice: 60,
  shippingPrice: 10,
  shipping: {
    serviceId: '1',
    serviceName: 'Entrega teste',
    companyName: 'Transportadora teste',
    deliveryTime: 5,
    address: {
      zipCode: '60000000',
      street: 'Rua de teste',
      addressNumber: '100',
      complement: null,
      neighborhood: 'Centro',
      city: 'Fortaleza',
      state: 'CE',
    },
  },
  status: 'CANCELAMENTO_PENDENTE',
  createdAt: '2026-09-15T12:00:00.000Z',
  updatedAt: '2026-09-15T12:00:00.000Z',
};

function renderTabela(refundingId: number | null = null) {
  const onRefundPedido = vi
    .fn<(pedidoId: number) => Promise<void>>()
    .mockResolvedValue(undefined);

  const onUpdateStatus = vi.fn();

  render(
    <PedidosTable
      pedidos={[pedido]}
      loading={false}
      updatingId={null}
      refundingId={refundingId}
      onUpdateStatus={onUpdateStatus}
      onRefundPedido={onRefundPedido}
    />,
  );

  return {
    onRefundPedido,
    onUpdateStatus,
  };
}

describe('PedidosTable — retomada de reembolso', () => {
  it('deve solicitar confirmação e retomar o pedido correto uma única vez', async () => {
    const user = userEvent.setup();
    const { onRefundPedido, onUpdateStatus } = renderTabela();

    const botaoDaTabela = screen.getByRole('button', {
      name: 'Retomar reembolso',
    });

    await user.click(botaoDaTabela);

    expect(
      screen.getByRole('heading', {
        name: 'Retomar reembolso do pedido?',
      }),
    ).toBeInTheDocument();

    // Abrir a confirmação ainda não deve solicitar o reembolso.
    expect(onRefundPedido).not.toHaveBeenCalled();

    const botaoConfirmar = screen
      .getAllByRole('button', { name: 'Retomar reembolso' })
      .find((button) => button !== botaoDaTabela);

    if (!botaoConfirmar) {
      throw new Error('Botão de confirmação não encontrado.');
    }

    await user.click(botaoConfirmar);

    await waitFor(() => {
      expect(onRefundPedido).toHaveBeenCalledTimes(1);
      expect(onRefundPedido).toHaveBeenCalledWith(42);

      expect(
        screen.queryByRole('heading', {
          name: 'Retomar reembolso do pedido?',
        }),
      ).not.toBeInTheDocument();
    });

    // A retomada usa a ação de reembolso, não uma mudança manual de status.
    expect(onUpdateStatus).not.toHaveBeenCalled();
  });

  it('não deve solicitar reembolso quando o administrador clicar em Voltar', async () => {
    const user = userEvent.setup();
    const { onRefundPedido } = renderTabela();

    await user.click(
      screen.getByRole('button', {
        name: 'Retomar reembolso',
      }),
    );

    await user.click(
      screen.getByRole('button', {
        name: 'Voltar',
      }),
    );

    expect(onRefundPedido).not.toHaveBeenCalled();

    expect(
      screen.queryByRole('heading', {
        name: 'Retomar reembolso do pedido?',
      }),
    ).not.toBeInTheDocument();
  });

  it('deve bloquear o botão enquanto o reembolso estiver processando', async () => {
    const user = userEvent.setup();
    const { onRefundPedido } = renderTabela(pedido.id);

    const botao = screen.getByRole('button', {
      name: 'Processando reembolso...',
    });

    expect(botao).toBeDisabled();

    await user.click(botao);

    expect(onRefundPedido).not.toHaveBeenCalled();
  });
});

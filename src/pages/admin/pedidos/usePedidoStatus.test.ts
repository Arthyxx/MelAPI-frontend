import { act, renderHook } from '@testing-library/react';
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { refundPedidoApi } from './pedido.api';
import { usePedidoStatus } from './usePedidoStatus';

vi.mock('./pedido.api', () => ({
  refundPedidoApi: vi.fn(),
  updatePedidoStatusApi: vi.fn(),
}));

const mensagemReembolso =
  'O Mercado Pago ainda não confirmou o reembolso.';

describe('usePedidoStatus — falha no reembolso', () => {
  beforeEach(() => {
    vi.mocked(refundPedidoApi).mockReset();

    vi.spyOn(console, 'error').mockImplementation(() => undefined);

    vi.mocked(refundPedidoApi).mockRejectedValue({
      isAxiosError: true,
      message: 'Request failed with status code 503',
      response: {
        status: 503,
        data: {
          message: mensagemReembolso,
        },
      },
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('deve atualizar a lista após falha sem repetir o reembolso', async () => {
    const onUpdated = vi
      .fn<() => Promise<void>>()
      .mockResolvedValue(undefined);

    const { result } = renderHook(() =>
      usePedidoStatus({ onUpdated }),
    );

    await act(async () => {
      await result.current.refundPedido(42);
    });

    expect(refundPedidoApi).toHaveBeenCalledTimes(1);
    expect(refundPedidoApi).toHaveBeenCalledWith(42);

    expect(onUpdated).toHaveBeenCalledTimes(1);

    expect(result.current.error).toBe(mensagemReembolso);
    expect(result.current.success).toBe('');
    expect(result.current.refundingId).toBeNull();
  });

  it('deve preservar o erro original se a atualização também lançar um erro', async () => {
    const onUpdated = vi
      .fn<() => Promise<void>>()
      .mockRejectedValue(new Error('Falha ao atualizar pedidos'));

    const { result } = renderHook(() =>
      usePedidoStatus({ onUpdated }),
    );

    await act(async () => {
      await result.current.refundPedido(42);
    });

    expect(refundPedidoApi).toHaveBeenCalledTimes(1);
    expect(onUpdated).toHaveBeenCalledTimes(1);

    expect(result.current.error).toContain(mensagemReembolso);

    expect(result.current.error).toContain(
      'Não foi possível atualizar os pedidos. Recarregue a página para conferir a situação atual.',
    );

    expect(result.current.success).toBe('');
    expect(result.current.refundingId).toBeNull();
  });
});

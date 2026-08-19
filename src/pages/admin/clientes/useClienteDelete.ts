import type { AxiosError } from 'axios';
import {
  useMemo,
  useState,
} from 'react';

import {
  deleteClienteApi,
} from './cliente.api';

import type {
  ApiErrorResponse,
  Cliente,
} from './cliente.types';

import {
  getErrorMessage,
} from './cliente.utils';

interface UseClienteDeleteOptions {
  clientes: Cliente[];
  onDeleted: () => Promise<void>;
}

export function useClienteDelete({
  clientes,
  onDeleted,
}: UseClienteDeleteOptions) {
  const [deleteId, setDeleteId] =
    useState<number | null>(null);

  const [deleting, setDeleting] =
    useState(false);

  const [error, setError] =
    useState('');

  const [success, setSuccess] =
    useState('');

  const clienteParaExcluir =
    useMemo(() => {
      if (deleteId === null) {
        return undefined;
      }

      return clientes.find(
        (cliente) =>
          cliente.id === deleteId,
      );
    }, [
      clientes,
      deleteId,
    ]);

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  const handleDelete = (
    clienteId: number,
  ) => {
    clearMessages();

    setDeleteId(clienteId);
  };

  const handleConfirmDelete =
    async () => {
      if (deleteId === null) {
        return;
      }

      try {
        clearMessages();
        setDeleting(true);

        await deleteClienteApi(
          deleteId,
        );

        setDeleteId(null);

        setSuccess(
          'Operação concluída. O cliente foi excluído ou desativado para preservar o histórico.',
        );

        await onDeleted();
      } catch (requestError) {
        const axiosError =
          requestError as AxiosError<ApiErrorResponse>;

        console.error(
          'Erro ao excluir cliente:',
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
          getErrorMessage(
            axiosError,
            'Erro ao excluir cliente.',
          ),
        );
      } finally {
        setDeleting(false);
      }
    };

  const handleCancelDelete = () => {
    if (deleting) {
      return;
    }

    setDeleteId(null);
  };

  return {
    deleteId,
    deleting,
    clienteParaExcluir,

    error,
    success,

    handleDelete,
    handleConfirmDelete,
    handleCancelDelete,
  };
}
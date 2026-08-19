import type { AxiosError } from 'axios';
import {
  useMemo,
  useState,
} from 'react';

import {
  deleteProdutoApi,
} from './produto.api';

import type {
  ApiErrorResponse,
  Produto,
} from './produto.types';

import {
  getErrorMessage,
} from './produto.utils';

interface UseProdutoDeleteOptions {
  produtos: Produto[];
  onDeleted: () => Promise<void>;
}

export function useProdutoDelete({
  produtos,
  onDeleted,
}: UseProdutoDeleteOptions) {
  const [deleteId, setDeleteId] =
    useState<number | null>(null);

  const [deleting, setDeleting] =
    useState(false);

  const [error, setError] =
    useState('');

  const [success, setSuccess] =
    useState('');

  const produtoParaExcluir =
    useMemo(() => {
      if (deleteId === null) {
        return undefined;
      }

      return produtos.find(
        (produto) =>
          produto.id === deleteId,
      );
    }, [
      deleteId,
      produtos,
    ]);

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  const handleDelete = (
    produtoId: number,
  ) => {
    clearMessages();

    setDeleteId(
      produtoId,
    );
  };

  const handleConfirmDelete =
    async () => {
      if (deleteId === null) {
        return;
      }

      try {
        clearMessages();
        setDeleting(true);

        await deleteProdutoApi(
          deleteId,
        );

        setDeleteId(null);

        setSuccess(
          'Produto excluído ou desativado com sucesso.',
        );

        await onDeleted();
      } catch (requestError) {
        const axiosError =
          requestError as AxiosError<ApiErrorResponse>;

        console.error(
          'Erro ao excluir produto:',
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
            'Erro ao excluir produto.',
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
    produtoParaExcluir,

    error,
    success,

    handleDelete,
    handleConfirmDelete,
    handleCancelDelete,
  };
}
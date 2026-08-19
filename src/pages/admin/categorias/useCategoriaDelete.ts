import type { AxiosError } from 'axios';
import {
  useMemo,
  useState,
} from 'react';

import {
  deleteCategoriaApi,
} from './categoria.api';

import type {
  ApiErrorResponse,
  Categoria,
} from './categoria.types';

import {
  getErrorMessage,
} from './categoria.utils';

interface UseCategoriaDeleteOptions {
  categorias: Categoria[];
  onDeleted: () => Promise<void>;
}

export function useCategoriaDelete({
  categorias,
  onDeleted,
}: UseCategoriaDeleteOptions) {
  const [deleteId, setDeleteId] =
    useState<number | null>(null);

  const [deleting, setDeleting] =
    useState(false);

  const [error, setError] =
    useState('');

  const [success, setSuccess] =
    useState('');

  const categoriaParaExcluir =
    useMemo(() => {
      if (deleteId === null) {
        return undefined;
      }

      return categorias.find(
        (categoria) =>
          categoria.id === deleteId,
      );
    }, [
      categorias,
      deleteId,
    ]);

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  const handleDelete = (
    categoriaId: number,
  ) => {
    clearMessages();

    setDeleteId(
      categoriaId,
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

        await deleteCategoriaApi(
          deleteId,
        );

        setDeleteId(null);

        setSuccess(
          'Categoria excluída ou desativada com sucesso.',
        );

        await onDeleted();
      } catch (requestError) {
        const axiosError =
          requestError as AxiosError<ApiErrorResponse>;

        console.error(
          'Erro ao excluir categoria:',
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
            'Erro ao excluir categoria.',
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
    categoriaParaExcluir,

    error,
    success,

    handleDelete,
    handleConfirmDelete,
    handleCancelDelete,
  };
}
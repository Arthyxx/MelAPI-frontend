import {
  useState,
  type FormEvent,
} from 'react';

import type {
  AvaliacaoProduto,
  CanReviewProduto,
} from '../../../types/avaliacaoProduto';

import {
  createAvaliacaoProduto,
  deleteMinhaAvaliacaoProduto,
  updateMinhaAvaliacaoProduto,
} from '../../../services/avaliacaoProdutoService';

import {
  getApiErrorMessage,
  logApiError,
} from './avaliacao.utils';

interface UseAvaliacaoProdutoOptions {
  produtoId: string | number;
  minhaAvaliacao?: AvaliacaoProduto | null;
  canReview?: CanReviewProduto | null;
  onSuccess: () => Promise<void> | void;
}

export function useAvaliacaoProduto({
  produtoId,
  minhaAvaliacao,
  canReview,
  onSuccess,
}: UseAvaliacaoProdutoOptions) {
  const [rating, setRating] =
    useState(
      minhaAvaliacao?.rating ?? 5,
    );

  const [comment, setComment] =
    useState(
      minhaAvaliacao?.comment ?? '',
    );

  const [saving, setSaving] =
    useState(false);

  const [deleting, setDeleting] =
    useState(false);

  const [
    editingMinhaAvaliacao,
    setEditingMinhaAvaliacao,
  ] = useState(false);

  const [error, setError] =
    useState('');

  const [success, setSuccess] =
    useState('');

  const isEditing =
    Boolean(minhaAvaliacao);

  const canCreateReview =
    Boolean(canReview?.canReview);

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  const resetForm = () => {
    setRating(
      minhaAvaliacao?.rating ?? 5,
    );

    setComment(
      minhaAvaliacao?.comment ?? '',
    );
  };

  const handleSubmit = async (
    event:
      FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (
      !isEditing &&
      !canCreateReview
    ) {
      setError(
        canReview?.message ||
          'Você só poderá avaliar este produto após receber o pedido.',
      );

      return;
    }

    try {
      clearMessages();
      setSaving(true);

      const payload = {
        rating,
        comment:
          comment.trim() ||
          undefined,
      };

      if (isEditing) {
        await updateMinhaAvaliacaoProduto(
          produtoId,
          payload,
        );

        setSuccess(
          'Avaliação atualizada com sucesso!',
        );
      } else {
        await createAvaliacaoProduto(
          produtoId,
          payload,
        );

        setSuccess(
          'Avaliação enviada com sucesso!',
        );
      }

      await onSuccess();

      setEditingMinhaAvaliacao(
        false,
      );
    } catch (err: unknown) {
      logApiError(
        'Erro ao salvar avaliação:',
        err,
      );

      setError(
        getApiErrorMessage(
          err,
          'Erro ao salvar avaliação. Tente novamente.',
        ),
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete =
    async () => {
      const confirmed =
        window.confirm(
          'Tem certeza que deseja remover sua avaliação?',
        );

      if (!confirmed) {
        return;
      }

      try {
        clearMessages();
        setDeleting(true);

        await deleteMinhaAvaliacaoProduto(
          produtoId,
        );

        setRating(5);
        setComment('');

        setEditingMinhaAvaliacao(
          false,
        );

        setSuccess(
          'Avaliação removida com sucesso!',
        );

        await onSuccess();
      } catch (err: unknown) {
        logApiError(
          'Erro ao remover avaliação:',
          err,
        );

        setError(
          getApiErrorMessage(
            err,
            'Erro ao remover avaliação. Tente novamente.',
          ),
        );
      } finally {
        setDeleting(false);
      }
    };

  const handleStartEdit = () => {
    if (!minhaAvaliacao) {
      return;
    }

    setRating(
      minhaAvaliacao.rating,
    );

    setComment(
      minhaAvaliacao.comment ?? '',
    );

    clearMessages();

    setEditingMinhaAvaliacao(
      true,
    );
  };

  const handleCancelEdit = () => {
    setEditingMinhaAvaliacao(
      false,
    );

    clearMessages();
    resetForm();
  };

  return {
    rating,
    comment,

    saving,
    deleting,

    editingMinhaAvaliacao,

    error,
    success,

    isEditing,
    canCreateReview,

    setRating,
    setComment,

    handleSubmit,
    handleDelete,
    handleStartEdit,
    handleCancelEdit,
  };
}
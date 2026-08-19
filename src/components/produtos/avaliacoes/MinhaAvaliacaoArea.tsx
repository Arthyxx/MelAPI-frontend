import type {
  FormEvent,
} from 'react';
import { Link } from 'react-router-dom';

import type {
  AvaliacaoProduto,
  CanReviewProduto,
} from '../../../types/avaliacaoProduto';
import {
  formatDate,
} from '../../../utils/formatDate';

import {
  AvaliacaoForm,
} from './AvaliacaoForm';
import {
  Stars,
} from './Stars';

interface MinhaAvaliacaoAreaProps {
  isLogged: boolean;
  minhaAvaliacao?: AvaliacaoProduto | null;
  canReview?: CanReviewProduto | null;
  loadingCanReview: boolean;

  rating: number;
  comment: string;

  saving: boolean;
  deleting: boolean;

  editingMinhaAvaliacao: boolean;

  error: string;
  success: string;

  onRatingChange: (
    value: number,
  ) => void;

  onCommentChange: (
    value: string,
  ) => void;

  onSubmit: (
    event: FormEvent<HTMLFormElement>,
  ) => void;

  onStartEdit: () => void;
  onCancelEdit: () => void;
  onDelete: () => void;
}

export function MinhaAvaliacaoArea({
  isLogged,
  minhaAvaliacao,
  canReview,
  loadingCanReview,

  rating,
  comment,

  saving,
  deleting,

  editingMinhaAvaliacao,

  error,
  success,

  onRatingChange,
  onCommentChange,

  onSubmit,

  onStartEdit,
  onCancelEdit,
  onDelete,
}: MinhaAvaliacaoAreaProps) {
  const isEditing =
    Boolean(minhaAvaliacao);

  const canCreateReview =
    Boolean(canReview?.canReview);

  const renderForm = () => (
    <AvaliacaoForm
      rating={rating}
      comment={comment}
      isEditing={isEditing}
      saving={saving}
      deleting={deleting}
      error={error}
      success={success}
      onRatingChange={
        onRatingChange
      }
      onCommentChange={
        onCommentChange
      }
      onSubmit={onSubmit}
      onCancelEdit={
        onCancelEdit
      }
    />
  );

  if (!isLogged) {
    return (
      <div className="rounded-[1.75rem] border border-dashed border-amber-200 bg-white p-6 text-center shadow-sm dark:border-amber-900 dark:bg-gray-950">
        <div className="text-5xl">
          🔐
        </div>

        <h4 className="mt-4 text-xl font-black text-gray-900 dark:text-white">
          Entre para avaliar
        </h4>

        <p className="mx-auto mt-2 max-w-md text-sm text-gray-500 dark:text-gray-400">
          Você pode ver avaliações sem
          login, mas para avaliar
          precisa entrar na sua conta.
        </p>

        <Link
          to="/login"
          className="mt-5 inline-flex rounded-xl bg-amber-600 px-5 py-3 text-sm font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-amber-700 hover:shadow-xl"
        >
          Entrar para avaliar
        </Link>
      </div>
    );
  }

  if (
    loadingCanReview &&
    !isEditing
  ) {
    return (
      <div className="rounded-[1.75rem] border border-amber-100 bg-white p-6 text-center shadow-sm dark:border-amber-900 dark:bg-gray-950">
        <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-amber-300 border-t-amber-700" />

        <p className="mt-4 font-bold text-gray-800 dark:text-gray-200">
          Verificando se você pode
          avaliar este produto...
        </p>
      </div>
    );
  }

  if (
    isEditing &&
    !editingMinhaAvaliacao &&
    minhaAvaliacao
  ) {
    return (
      <div className="rounded-[1.75rem] border border-amber-100 bg-white p-5 shadow-sm dark:border-amber-900 dark:bg-gray-950">
        {success && (
          <div
            role="status"
            className="mb-5 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700 dark:border-green-900 dark:bg-green-950/40 dark:text-green-300"
          >
            {success}
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
          >
            {error}
          </div>
        )}

        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-100 to-yellow-100 text-2xl shadow-sm dark:from-amber-950 dark:to-gray-900">
              👤
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="text-lg font-black text-gray-900 dark:text-white">
                  Sua avaliação
                </h4>

                <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                  Verificada
                </span>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-2">
                <div className="text-lg leading-none">
                  <Stars
                    value={
                      minhaAvaliacao.rating
                    }
                  />
                </div>

                <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                  {
                    minhaAvaliacao.rating
                  }
                  /5
                </span>

                <span className="text-gray-300 dark:text-gray-700">
                  •
                </span>

                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  {formatDate(
                    minhaAvaliacao.createdAt,
                  )}
                </span>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap gap-2">
            <button
              type="button"
              onClick={
                onStartEdit
              }
              className="rounded-xl border border-amber-200 bg-white px-4 py-2 text-sm font-black text-amber-800 shadow-sm transition hover:-translate-y-0.5 hover:bg-amber-50 hover:shadow-md dark:border-amber-800 dark:bg-gray-950 dark:text-amber-300 dark:hover:bg-gray-900"
            >
              Editar
            </button>

            <button
              type="button"
              onClick={onDelete}
              disabled={
                deleting || saving
              }
              className="rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-black text-red-600 shadow-sm transition hover:-translate-y-0.5 hover:bg-red-50 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-900 dark:bg-gray-950 dark:text-red-300 dark:hover:bg-red-950/30"
            >
              {deleting
                ? 'Removendo...'
                : 'Remover'}
            </button>
          </div>
        </div>

        <div className="mt-5 border-t border-gray-100 pt-5 dark:border-gray-800">
          {minhaAvaliacao.comment ? (
            <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
              “
              {
                minhaAvaliacao.comment
              }
              ”
            </p>
          ) : (
            <p className="text-sm italic text-gray-400">
              Você avaliou sem
              comentário.
            </p>
          )}
        </div>
      </div>
    );
  }

  if (
    isEditing &&
    editingMinhaAvaliacao
  ) {
    return renderForm();
  }

  if (
    !isEditing &&
    !canCreateReview
  ) {
    return (
      <div className="rounded-[1.75rem] border border-dashed border-amber-200 bg-white p-6 text-center shadow-sm dark:border-amber-900 dark:bg-gray-950">
        <div className="text-5xl">
          📦
        </div>

        <h4 className="mt-4 text-xl font-black text-gray-900 dark:text-white">
          Avaliação disponível após
          entrega
        </h4>

        <p className="mx-auto mt-2 max-w-md text-sm text-gray-500 dark:text-gray-400">
          {canReview?.message ||
            'Você poderá avaliar este produto depois que um pedido contendo ele estiver entregue.'}
        </p>

        <Link
          to="/meus-pedidos"
          className="mt-5 inline-flex rounded-xl border border-amber-200 bg-white px-5 py-3 text-sm font-black text-amber-800 shadow-sm transition hover:-translate-y-0.5 hover:bg-amber-50 hover:shadow-md dark:border-amber-800 dark:bg-gray-950 dark:text-amber-300 dark:hover:bg-gray-900"
        >
          Ver meus pedidos
        </Link>
      </div>
    );
  }

  return renderForm();
}
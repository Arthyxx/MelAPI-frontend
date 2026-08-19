import type {
  FormEvent,
} from 'react';

import {
  StarsInput,
} from './Stars';

interface AvaliacaoFormProps {
  rating: number;
  comment: string;
  isEditing: boolean;
  saving: boolean;
  deleting: boolean;
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
  onCancelEdit: () => void;
}

export function AvaliacaoForm({
  rating,
  comment,
  isEditing,
  saving,
  deleting,
  error,
  success,
  onRatingChange,
  onCommentChange,
  onSubmit,
  onCancelEdit,
}: AvaliacaoFormProps) {
  const isDisabled =
    saving || deleting;

  return (
    <div className="rounded-[1.75rem] border border-amber-100 bg-white p-5 shadow-sm dark:border-amber-900 dark:bg-gray-950">
      <div className="mb-5">
        <h4 className="text-xl font-black text-gray-900 dark:text-white">
          {isEditing
            ? 'Editar avaliação'
            : 'Deixe sua avaliação'}
        </h4>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {isEditing
            ? 'Altere sua nota ou comentário e salve novamente.'
            : 'Conte sua experiência depois de receber o produto.'}
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
        >
          {error}
        </div>
      )}

      {success && (
        <div
          role="status"
          className="mb-5 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700 dark:border-green-900 dark:bg-green-950/40 dark:text-green-300"
        >
          {success}
        </div>
      )}

      <form
        onSubmit={onSubmit}
        className="space-y-6"
      >
        <div>
          <label className="mb-3 block text-sm font-black text-gray-800 dark:text-gray-200">
            Nota do produto
          </label>

          <div className="flex flex-wrap gap-2">
            <StarsInput
              value={rating}
              onChange={
                onRatingChange
              }
              disabled={isDisabled}
            />
          </div>

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Nota selecionada:{' '}
            {rating}/5
          </p>
        </div>

        <div>
          <label className="mb-3 block text-sm font-black text-gray-800 dark:text-gray-200">
            Comentário
          </label>

          <textarea
            value={comment}
            onChange={(event) =>
              onCommentChange(
                event.target.value,
              )
            }
            disabled={isDisabled}
            maxLength={1000}
            rows={5}
            placeholder="Conte o que achou do produto..."
            className="w-full resize-none rounded-2xl border border-amber-200 bg-white px-4 py-3 text-gray-900 shadow-sm outline-none transition duration-300 placeholder:text-gray-400 focus:border-amber-500 focus:ring-4 focus:ring-amber-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-amber-800 dark:bg-gray-950 dark:text-white dark:focus:ring-amber-900"
          />

          <p className="mt-2 text-right text-xs text-gray-500 dark:text-gray-400">
            {comment.length}/1000
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {isEditing ? (
            <button
              type="button"
              onClick={
                onCancelEdit
              }
              disabled={isDisabled}
              className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-black text-gray-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-gray-50 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300"
            >
              Cancelar edição
            </button>
          ) : (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Você poderá editar sua
              avaliação depois.
            </span>
          )}

          <button
            type="submit"
            disabled={isDisabled}
            className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 px-6 py-3 text-sm font-black text-white shadow-lg transition duration-300 hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
          >
            <span className="absolute inset-0 translate-x-[-100%] bg-white/20 transition duration-700 group-hover:translate-x-[100%]" />

            <span className="relative flex items-center justify-center gap-2">
              {saving ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Salvando...
                </>
              ) : (
                <>
                  {isEditing
                    ? 'Salvar alterações'
                    : 'Enviar avaliação'}

                  <span className="transition group-hover:translate-x-1">
                    →
                  </span>
                </>
              )}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}
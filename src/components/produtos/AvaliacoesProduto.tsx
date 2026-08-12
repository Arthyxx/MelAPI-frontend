import {
  useState,
  type FormEvent,
} from 'react';
import { isAxiosError } from 'axios';
import { Link } from 'react-router-dom';

import type {
  AvaliacaoProduto,
  CanReviewProduto,
} from '../../types/avaliacaoProduto';
import {
  createAvaliacaoProduto,
  deleteMinhaAvaliacaoProduto,
  updateMinhaAvaliacaoProduto,
} from '../../services/avaliacaoProdutoService';
import { formatDate } from '../../utils/formatDate';

interface AvaliacoesProdutoProps {
  produtoId: string | number;
  avaliacoes: AvaliacaoProduto[];
  loading: boolean;
  isLogged: boolean;
  minhaAvaliacao?: AvaliacaoProduto | null;
  canReview?: CanReviewProduto | null;
  loadingCanReview?: boolean;
  onSuccess: () => Promise<void> | void;
}

interface ApiErrorResponse {
  message?: string | string[];
  error?: string;
}

function getApiErrorMessage(
  error: unknown,
  fallback: string,
) {
  if (
    !isAxiosError<ApiErrorResponse>(
      error,
    )
  ) {
    return fallback;
  }

  const message =
    error.response?.data?.message;

  if (Array.isArray(message)) {
    return message.join(' ');
  }

  if (typeof message === 'string') {
    return message;
  }

  const apiError =
    error.response?.data?.error;

  if (typeof apiError === 'string') {
    return apiError;
  }

  return fallback;
}

function logApiError(
  title: string,
  error: unknown,
) {
  if (
    isAxiosError<ApiErrorResponse>(
      error,
    )
  ) {
    console.error(title, {
      statusCode:
        error.response?.status,
      data: error.response?.data,
      message: error.message,
    });

    return;
  }

  console.error(title, {
    message:
      error instanceof Error
        ? error.message
        : 'Erro desconhecido.',
  });
}

export function AvaliacoesProduto({
  produtoId,
  avaliacoes,
  loading,
  isLogged,
  minhaAvaliacao,
  canReview,
  loadingCanReview = false,
  onSuccess,
}: AvaliacoesProdutoProps) {
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
    !!minhaAvaliacao;

  const canCreateReview =
    !!canReview?.canReview;

  const media =
    avaliacoes.length > 0
      ? avaliacoes.reduce(
          (sum, avaliacao) =>
            sum + avaliacao.rating,
          0,
        ) / avaliacoes.length
      : 0;

  const outrasAvaliacoes =
    minhaAvaliacao
      ? avaliacoes.filter(
          (avaliacao) =>
            avaliacao.id !==
            minhaAvaliacao.id,
        )
      : avaliacoes;

  const renderStars = (
    value: number,
  ) => {
    return Array.from(
      { length: 5 },
      (_, index) => {
        const filled =
          index < value;

        return (
          <span
            key={index}
            className={
              filled
                ? 'text-yellow-500'
                : 'text-gray-300'
            }
          >
            ★
          </span>
        );
      },
    );
  };

  const renderStarsButton = () => {
    return Array.from(
      { length: 5 },
      (_, index) => {
        const value = index + 1;

        const selected =
          value <= rating;

        return (
          <button
            key={value}
            type="button"
            onClick={() =>
              setRating(value)
            }
            className={`text-4xl transition hover:-translate-y-1 ${
              selected
                ? 'text-yellow-500'
                : 'text-gray-300 hover:text-yellow-300'
            }`}
            aria-label={`Avaliar com ${value} estrela${
              value > 1 ? 's' : ''
            }`}
          >
            ★
          </button>
        );
      },
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
      setError('');
      setSuccess('');
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
        setError('');
        setSuccess('');
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

    setSuccess('');
    setError('');

    setEditingMinhaAvaliacao(
      true,
    );
  };

  const handleCancelEdit = () => {
    setEditingMinhaAvaliacao(
      false,
    );

    setError('');
    setSuccess('');

    setRating(
      minhaAvaliacao?.rating ?? 5,
    );

    setComment(
      minhaAvaliacao?.comment ?? '',
    );
  };

  const renderReviewForm = () => {
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
          <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-5 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700 dark:border-green-900 dark:bg-green-950/40 dark:text-green-300">
            {success}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div>
            <label className="mb-3 block text-sm font-black text-gray-800 dark:text-gray-200">
              Nota do produto
            </label>

            <div className="flex flex-wrap gap-2">
              {renderStarsButton()}
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
                setComment(
                  event.target.value,
                )
              }
              maxLength={1000}
              rows={5}
              placeholder="Conte o que achou do produto..."
              className="w-full resize-none rounded-2xl border border-amber-200 bg-white px-4 py-3 text-gray-900 shadow-sm outline-none transition duration-300 placeholder:text-gray-400 focus:border-amber-500 focus:ring-4 focus:ring-amber-100 dark:border-amber-800 dark:bg-gray-950 dark:text-white dark:focus:ring-amber-900"
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
                  handleCancelEdit
                }
                disabled={
                  saving || deleting
                }
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
              disabled={
                saving || deleting
              }
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
  };

  const renderMinhaAvaliacaoArea =
    () => {
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
              Você pode ver avaliações
              sem login, mas para
              avaliar precisa entrar na
              sua conta.
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
              <div className="mb-5 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700 dark:border-green-900 dark:bg-green-950/40 dark:text-green-300">
                {success}
              </div>
            )}

            {error && (
              <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
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
                      {renderStars(
                        minhaAvaliacao.rating,
                      )}
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
                    handleStartEdit
                  }
                  className="rounded-xl border border-amber-200 bg-white px-4 py-2 text-sm font-black text-amber-800 shadow-sm transition hover:-translate-y-0.5 hover:bg-amber-50 hover:shadow-md dark:border-amber-800 dark:bg-gray-950 dark:text-amber-300 dark:hover:bg-gray-900"
                >
                  Editar
                </button>

                <button
                  type="button"
                  onClick={
                    handleDelete
                  }
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
        return renderReviewForm();
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

      return renderReviewForm();
    };

  if (loading) {
    return (
      <section className="mt-8 rounded-[2rem] border border-amber-200 bg-white/90 p-6 shadow-xl dark:border-amber-800 dark:bg-gray-900/90">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 animate-pulse rounded-2xl bg-amber-100" />

          <div>
            <div className="h-4 w-40 animate-pulse rounded bg-amber-100" />

            <div className="mt-2 h-3 w-56 animate-pulse rounded bg-amber-50" />
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="h-28 animate-pulse rounded-3xl bg-amber-50" />

          <div className="h-28 animate-pulse rounded-3xl bg-amber-50" />
        </div>
      </section>
    );
  }

  return (
    <section className="mt-8 overflow-hidden rounded-[2rem] border border-amber-200 bg-white/90 shadow-xl backdrop-blur-xl dark:border-amber-800 dark:bg-gray-900/90">
      <div className="bg-gradient-to-r from-amber-700 via-yellow-600 to-amber-700 px-6 py-7 text-white">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-amber-100">
              Avaliações
            </p>

            <h3 className="mt-1 text-3xl font-black">
              Opiniões dos clientes
            </h3>

            <p className="mt-2 text-sm text-amber-50">
              Veja avaliações reais de
              clientes que compraram e
              receberam este produto.
            </p>
          </div>

          <div className="w-fit rounded-3xl bg-white/15 px-5 py-4 shadow-inner backdrop-blur-md">
            <div className="flex items-center gap-3">
              <span className="text-4xl font-black">
                {media.toFixed(1)}
              </span>

              <div>
                <div className="text-lg leading-none">
                  {renderStars(
                    Math.round(media),
                  )}
                </div>

                <p className="mt-1 text-xs text-amber-100">
                  {avaliacoes.length}{' '}
                  {avaliacoes.length ===
                  1
                    ? 'avaliação'
                    : 'avaliações'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-8 p-6">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 text-xl">
              ✍️
            </div>

            <div>
              <h4 className="font-black text-gray-900 dark:text-white">
                Sua avaliação
              </h4>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                Avalie apenas produtos
                comprados e entregues.
              </p>
            </div>
          </div>

          {renderMinhaAvaliacaoArea()}
        </div>

        <div className="border-t border-amber-100 pt-8 dark:border-amber-900">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 text-xl">
              ⭐
            </div>

            <div>
              <h4 className="font-black text-gray-900 dark:text-white">
                Avaliações dos clientes
              </h4>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                Comentários de quem já
                recebeu o produto.
              </p>
            </div>
          </div>

          {outrasAvaliacoes.length ===
          0 ? (
            <div className="rounded-[1.75rem] border border-dashed border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-800 dark:bg-gray-950">
              <div className="text-5xl">
                ⭐
              </div>

              <h4 className="mt-4 text-xl font-black text-gray-900 dark:text-white">
                Ainda não há outras
                avaliações
              </h4>

              <p className="mx-auto mt-2 max-w-md text-sm text-gray-500 dark:text-gray-400">
                Nenhum outro cliente
                avaliou este produto
                ainda.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {outrasAvaliacoes.map(
                (avaliacao) => (
                  <article
                    key={
                      avaliacao.id
                    }
                    className="rounded-[1.75rem] border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-gray-800 dark:bg-gray-950"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex items-start gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-xl shadow-sm dark:bg-amber-950/40">
                          👤
                        </div>

                        <div>
                          <h4 className="font-black text-gray-900 dark:text-white">
                            {avaliacao.clienteName ||
                              'Cliente'}
                          </h4>

                          <div className="mt-2 flex flex-wrap items-center gap-2">
                            <div className="text-base leading-none">
                              {renderStars(
                                avaliacao.rating,
                              )}
                            </div>

                            <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                              {
                                avaliacao.rating
                              }
                              /5
                            </span>

                            <span className="text-gray-300 dark:text-gray-700">
                              •
                            </span>

                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                              {formatDate(
                                avaliacao.createdAt,
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {avaliacao.comment ? (
                      <p className="mt-5 border-t border-gray-100 pt-5 text-sm leading-relaxed text-gray-700 dark:border-gray-800 dark:text-gray-300">
                        “
                        {
                          avaliacao.comment
                        }
                        ”
                      </p>
                    ) : (
                      <p className="mt-5 border-t border-gray-100 pt-5 text-sm italic text-gray-400 dark:border-gray-800">
                        Cliente avaliou
                        sem comentário.
                      </p>
                    )}
                  </article>
                ),
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
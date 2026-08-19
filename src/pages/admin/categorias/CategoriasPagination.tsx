import type { ReactNode } from 'react';

import type { Pagination } from './categoria.types';

interface CategoriasPaginationProps {
  pagination: Pagination;
  categoriasCount: number;
  limit: number;
  loading: boolean;
  children: ReactNode;
  onLimitChange: (
    value: number,
  ) => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
}

export function CategoriasPagination({
  pagination,
  categoriasCount,
  limit,
  loading,
  children,
  onLimitChange,
  onPreviousPage,
  onNextPage,
}: CategoriasPaginationProps) {
  return (
    <>
      <div className="flex flex-col gap-4 border-b border-gray-100 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-xl font-black text-gray-950">
            Categorias cadastradas
          </h3>

          <p className="text-sm text-gray-500">
            Página {pagination.page}{' '}
            de {pagination.totalPages}{' '}
            — {pagination.totalItems}{' '}
            resultado(s).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label
            htmlFor="categorias-limit"
            className="text-sm font-bold text-gray-600"
          >
            Por página:
          </label>

          <select
            id="categorias-limit"
            value={limit}
            onChange={(event) =>
              onLimitChange(
                Number(
                  event.target.value,
                ),
              )
            }
            className="h-10 rounded-xl border border-gray-200 bg-white px-3 text-sm font-bold outline-none focus:border-amber-400"
          >
            <option value={5}>
              5
            </option>

            <option value={10}>
              10
            </option>

            <option value={20}>
              20
            </option>

            <option value={50}>
              50
            </option>
          </select>
        </div>
      </div>

      {children}

      <div className="flex flex-col gap-3 border-t border-gray-100 p-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-semibold text-gray-500">
          Mostrando {categoriasCount}{' '}
          de {pagination.totalItems}{' '}
          resultado(s).
        </p>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={
              onPreviousPage
            }
            disabled={
              loading ||
              !pagination.hasPreviousPage
            }
            className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-black text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Anterior
          </button>

          <span className="flex min-w-24 items-center justify-center rounded-xl bg-gray-50 px-4 py-2 text-sm font-black text-gray-700">
            {pagination.page}{' '}
            /{' '}
            {pagination.totalPages}
          </span>

          <button
            type="button"
            onClick={
              onNextPage
            }
            disabled={
              loading ||
              !pagination.hasNextPage
            }
            className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-black text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Próxima
          </button>
        </div>
      </div>
    </>
  );
}
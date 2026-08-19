import { api } from '../../../services/api';

import type {
  CategoriaFormData,
  CategoriasResponse,
} from './categoria.types';

interface FetchCategoriasParams {
  page: number;
  limit: number;
  search?: string;
  active?: string;
}

interface CategoriaPayload {
  name: string;
  description?: string;
  active: boolean;
}

export async function fetchCategoriasApi(
  params: FetchCategoriasParams,
) {
  const response =
    await api.get<CategoriasResponse>(
      '/categorias/admin',
      {
        params,
      },
    );

  return response.data;
}

export async function createCategoriaApi(
  payload: CategoriaPayload,
) {
  await api.post(
    '/categorias',
    payload,
  );
}

export async function updateCategoriaApi(
  categoriaId: number,
  payload: CategoriaPayload,
) {
  await api.put(
    `/categorias/${categoriaId}`,
    payload,
  );
}

export async function deleteCategoriaApi(
  categoriaId: number,
) {
  await api.delete(
    `/categorias/${categoriaId}`,
  );
}

export function createCategoriaPayload(
  formData: CategoriaFormData,
): CategoriaPayload {
  return {
    name: formData.name.trim(),

    description:
      formData.description.trim() ||
      undefined,

    active: formData.active,
  };
}
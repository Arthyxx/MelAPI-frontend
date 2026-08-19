import { api } from '../../../services/api';

import type {
  Categoria,
  ImageUploadResponse,
  ProdutoFormData,
  ProdutosResponse,
} from './produto.types';

interface FetchProdutosParams {
  page: number;
  limit: number;
  name?: string;
  categoryId?: string;
  active?: string;
  sort: string;
}

interface ProdutoPayload {
  name: string;
  description?: string;
  price: number;
  stockQuantity: number;
  categoryId: number;
  imageUrl?: string;
  imagePublicId?: string;
  active: boolean;
}

export async function fetchProdutosApi(
  params: FetchProdutosParams,
) {
  const response =
    await api.get<ProdutosResponse>(
      '/produtos/admin',
      {
        params,
      },
    );

  return response.data;
}

export async function fetchCategoriasApi() {
  const response =
    await api.get<Categoria[] | {
      content: Categoria[];
    }>('/categorias');

  const data = response.data;

  if (
    typeof data === 'object' &&
    data !== null &&
    'content' in data
  ) {
    return Array.isArray(data.content)
      ? data.content
      : [];
  }

  return Array.isArray(data)
    ? data
    : [];
}

export async function uploadProdutoImageApi(
  file: File,
) {
  const uploadData =
    new FormData();

  uploadData.append(
    'file',
    file,
  );

  const response =
    await api.post<ImageUploadResponse>(
      '/produtos/upload-image',
      uploadData,
    );

  return response.data;
}

export async function createProdutoApi(
  payload: ProdutoPayload,
) {
  await api.post(
    '/produtos',
    payload,
  );
}

export async function updateProdutoApi(
  produtoId: number,
  payload: ProdutoPayload,
) {
  await api.put(
    `/produtos/${produtoId}`,
    payload,
  );
}

export async function deleteProdutoApi(
  produtoId: number,
) {
  await api.delete(
    `/produtos/${produtoId}`,
  );
}

export function createProdutoPayload(
  formData: ProdutoFormData,
  imageData: {
    imageUrl?: string;
    imagePublicId?: string;
  },
): ProdutoPayload {
  return {
    name:
      formData.name.trim(),

    description:
      formData.description.trim() ||
      undefined,

    price: Number(
      formData.price,
    ),

    stockQuantity: Number(
      formData.stockQuantity,
    ),

    categoryId: Number(
      formData.categoryId,
    ),

    imageUrl:
      imageData.imageUrl,

    imagePublicId:
      imageData.imagePublicId,

    active:
      formData.active,
  };
}
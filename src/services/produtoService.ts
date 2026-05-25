import { api } from './api';
import type { Produto } from '../types/produto';

export interface ProdutoFilters {
  name?: string;
  categoryId?: number | null;
  active?: boolean | null;
  sort?: string;
}

export async function findAllProdutos(
  filters?: ProdutoFilters
): Promise<Produto[]> {
  const params = new URLSearchParams();

  if (filters?.name?.trim()) {
    params.append('name', filters.name.trim());
  }

  if (filters?.categoryId) {
    params.append('categoryId', String(filters.categoryId));
  }

  if (filters?.active !== null && filters?.active !== undefined) {
    params.append('active', String(filters.active));
  }

  if (filters?.sort) {
    params.append('sort', filters.sort);
  }

  const queryString = params.toString();

  const response = await api.get(
    queryString ? `/produtos?${queryString}` : '/produtos'
  );

  const content = response.data.content || response.data;

  return Array.isArray(content) ? content : [];
}

export async function findProdutoById(id: string | number): Promise<Produto> {
  const response = await api.get(`/produtos/${id}`);

  return response.data;
}
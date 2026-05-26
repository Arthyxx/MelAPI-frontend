import { api } from './api';
import type { Categoria } from '../types/categoria';

export async function findAllCategorias(): Promise<Categoria[]> {
  const response = await api.get('/categorias');

  const content = response.data.content || response.data;

  return Array.isArray(content) ? content : [];
}

export async function findCategoriaById(
  id: string | number
): Promise<Categoria> {
  const response = await api.get(`/categorias/${id}`);

  return response.data;
}
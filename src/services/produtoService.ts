import { api } from './api';
import type { Produto } from '../types/produto';

export async function findAllProdutos(): Promise<Produto[]> {
  const response = await api.get('/produtos');

  const content = response.data.content || response.data;

  return Array.isArray(content) ? content : [];
}

export async function findProdutoById(id: string | number): Promise<Produto> {
  const response = await api.get(`/produtos/${id}`);

  return response.data;
}
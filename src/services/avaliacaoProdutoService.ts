import { api } from './api';
import type { AvaliacaoProduto, CanReviewProduto } from '../types/avaliacaoProduto';

export interface CreateAvaliacaoProdutoPayload {
  rating: number;
  comment?: string;
}

export interface PatchAvaliacaoProdutoPayload {
  rating?: number;
  comment?: string;
}

export async function findAvaliacoesByProdutoId(
  produtoId: string | number
): Promise<AvaliacaoProduto[]> {
  const response = await api.get(`/produtos/${produtoId}/avaliacoes`);

  return Array.isArray(response.data) ? response.data : [];
}

export async function createAvaliacaoProduto(
  produtoId: string | number,
  payload: CreateAvaliacaoProdutoPayload
): Promise<AvaliacaoProduto> {
  const response = await api.post(`/produtos/${produtoId}/avaliacoes`, payload);

  return response.data;
}

export async function updateMinhaAvaliacaoProduto(
  produtoId: string | number,
  payload: PatchAvaliacaoProdutoPayload
): Promise<AvaliacaoProduto> {
  const response = await api.patch(
    `/produtos/${produtoId}/avaliacoes/minha`,
    payload
  );

  return response.data;
}

export async function deleteMinhaAvaliacaoProduto(
  produtoId: string | number
): Promise<void> {
  await api.delete(`/produtos/${produtoId}/avaliacoes/minha`);
}

export async function canReviewProduto(
  produtoId: string | number
): Promise<CanReviewProduto> {
  const response = await api.get(`/produtos/${produtoId}/avaliacoes/pode-avaliar`);

  return response.data;
}
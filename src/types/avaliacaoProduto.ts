export interface AvaliacaoProduto {
  id: number;
  rating: number;
  comment: string | null;

  produtoId: number;
  produtoName: string;

  clienteId: number;
  clienteName: string;

  createdAt: string;
  updatedAt: string;
}

export interface CanReviewProduto {
  canReview: boolean;
  message: string;
}
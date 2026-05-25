export interface Produto {
  id: number;
  name: string;
  price: number;
  stockQuantity: number;
  imageUrl?: string;
  description?: string;
  active?: boolean;
}

export interface CategoriaResumo {
  id: number;
  name: string;
}

export interface Produto {
  id: number;
  name: string;
  description?: string;
  price: number;
  stockQuantity: number;
  imageUrl?: string;
  active?: boolean;

  category?: CategoriaResumo | null;

  averageRating?: number | null;
  reviewsCount?: number | null;

  createdAt?: string;
  updatedAt?: string;
}
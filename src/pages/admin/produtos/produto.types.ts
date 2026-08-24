export interface Produto {
  id: number;
  name: string;
  price: number;
  stockQuantity: number;

  description?: string | null;

  imageUrl?: string | null;
  imagePublicId?: string | null;

  weightKg?: number | null;
  heightCm?: number | null;
  widthCm?: number | null;
  lengthCm?: number | null;

  active: boolean;

  category: {
    id: number;
    name: string;
  };
}

export interface Categoria {
  id: number;
  name: string;
}

export interface Pagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ProdutosResponse {
  content: Produto[];
  pagination: Pagination;
}

export interface ImageUploadResponse {
  imageUrl: string;
  imagePublicId: string;
}

export interface ApiErrorResponse {
  message?: string | string[];
  error?: string;
}

export interface ProdutoFormData {
  name: string;
  description: string;
  price: string;
  stockQuantity: string;

  weightKg: string;
  heightCm: string;
  widthCm: string;
  lengthCm: string;

  categoryId: string;

  imageUrl: string;
  imagePublicId: string;

  active: boolean;
}

export type ActiveFilter =
  | 'true'
  | 'false'
  | '';
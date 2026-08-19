export type ActiveFilter =
  | 'true'
  | 'false'
  | '';

export interface Categoria {
  id: number;
  name: string;
  description: string | null;
  active: boolean;
}

export interface Pagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface CategoriasResponse {
  content: Categoria[];
  pagination: Pagination;
}

export interface ApiErrorResponse {
  message?: string | string[];
  error?: string;
}

export interface CategoriaFormData {
  name: string;
  description: string;
  active: boolean;
}
export interface Pagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PedidosResponse<TPedido> {
  content: TPedido[];
  pagination: Pagination;
}

export interface ApiErrorResponse {
  message?: string | string[];
  error?: string;
}
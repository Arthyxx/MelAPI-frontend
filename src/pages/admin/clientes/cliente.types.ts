export type ClienteRole =
  | 'ADMIN'
  | 'CLIENTE';

export type ActiveFilter =
  | 'true'
  | 'false'
  | '';

export interface Cliente {
  id: number;
  name: string;
  email: string;
  role: ClienteRole;
  active: boolean;
  phone?: string | null;
  city?: string | null;
  createdAt?: string;
}

export interface Pagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ClientesResponse {
  content: Cliente[];
  pagination: Pagination;
}

export interface ApiErrorResponse {
  message?: string | string[];
  error?: string;
}

export interface ClienteFormData {
  name: string;
  email: string;
  password: string;
  role: ClienteRole;
  active: boolean;
}
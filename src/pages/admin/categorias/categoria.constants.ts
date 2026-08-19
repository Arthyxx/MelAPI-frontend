import type {
  CategoriaFormData,
  Pagination,
} from './categoria.types';

export const initialFormData: CategoriaFormData = {
  name: '',
  description: '',
  active: true,
};

export const initialPagination: Pagination = {
  page: 1,
  limit: 10,
  totalItems: 0,
  totalPages: 1,
  hasNextPage: false,
  hasPreviousPage: false,
};
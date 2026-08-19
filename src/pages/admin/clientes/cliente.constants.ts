import type {
  ClienteFormData,
  Pagination,
} from './cliente.types';

export const initialFormData: ClienteFormData = {
  name: '',
  email: '',
  password: '',
  role: 'CLIENTE',
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
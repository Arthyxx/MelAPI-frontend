import type {
  Pagination,
  ProdutoFormData,
} from './produto.types';

export const initialFormData: ProdutoFormData = {
  name: '',
  description: '',
  price: '',
  stockQuantity: '',
  categoryId: '',
  imageUrl: '',
  imagePublicId: '',
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

export const MAX_IMAGE_SIZE =
  5 * 1024 * 1024;

export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
];
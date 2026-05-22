export interface Produto {
  id: number;
  name: string;
  price: number;
  stockQuantity: number;
  imageUrl?: string;
  description?: string;
  active?: boolean;
}
export interface ItemPedido {
  id: number;
  produtoId: number;
  produtoName: string;
  imageUrl?: string | null;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Pedido {
  id: number;
  clienteId: number;
  clienteName: string;
  clienteEmail: string;
  items: ItemPedido[];
  totalPrice: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}
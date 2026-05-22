export interface ItemPedido {
  id: number;
  produtoId: number;
  produtoName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Pedido {
  id: number;
  clienteId: number;
  clienteName: string;
  items: ItemPedido[];
  totalPrice: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}
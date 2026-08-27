export interface ItemPedido {
  id: number;
  produtoId: number;
  produtoName: string;
  imageUrl?: string | null;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface PedidoShippingAddress {
  zipCode: string | null;
  street: string | null;
  addressNumber: string | null;
  complement: string | null;
  neighborhood: string | null;
  city: string | null;
  state: string | null;
}

export interface PedidoShipping {
  serviceId: string | null;
  serviceName: string | null;
  companyName: string | null;
  deliveryTime: number | null;
  address: PedidoShippingAddress;
}

export interface Pedido {
  id: number;
  clienteId: number;
  clienteName: string;
  clienteEmail: string;

  items: ItemPedido[];

  totalPrice: number;
  shippingPrice: number;
  shipping: PedidoShipping;

  status: string;

  createdAt: string;
  updatedAt: string;
}
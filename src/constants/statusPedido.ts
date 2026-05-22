export const statusPedidoColors: Record<string, string> = {
  PENDENTE: 'bg-yellow-100 text-yellow-800',
  PAGO: 'bg-blue-100 text-blue-800',
  EM_PREPARACAO: 'bg-orange-100 text-orange-800',
  ENVIADO: 'bg-purple-100 text-purple-800',
  ENTREGUE: 'bg-green-100 text-green-800',
  CANCELADO: 'bg-red-100 text-red-800',
};

export const statusPedidoLabels: Record<string, string> = {
  PENDENTE: 'Pendente',
  PAGO: 'Pago',
  EM_PREPARACAO: 'Em preparação',
  ENVIADO: 'Enviado',
  ENTREGUE: 'Entregue',
  CANCELADO: 'Cancelado',
};

export const statusPedidoOptions = [
  { value: 'PENDENTE', label: 'Pendente' },
  { value: 'PAGO', label: 'Pago' },
  { value: 'EM_PREPARACAO', label: 'Em preparação' },
  { value: 'ENVIADO', label: 'Enviado' },
  { value: 'ENTREGUE', label: 'Entregue' },
  { value: 'CANCELADO', label: 'Cancelado' },
];
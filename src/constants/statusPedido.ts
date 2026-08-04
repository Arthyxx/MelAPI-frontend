export const statusPedidoColors: Record<string, string> = {
  PENDENTE: 'bg-yellow-100 text-yellow-800',
  PAGO: 'bg-blue-100 text-blue-800',
  CONFIRMADO: 'bg-cyan-100 text-cyan-800',
  PREPARANDO: 'bg-orange-100 text-orange-800',
  ENVIADO: 'bg-purple-100 text-purple-800',
  ENTREGUE: 'bg-green-100 text-green-800',
  CANCELADO: 'bg-red-100 text-red-800',
};

export const statusPedidoLabels: Record<string, string> = {
  PENDENTE: 'Pendente',
  PAGO: 'Pago',
  CONFIRMADO: 'Confirmado',
  PREPARANDO: 'Em preparação',
  ENVIADO: 'Enviado',
  ENTREGUE: 'Entregue',
  CANCELADO: 'Cancelado',
};

export const statusPedidoOptions = [
  { value: 'PENDENTE', label: 'Pendente' },
  { value: 'PAGO', label: 'Pago' },
  { value: 'CONFIRMADO', label: 'Confirmado' },
  { value: 'PREPARANDO', label: 'Em preparação' },
  { value: 'ENVIADO', label: 'Enviado' },
  { value: 'ENTREGUE', label: 'Entregue' },
  { value: 'CANCELADO', label: 'Cancelado' },
];
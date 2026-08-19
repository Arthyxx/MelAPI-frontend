export interface DashboardSummary {
  clientes: {
    ativos: number;
  };

  categorias: {
    ativas: number;
  };

  produtos: {
    ativos: number;
    semEstoque: number;
  };

  pedidos: {
    total: number;
    pendentes: number;
    entregues: number;
    cancelados: number;
  };

  faturamento: {
    total: number;
  };
}

export interface ApiErrorResponse {
  message?: string | string[];
  error?: string;
}
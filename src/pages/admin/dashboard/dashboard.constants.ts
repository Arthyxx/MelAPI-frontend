import type {
  DashboardSummary,
} from './dashboard.types';

export const initialDashboardSummary:
  DashboardSummary = {
    clientes: {
      ativos: 0,
    },

    categorias: {
      ativas: 0,
    },

    produtos: {
      ativos: 0,
      semEstoque: 0,
    },

    pedidos: {
      total: 0,
      pendentes: 0,
      entregues: 0,
      cancelados: 0,
    },

    faturamento: {
      total: 0,
    },
  };
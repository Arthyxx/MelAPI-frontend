import { api } from '../../../services/api';

import type {
  DashboardSummary,
} from './dashboard.types';

export async function fetchDashboardSummaryApi() {
  const response =
    await api.get<DashboardSummary>(
      '/dashboard/summary',
    );

  return response.data;
}
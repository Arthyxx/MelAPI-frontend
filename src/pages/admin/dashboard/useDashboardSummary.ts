import type {
  AxiosError,
} from 'axios';
import {
  useEffect,
  useState,
} from 'react';

import {
  fetchDashboardSummaryApi,
} from './dashboard.api';

import {
  initialDashboardSummary,
} from './dashboard.constants';

import type {
  ApiErrorResponse,
  DashboardSummary,
} from './dashboard.types';

import {
  getDashboardErrorMessage,
} from './dashboard.utils';

export function useDashboardSummary() {
  const [summary, setSummary] =
    useState<DashboardSummary>(
      initialDashboardSummary,
    );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        setError('');

        const data =
          await fetchDashboardSummaryApi();

        setSummary(data);
      } catch (requestError) {
        const axiosError =
          requestError as AxiosError<ApiErrorResponse>;

        console.error(
          'Erro ao carregar dashboard:',
          {
            statusCode:
              axiosError.response
                ?.status,
            data:
              axiosError.response
                ?.data,
            message:
              axiosError.message,
          },
        );

        setError(
          getDashboardErrorMessage(
            axiosError,
          ),
        );
      } finally {
        setLoading(false);
      }
    };

    void fetchSummary();
  }, []);

  return {
    summary,
    loading,
    error,
  };
}
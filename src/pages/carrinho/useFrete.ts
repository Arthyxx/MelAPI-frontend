import type {
  AxiosError,
} from 'axios';
import {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  useAuth,
} from '../../contexts/useAuth';
import {
  api,
} from '../../services/api';
import type {
  CartItem,
} from '../../utils/cart';

import {
  fetchPerfilApi,
} from '../perfil/perfil.api';

interface ApiErrorResponse {
  message?: string | string[];
  error?: string;
}

export interface FreteOption {
  serviceId: string;
  serviceName: string;
  companyName: string;
  companyPicture?: string;
  price: number;
  deliveryTime: number;
}

interface UseFreteOptions {
  items: CartItem[];
}

function formatZipCode(
  value: string,
) {
  const digits = value
    .replace(/\D/g, '')
    .slice(0, 8);

  if (digits.length <= 5) {
    return digits;
  }

  return `${digits.slice(
    0,
    5,
  )}-${digits.slice(5)}`;
}

function getApiErrorMessage(
  error: AxiosError<ApiErrorResponse>,
) {
  const message =
    error.response?.data?.message;

  if (Array.isArray(message)) {
    return message.join(' ');
  }

  return (
    message ||
    error.response?.data?.error ||
    'Não foi possível calcular o frete.'
  );
}

export function useFrete({
  items,
}: UseFreteOptions) {
  const {
    isAuthenticated,
  } = useAuth();

  const requestVersion =
    useRef(0);

  const [zipCode, setZipCode] =
    useState('');

  const [
    profileZipCode,
    setProfileZipCode,
  ] = useState('');

  const [options, setOptions] =
    useState<FreteOption[]>([]);

  const [
    selectedOption,
    setSelectedOption,
  ] = useState<FreteOption | null>(
    null,
  );

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    let active = true;

    const loadProfileZipCode =
      async () => {
        try {
          const perfil =
            await fetchPerfilApi();

          if (!active) {
            return;
          }

          if (!perfil.zipCode) {
            setProfileZipCode('');
            return;
          }

          const formattedZipCode =
            formatZipCode(
              perfil.zipCode,
            );

          setProfileZipCode(
            formattedZipCode,
          );

          setZipCode(
            formattedZipCode,
          );
        } catch {
          if (!active) {
            return;
          }

          setProfileZipCode('');

          // O cliente poderá informar
          // o CEP manualmente.
        }
      };

    void loadProfileZipCode();

    return () => {
      active = false;
    };
  }, [isAuthenticated]);

  const zipCodeReadOnly =
    isAuthenticated &&
    Boolean(profileZipCode);

  const invalidateFrete = () => {
    requestVersion.current += 1;

    setOptions([]);
    setSelectedOption(null);
    setError('');
    setLoading(false);
  };

  const handleZipCodeChange = (
    value: string,
  ) => {
    if (zipCodeReadOnly) {
      return;
    }

    setZipCode(
      formatZipCode(value),
    );

    invalidateFrete();
  };

  const calcularFrete =
    async () => {
      const normalizedZipCode =
        zipCode.replace(/\D/g, '');

      if (
        normalizedZipCode.length !==
        8
      ) {
        setError(
          'Informe um CEP válido com 8 números.',
        );

        return;
      }

      if (items.length === 0) {
        setError(
          'Adicione produtos ao carrinho antes de calcular o frete.',
        );

        return;
      }

      const currentRequestVersion =
        requestVersion.current + 1;

      requestVersion.current =
        currentRequestVersion;

      try {
        setLoading(true);
        setError('');
        setOptions([]);
        setSelectedOption(null);

        const response =
          await api.post<
            FreteOption[]
          >('/frete/calcular', {
            destinationZipCode:
              normalizedZipCode,

            items: items.map(
              (item) => ({
                productId:
                  item.id,

                quantity:
                  item.quantity,
              }),
            ),
          });

        if (
          requestVersion.current !==
          currentRequestVersion
        ) {
          return;
        }

        if (
          response.data.length === 0
        ) {
          setError(
            'Nenhuma opção de frete está disponível para este CEP.',
          );

          return;
        }

        setOptions(
          response.data,
        );
      } catch (requestError) {
        if (
          requestVersion.current !==
          currentRequestVersion
        ) {
          return;
        }

        const axiosError =
          requestError as AxiosError<ApiErrorResponse>;

        console.error(
          'Erro ao calcular frete:',
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
          getApiErrorMessage(
            axiosError,
          ),
        );
      } finally {
        if (
          requestVersion.current ===
          currentRequestVersion
        ) {
          setLoading(false);
        }
      }
    };

  const selectOption = (
    option: FreteOption,
  ) => {
    setSelectedOption(option);
    setError('');
  };

  return {
    zipCode,
    zipCodeReadOnly,

    options,
    selectedOption,
    loading,
    error,

    handleZipCodeChange,
    calcularFrete,
    selectOption,
    invalidateFrete,
  };
}
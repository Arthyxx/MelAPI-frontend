import {
  useRef,
  useState,
  type FormEvent,
} from 'react';
import { useNavigate } from 'react-router-dom';

import {
  CepLookupError,
  lookupCep,
} from '../../services/cep';

import {
  createCadastroApi,
} from './cadastro.api';

import {
  initialCadastroFormData,
} from './cadastro.constants';

import type {
  CadastroFormData,
} from './cadastro.types';

import {
  formatCadastroFieldValue,
  getCadastroApiErrorMessage,
  logCadastroApiError,
} from './cadastro.utils';

function normalizeZipCode(value: string) {
  return value.replace(/\D/g, '');
}

function isCancellationError(
  error: unknown,
) {
  return (
    error instanceof Error &&
    (
      error.name === 'CanceledError' ||
      error.name === 'AbortError'
    )
  );
}

export function useCadastroForm() {
  const navigate = useNavigate();

  const [formData, setFormData] =
    useState<CadastroFormData>(
      initialCadastroFormData,
    );

  const [erro, setErro] =
    useState('');

  const [sucesso, setSucesso] =
    useState('');

  const [loading, setLoading] =
    useState(false);

  const [loadingCep, setLoadingCep] =
    useState(false);

  const [cepError, setCepError] =
    useState('');

  const [cepMessage, setCepMessage] =
    useState('');

  const [
    notFoundZipCode,
    setNotFoundZipCode,
  ] = useState<string | null>(null);

  const cepAbortControllerRef =
    useRef<AbortController | null>(
      null,
    );

  const savingRef =
    useRef(false);

  const handleChange = (
    field: keyof CadastroFormData,
    value: string,
  ) => {
    const formattedValue =
      formatCadastroFieldValue(
        field,
        value,
      );

    if (field === 'zipCode') {
      cepAbortControllerRef.current?.abort();
      cepAbortControllerRef.current =
        null;

      setLoadingCep(false);
      setCepError('');
      setCepMessage('');
      setNotFoundZipCode(null);

      setFormData((prev) => ({
        ...prev,
        zipCode: formattedValue,
        street: '',
        neighborhood: '',
        city: '',
        state: '',
        addressNumber: '',
        complement: '',
      }));

      return;
    }

    setFormData((prev) => ({
      ...prev,
      [field]: formattedValue,
    }));
  };

  const handleLookupCep =
    async () => {
      const zipCode =
        normalizeZipCode(
          formData.zipCode,
        );

      setCepError('');
      setCepMessage('');

      if (!/^\d{8}$/.test(zipCode)) {
        setCepError(
          'Informe um CEP válido com 8 números.',
        );

        return;
      }

      cepAbortControllerRef.current?.abort();

      const controller =
        new AbortController();

      cepAbortControllerRef.current =
        controller;

      setLoadingCep(true);

      try {
        const address =
          await lookupCep(
            zipCode,
            controller.signal,
          );

        if (controller.signal.aborted) {
          return;
        }

        setFormData((prev) => {
          const currentZipCode =
            normalizeZipCode(
              prev.zipCode,
            );

          if (
            currentZipCode !==
            address.zipCode
          ) {
            return prev;
          }

          return {
            ...prev,
            zipCode:
              address.zipCode,
            street:
              address.street,
            neighborhood:
              address.neighborhood,
            city:
              address.city,
            state:
              address.state,
          };
        });

        setNotFoundZipCode(null);

        if (
          !address.street ||
          !address.neighborhood
        ) {
          setCepMessage(
            'CEP encontrado. Complete manualmente os campos de endereço que não foram retornados.',
          );
        } else {
          setCepMessage(
            'CEP encontrado com sucesso.',
          );
        }
      } catch (error: unknown) {
        if (
          isCancellationError(error)
        ) {
          return;
        }

        if (
          error instanceof
          CepLookupError
        ) {
          setCepError(error.message);

          if (
            error.code ===
            'NOT_FOUND'
          ) {
            setNotFoundZipCode(
              zipCode,
            );
          }

          return;
        }

        setCepError(
          'Não foi possível consultar o CEP agora. Preencha o endereço manualmente.',
        );
      } finally {
        if (
          cepAbortControllerRef.current ===
          controller
        ) {
          cepAbortControllerRef.current =
            null;

          setLoadingCep(false);
        }
      }
    };

  const handleSubmit = async (
    event:
      FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (
      loadingCep ||
      savingRef.current
    ) {
      return;
    }

    const zipCode =
      normalizeZipCode(
        formData.zipCode,
      );

    if (!/^\d{8}$/.test(zipCode)) {
      setErro(
        'Informe um CEP válido com 8 números.',
      );

      return;
    }

    if (
      notFoundZipCode === zipCode
    ) {
      setErro(
        'CEP não encontrado. Confira os números informados.',
      );

      return;
    }

    try {
      setErro('');
      setSucesso('');
      setLoading(true);
      savingRef.current = true;

      await createCadastroApi(
        formData,
      );

      setSucesso(
        'Cadastro realizado com sucesso! Redirecionando para o login...',
      );

      window.setTimeout(() => {
        navigate('/login');
      }, 1400);
    } catch (err: unknown) {
      logCadastroApiError(err);

      setErro(
        getCadastroApiErrorMessage(
          err,
        ),
      );
    } finally {
      setLoading(false);
      savingRef.current = false;
    }
  };

  return {
    formData,
    erro,
    sucesso,
    loading,
    loadingCep,
    cepError,
    cepMessage,

    handleChange,
    handleLookupCep,
    handleSubmit,
  };
}

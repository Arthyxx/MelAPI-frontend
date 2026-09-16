import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from 'react';

import {
  CepLookupError,
  lookupCep,
} from '../../services/cep';

import {
  fetchPerfilApi,
  updatePerfilApi,
} from './perfil.api';

import {
  initialPerfilFormData,
} from './perfil.constants';

import type {
  PerfilFormData,
} from './perfil.types';

import {
  formatPerfilFieldValue,
  getPerfilApiErrorMessage,
  logPerfilApiError,
  normalizePerfilData,
} from './perfil.utils';

export function usePerfilForm() {
  const [formData, setFormData] = useState<PerfilFormData>(
    initialPerfilFormData,
  );

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [loadingCep, setLoadingCep] = useState(false);
  const [cepError, setCepError] = useState('');
  const [cepMessage, setCepMessage] = useState('');
  const [invalidCep, setInvalidCep] = useState<string | null>(null);

  const cepRequestRef = useRef<AbortController | null>(null);
  const savingRef = useRef(false);

  useEffect(() => {
    let active = true;

    const fetchPerfil = async () => {
      try {
        const data = await fetchPerfilApi();

        if (active) {
          setFormData(normalizePerfilData(data));
        }
      } catch (err: unknown) {
        if (!active) {
          return;
        }

        logPerfilApiError('Erro ao carregar perfil:', err);

        setError(
          getPerfilApiErrorMessage(
            err,
            'Erro ao carregar dados do perfil.',
          ),
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void fetchPerfil();

    return () => {
      active = false;
      cepRequestRef.current?.abort();
      cepRequestRef.current = null;
    };
  }, []);

  const handleChange = (
    field: keyof PerfilFormData,
    value: string,
  ) => {
    if (savingRef.current) {
      return;
    }

    const formattedValue = formatPerfilFieldValue(field, value);

    setError('');
    setSuccess('');

    if (field === 'zipCode') {
      if (formattedValue === formData.zipCode) {
        return;
      }

      cepRequestRef.current?.abort();
      cepRequestRef.current = null;

      setLoadingCep(false);
      setCepError('');
      setCepMessage('');
      setInvalidCep(null);

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

  const handleLookupCep = async () => {
    if (savingRef.current || loading) {
      return;
    }

    cepRequestRef.current?.abort();
    cepRequestRef.current = null;

    setLoadingCep(false);
    setCepError('');
    setCepMessage('');
    setError('');
    setSuccess('');

    const zipCode = formData.zipCode.replace(/\D/g, '');

    if (!/^\d{8}$/.test(zipCode)) {
      setCepError('Informe um CEP válido com 8 números.');
      return;
    }

    const controller = new AbortController();
    cepRequestRef.current = controller;
    setLoadingCep(true);

    try {
      const address = await lookupCep(
        zipCode,
        controller.signal,
      );

      if (controller.signal.aborted) {
        return;
      }

      setFormData((prev) => {
        if (
          controller.signal.aborted ||
          prev.zipCode.replace(/\D/g, '') !== zipCode
        ) {
          return prev;
        }

        return {
          ...prev,
          zipCode: address.zipCode,
          street: address.street,
          neighborhood: address.neighborhood,
          city: address.city,
          state: address.state,
        };
      });

      setInvalidCep(null);

      setCepMessage(
        address.street && address.neighborhood
          ? 'Endereço encontrado. Confira os dados e informe o número e o complemento, se houver.'
          : 'CEP encontrado. Complete os campos de rua e bairro que estiverem vazios e informe o número.',
      );
    } catch (err: unknown) {
      if (controller.signal.aborted) {
        return;
      }

      if (err instanceof CepLookupError) {
        setCepError(err.message);

        if (err.code === 'NOT_FOUND') {
          setInvalidCep(zipCode);
        }

        if (err.code === 'UNAVAILABLE') {
          setCepMessage(
            'Você pode tentar novamente ou preencher o endereço manualmente.',
          );
        }
      } else {
        setCepError('Não foi possível consultar o CEP. Tente novamente.');
      }
    } finally {
      if (cepRequestRef.current === controller) {
        cepRequestRef.current = null;
        setLoadingCep(false);
      }
    }
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (savingRef.current || loading) {
      return;
    }

    setError('');
    setSuccess('');

    if (cepRequestRef.current) {
      setError('Aguarde a consulta do CEP terminar antes de salvar.');
      return;
    }

    const zipCode = formData.zipCode.replace(/\D/g, '');

    if (zipCode && !/^\d{8}$/.test(zipCode)) {
      setCepError('Informe um CEP válido com 8 números.');
      setError('Confira o CEP antes de salvar o perfil.');
      return;
    }

    if (invalidCep !== null && invalidCep === zipCode) {
      setError('O CEP informado não foi encontrado. Corrija ou consulte novamente.');
      return;
    }

    try {
      savingRef.current = true;
      setSaving(true);

      const payload = {
        name: formData.name,
        phone: formData.phone,
        street: formData.street,
        addressNumber: formData.addressNumber,
        complement: formData.complement,
        neighborhood: formData.neighborhood,
        city: formData.city,
        state: formData.state,
        zipCode,
      };

      const data = await updatePerfilApi(payload);

      setFormData((prev) =>
        normalizePerfilData({
          ...prev,
          ...data,
        }),
      );

      setSuccess('Perfil atualizado com sucesso!');
    } catch (err: unknown) {
      logPerfilApiError('Erro ao atualizar perfil:', err);

      setError(
        getPerfilApiErrorMessage(
          err,
          'Erro ao atualizar perfil. Verifique os dados e tente novamente.',
        ),
      );
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  };

  return {
    formData,
    loading,
    saving,
    error,
    success,
    loadingCep,
    cepError,
    cepMessage,
    handleChange,
    handleLookupCep,
    handleSubmit,
  };
}
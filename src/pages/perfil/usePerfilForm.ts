import {
  useEffect,
  useState,
  type FormEvent,
} from 'react';

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
  const [formData, setFormData] =
    useState<PerfilFormData>(
      initialPerfilFormData,
    );

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState('');

  const [success, setSuccess] =
    useState('');

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        setError('');
        setLoading(true);

        const data =
          await fetchPerfilApi();

        setFormData(
          normalizePerfilData(data),
        );
      } catch (err: unknown) {
        logPerfilApiError(
          'Erro ao carregar perfil:',
          err,
        );

        setError(
          getPerfilApiErrorMessage(
            err,
            'Erro ao carregar dados do perfil.',
          ),
        );
      } finally {
        setLoading(false);
      }
    };

    void fetchPerfil();
  }, []);

  const handleChange = (
    field: keyof PerfilFormData,
    value: string,
  ) => {
    const formattedValue =
      formatPerfilFieldValue(
        field,
        value,
      );

    setFormData((prev) => ({
      ...prev,
      [field]: formattedValue,
    }));
  };

  const handleSubmit = async (
    event:
      FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    try {
      setError('');
      setSuccess('');
      setSaving(true);

      const payload = {
        name: formData.name,
        phone: formData.phone,
        street: formData.street,
        addressNumber:
          formData.addressNumber,
        complement:
          formData.complement,
        neighborhood:
          formData.neighborhood,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
      };

      const data =
        await updatePerfilApi(
          payload,
        );

      setFormData((prev) =>
        normalizePerfilData({
          ...prev,
          ...data,
        }),
      );

      setSuccess(
        'Perfil atualizado com sucesso!',
      );
    } catch (err: unknown) {
      logPerfilApiError(
        'Erro ao atualizar perfil:',
        err,
      );

      setError(
        getPerfilApiErrorMessage(
          err,
          'Erro ao atualizar perfil. Verifique os dados e tente novamente.',
        ),
      );
    } finally {
      setSaving(false);
    }
  };

  return {
    formData,
    loading,
    saving,
    error,
    success,

    handleChange,
    handleSubmit,
  };
}
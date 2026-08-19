import type { AxiosError } from 'axios';
import {
  useState,
  type FormEvent,
} from 'react';

import {
  createCategoriaApi,
  createCategoriaPayload,
  updateCategoriaApi,
} from './categoria.api';

import {
  initialFormData,
} from './categoria.constants';

import type {
  ApiErrorResponse,
  Categoria,
  CategoriaFormData,
} from './categoria.types';

import {
  getErrorMessage,
} from './categoria.utils';

interface UseCategoriaFormOptions {
  onCreated: () => Promise<void>;
  onUpdated: () => Promise<void>;
}

export function useCategoriaForm({
  onCreated,
  onUpdated,
}: UseCategoriaFormOptions) {
  const [editingId, setEditingId] =
    useState<number | null>(null);

  const [formData, setFormData] =
    useState<CategoriaFormData>(
      initialFormData,
    );

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState('');

  const [success, setSuccess] =
    useState('');

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData(initialFormData);
  };

  const handleFieldChange = (
    field: keyof CategoriaFormData,
    value: string | boolean,
  ) => {
    setFormData(
      (currentFormData) =>
        ({
          ...currentFormData,
          [field]: value,
        }) as CategoriaFormData,
    );
  };

  const handleSubmit = async (
    event:
      FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    try {
      clearMessages();
      setSaving(true);

      const payload =
        createCategoriaPayload(
          formData,
        );

      if (editingId !== null) {
        await updateCategoriaApi(
          editingId,
          payload,
        );

        setSuccess(
          'Categoria atualizada com sucesso.',
        );

        resetForm();

        await onUpdated();

        return;
      }

      await createCategoriaApi(
        payload,
      );

      setSuccess(
        'Categoria criada com sucesso.',
      );

      resetForm();

      await onCreated();
    } catch (requestError) {
      const axiosError =
        requestError as AxiosError<ApiErrorResponse>;

      console.error(
        'Erro ao salvar categoria:',
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
        getErrorMessage(
          axiosError,
          'Erro ao salvar categoria.',
        ),
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (
    categoria: Categoria,
  ) => {
    clearMessages();

    setEditingId(
      categoria.id,
    );

    setFormData({
      name:
        categoria.name,

      description:
        categoria.description || '',

      active:
        categoria.active,
    });

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleCancelEdit = () => {
    clearMessages();
    resetForm();
  };

  return {
    editingId,
    formData,
    saving,

    error,
    success,

    handleFieldChange,
    handleSubmit,
    handleEdit,
    handleCancelEdit,
  };
}
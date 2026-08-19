import type { AxiosError } from 'axios';
import {
  useState,
  type FormEvent,
} from 'react';

import {
  createClienteApi,
  createClientePayload,
  createUpdateClientePayload,
  updateClienteApi,
} from './cliente.api';

import {
  initialFormData,
} from './cliente.constants';

import type {
  ApiErrorResponse,
  Cliente,
  ClienteFormData,
} from './cliente.types';

import {
  getErrorMessage,
} from './cliente.utils';

interface UseClienteFormOptions {
  onSaved: () => Promise<void>;
}

export function useClienteForm({
  onSaved,
}: UseClienteFormOptions) {
  const [editingId, setEditingId] =
    useState<number | null>(null);

  const [formData, setFormData] =
    useState<ClienteFormData>(
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
    field: keyof ClienteFormData,
    value: string | boolean,
  ) => {
    setFormData(
      (currentFormData) =>
        ({
          ...currentFormData,
          [field]: value,
        }) as ClienteFormData,
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

      if (editingId !== null) {
        await updateClienteApi(
          editingId,
          createUpdateClientePayload(
            formData,
          ),
        );

        setSuccess(
          'Cliente atualizado com sucesso.',
        );
      } else {
        await createClienteApi(
          createClientePayload(
            formData,
          ),
        );

        setSuccess(
          'Cliente criado com sucesso.',
        );
      }

      resetForm();

      await onSaved();
    } catch (requestError) {
      const axiosError =
        requestError as AxiosError<ApiErrorResponse>;

      console.error(
        'Erro ao salvar cliente:',
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
          'Erro ao salvar cliente.',
        ),
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (
    cliente: Cliente,
  ) => {
    clearMessages();

    setEditingId(cliente.id);

    setFormData({
      name: cliente.name,
      email: cliente.email,
      password: '',
      role: cliente.role,
      active: cliente.active,
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
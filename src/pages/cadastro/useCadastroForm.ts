import {
  useState,
  type FormEvent,
} from 'react';
import { useNavigate } from 'react-router-dom';

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

  const handleChange = (
    field: keyof CadastroFormData,
    value: string,
  ) => {
    const formattedValue =
      formatCadastroFieldValue(
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
      setErro('');
      setSucesso('');
      setLoading(true);

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
    }
  };

  return {
    formData,
    erro,
    sucesso,
    loading,

    handleChange,
    handleSubmit,
  };
}
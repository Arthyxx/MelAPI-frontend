import {
  useEffect,
  useState,
  type FormEvent,
} from 'react';
import { isAxiosError } from 'axios';
import { Link } from 'react-router-dom';

import { api } from '../services/api';

interface PerfilFormData {
  id?: number;
  name: string;
  email: string;
  phone: string;
  street: string;
  addressNumber: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  role?: string;
}

interface ApiErrorResponse {
  message?: string | string[];
  error?: string;
}

function getApiErrorMessage(
  error: unknown,
  fallback: string,
) {
  if (
    !isAxiosError<ApiErrorResponse>(
      error,
    )
  ) {
    return fallback;
  }

  const message =
    error.response?.data?.message;

  if (Array.isArray(message)) {
    return message.join(' ');
  }

  if (typeof message === 'string') {
    return message;
  }

  const apiError =
    error.response?.data?.error;

  if (typeof apiError === 'string') {
    return apiError;
  }

  return fallback;
}

function logApiError(
  title: string,
  error: unknown,
) {
  if (
    isAxiosError<ApiErrorResponse>(
      error,
    )
  ) {
    console.error(title, {
      statusCode:
        error.response?.status,
      data: error.response?.data,
      message: error.message,
    });

    return;
  }

  console.error(title, {
    message:
      error instanceof Error
        ? error.message
        : 'Erro desconhecido.',
  });
}

export function Perfil() {
  const [formData, setFormData] =
    useState<PerfilFormData>({
      name: '',
      email: '',
      phone: '',
      street: '',
      addressNumber: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      zipCode: '',
    });

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState('');

  const [success, setSuccess] =
    useState('');

  useEffect(() => {
    const fetchPerfil =
      async () => {
        try {
          setError('');
          setLoading(true);

          const response =
            await api.get<PerfilFormData>(
              '/clientes/me',
            );

          setFormData({
            id: response.data.id,
            name:
              response.data.name ||
              '',
            email:
              response.data.email ||
              '',
            phone:
              response.data.phone ||
              '',
            street:
              response.data.street ||
              '',
            addressNumber:
              response.data
                .addressNumber || '',
            complement:
              response.data
                .complement || '',
            neighborhood:
              response.data
                .neighborhood || '',
            city:
              response.data.city ||
              '',
            state:
              response.data.state ||
              '',
            zipCode:
              response.data.zipCode ||
              '',
            role:
              response.data.role,
          });
        } catch (err: unknown) {
          logApiError(
            'Erro ao carregar perfil:',
            err,
          );

          setError(
            getApiErrorMessage(
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
    let formattedValue = value;

    if (field === 'phone') {
      formattedValue = value
        .replace(/\D/g, '')
        .slice(0, 11);
    }

    if (field === 'zipCode') {
      formattedValue = value
        .replace(/\D/g, '')
        .slice(0, 8);
    }

    if (field === 'state') {
      formattedValue = value
        .toUpperCase()
        .replace(/[^A-Z]/g, '')
        .slice(0, 2);
    }

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

      const response =
        await api.patch<PerfilFormData>(
          '/clientes/me',
          payload,
        );

      setFormData((prev) => ({
        ...prev,
        ...response.data,
        phone:
          response.data.phone || '',
        street:
          response.data.street || '',
        addressNumber:
          response.data
            .addressNumber || '',
        complement:
          response.data
            .complement || '',
        neighborhood:
          response.data
            .neighborhood || '',
        city:
          response.data.city || '',
        state:
          response.data.state || '',
        zipCode:
          response.data.zipCode || '',
      }));

      setSuccess(
        'Perfil atualizado com sucesso!',
      );
    } catch (err: unknown) {
      logApiError(
        'Erro ao atualizar perfil:',
        err,
      );

      setError(
        getApiErrorMessage(
          err,
          'Erro ao atualizar perfil. Verifique os dados e tente novamente.',
        ),
      );
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    'w-full rounded-2xl border border-amber-200 bg-white/90 px-4 py-3 text-gray-900 shadow-sm outline-none transition duration-300 placeholder:text-gray-400 focus:border-amber-500 focus:ring-4 focus:ring-amber-200 dark:border-amber-800 dark:bg-gray-950/80 dark:text-white dark:focus:ring-amber-900';

  const disabledInputClass =
    'w-full cursor-not-allowed rounded-2xl border border-gray-200 bg-gray-100 px-4 py-3 text-gray-500 shadow-sm outline-none dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400';

  const labelClass =
    'mb-2 block text-sm font-bold text-amber-900 dark:text-amber-300';

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100 dark:from-gray-950 dark:via-gray-900 dark:to-amber-950">
        <div className="text-center">
          <div className="mb-4 text-7xl animate-bounce-soft">
            👤
          </div>

          <p className="text-xl font-semibold text-amber-700 dark:text-amber-300">
            Carregando perfil...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100 px-4 py-10 dark:from-gray-950 dark:via-gray-900 dark:to-amber-950">
      <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-amber-300/30 blur-3xl animate-pulse-gentle" />

      <div className="absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-yellow-400/30 blur-3xl animate-pulse-gentle" />

      <div className="absolute left-1/2 top-1/3 h-48 w-48 rounded-full bg-orange-300/20 blur-3xl animate-spin-slow" />

      <main className="relative z-10 mx-auto max-w-5xl">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              to="/produtos"
              className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-bold text-amber-800 shadow-sm transition hover:bg-white dark:bg-gray-900 dark:text-amber-300"
            >
              <span>←</span>
              Voltar para loja
            </Link>

            <h1 className="mt-5 text-4xl font-black text-amber-950 dark:text-amber-300">
              Meu perfil
            </h1>

            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Atualize seus dados
              pessoais e endereço de
              entrega.
            </p>
          </div>

          <div className="flex h-20 w-20 items-center justify-center rounded-[2rem] bg-gradient-to-br from-amber-600 to-yellow-500 text-5xl text-white shadow-2xl">
            👤
          </div>
        </header>

        <section className="overflow-hidden rounded-[2rem] border border-amber-200 bg-white/85 shadow-2xl backdrop-blur-xl dark:border-amber-800 dark:bg-gray-900/90">
          <div className="bg-gradient-to-r from-amber-700 via-yellow-600 to-amber-700 px-6 py-8 text-white sm:px-10">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-wider text-amber-100">
                  Dados da conta
                </p>

                <h2 className="text-3xl font-black">
                  Informações do cliente
                </h2>

                <p className="mt-2 text-sm text-amber-50">
                  Esses dados ajudam no
                  contato e na entrega
                  dos produtos.
                </p>
              </div>

              {formData.role && (
                <span className="w-fit rounded-full bg-white/15 px-4 py-2 text-sm font-black text-white">
                  {formData.role}
                </span>
              )}
            </div>
          </div>

          <div className="p-6 sm:p-10">
            {error && (
              <div className="mb-6 animate-fade-in rounded-2xl border border-red-300 bg-red-50 px-5 py-4 text-sm font-medium text-red-700 shadow-sm dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-6 animate-fade-in rounded-2xl border border-green-300 bg-green-50 px-5 py-4 text-sm font-medium text-green-700 shadow-sm dark:border-green-900 dark:bg-green-950/40 dark:text-green-300">
                {success}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-8"
            >
              <section className="animate-fade-in-up">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 text-xl">
                    👤
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-amber-900 dark:text-amber-300">
                      Dados pessoais
                    </h3>

                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Nome, e-mail e
                      telefone de
                      contato.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label
                      className={
                        labelClass
                      }
                    >
                      Nome completo
                    </label>

                    <input
                      type="text"
                      value={
                        formData.name
                      }
                      onChange={(e) =>
                        handleChange(
                          'name',
                          e.target.value,
                        )
                      }
                      className={
                        inputClass
                      }
                      required
                    />
                  </div>

                  <div>
                    <label
                      className={
                        labelClass
                      }
                    >
                      E-mail
                    </label>

                    <input
                      type="email"
                      value={
                        formData.email
                      }
                      className={
                        disabledInputClass
                      }
                      disabled
                    />

                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      O e-mail não pode
                      ser alterado por
                      aqui.
                    </p>
                  </div>

                  <div className="md:col-span-2">
                    <label
                      className={
                        labelClass
                      }
                    >
                      Telefone
                    </label>

                    <input
                      type="tel"
                      placeholder="85999999999"
                      value={
                        formData.phone
                      }
                      onChange={(e) =>
                        handleChange(
                          'phone',
                          e.target.value,
                        )
                      }
                      className={
                        inputClass
                      }
                    />
                  </div>
                </div>
              </section>

              <section className="animate-fade-in-up delay-100">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 text-xl">
                    🏠
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-amber-900 dark:text-amber-300">
                      Endereço de entrega
                    </h3>

                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Usado para
                      facilitar a
                      entrega dos
                      pedidos.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label
                      className={
                        labelClass
                      }
                    >
                      CEP
                    </label>

                    <input
                      type="text"
                      placeholder="60000000"
                      value={
                        formData.zipCode
                      }
                      onChange={(e) =>
                        handleChange(
                          'zipCode',
                          e.target.value,
                        )
                      }
                      className={
                        inputClass
                      }
                    />
                  </div>

                  <div>
                    <label
                      className={
                        labelClass
                      }
                    >
                      Estado
                    </label>

                    <input
                      type="text"
                      placeholder="CE"
                      value={
                        formData.state
                      }
                      onChange={(e) =>
                        handleChange(
                          'state',
                          e.target.value,
                        )
                      }
                      className={
                        inputClass
                      }
                    />
                  </div>

                  <div>
                    <label
                      className={
                        labelClass
                      }
                    >
                      Cidade
                    </label>

                    <input
                      type="text"
                      placeholder="Fortaleza"
                      value={
                        formData.city
                      }
                      onChange={(e) =>
                        handleChange(
                          'city',
                          e.target.value,
                        )
                      }
                      className={
                        inputClass
                      }
                    />
                  </div>

                  <div>
                    <label
                      className={
                        labelClass
                      }
                    >
                      Bairro
                    </label>

                    <input
                      type="text"
                      placeholder="Centro"
                      value={
                        formData.neighborhood
                      }
                      onChange={(e) =>
                        handleChange(
                          'neighborhood',
                          e.target.value,
                        )
                      }
                      className={
                        inputClass
                      }
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label
                      className={
                        labelClass
                      }
                    >
                      Rua
                    </label>

                    <input
                      type="text"
                      placeholder="Rua das Flores"
                      value={
                        formData.street
                      }
                      onChange={(e) =>
                        handleChange(
                          'street',
                          e.target.value,
                        )
                      }
                      className={
                        inputClass
                      }
                    />
                  </div>

                  <div>
                    <label
                      className={
                        labelClass
                      }
                    >
                      Número
                    </label>

                    <input
                      type="text"
                      placeholder="123"
                      value={
                        formData
                          .addressNumber
                      }
                      onChange={(e) =>
                        handleChange(
                          'addressNumber',
                          e.target.value,
                        )
                      }
                      className={
                        inputClass
                      }
                    />
                  </div>

                  <div>
                    <label
                      className={
                        labelClass
                      }
                    >
                      Complemento
                    </label>

                    <input
                      type="text"
                      placeholder="Apartamento, bloco, referência..."
                      value={
                        formData.complement
                      }
                      onChange={(e) =>
                        handleChange(
                          'complement',
                          e.target.value,
                        )
                      }
                      className={
                        inputClass
                      }
                    />
                  </div>
                </div>
              </section>

              <div className="animate-fade-in-up delay-200 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Revise os dados antes
                  de salvar. Entrega
                  errada por endereço
                  errado é uma tragédia
                  logística
                  perfeitamente
                  evitável.
                </p>

                <button
                  type="submit"
                  disabled={saving}
                  className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 px-8 py-4 font-black text-white shadow-xl transition duration-300 hover:-translate-y-1 hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <span className="absolute inset-0 translate-x-[-100%] bg-white/20 transition duration-700 group-hover:translate-x-[100%]" />

                  <span className="relative flex items-center justify-center gap-2">
                    {saving ? (
                      <>
                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        Salvar alterações

                        <span className="transition group-hover:translate-x-1">
                          →
                        </span>
                      </>
                    )}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}
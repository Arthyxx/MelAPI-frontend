import { useState, type FormEvent } from 'react';
import type { AxiosError } from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';
import { login } from '../services/api';

interface LoginResponse {
  token: string;
}

interface ApiErrorResponse {
  message?: string | string[];
  error?: string;
}

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { signIn } = useAuth();

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    try {
      setErro('');
      setLoading(true);

      const response = (await login(
        email.trim().toLowerCase(),
        password,
      )) as LoginResponse;

      signIn(response.token);

      navigate('/produtos', {
        replace: true,
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const apiMessage = axiosError.response?.data?.message;

      console.error('Erro ao fazer login:', {
        statusCode: axiosError.response?.status,
        data: axiosError.response?.data,
        message: axiosError.message,
      });

      if (Array.isArray(apiMessage)) {
        setErro(apiMessage.join(' '));
        return;
      }

      setErro(
        apiMessage ||
          axiosError.response?.data?.error ||
          'E-mail ou senha inválidos.',
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full rounded-2xl border border-amber-200 bg-white/90 px-4 py-3 text-gray-900 shadow-sm outline-none transition duration-300 placeholder:text-gray-400 focus:border-amber-500 focus:ring-4 focus:ring-amber-200 dark:border-amber-800 dark:bg-gray-950/80 dark:text-white dark:focus:ring-amber-900';

  const labelClass =
    'mb-2 block text-sm font-bold text-amber-900 dark:text-amber-300';

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100 px-4 py-10 dark:from-gray-950 dark:via-gray-900 dark:to-amber-950">
      <div className="absolute -left-24 top-10 h-72 w-72 animate-pulse-gentle rounded-full bg-amber-300/30 blur-3xl" />

      <div className="absolute -right-24 bottom-10 h-80 w-80 animate-pulse-gentle rounded-full bg-yellow-400/30 blur-3xl" />

      <div className="absolute left-1/2 top-1/3 h-48 w-48 animate-spin-slow rounded-full bg-orange-300/20 blur-3xl" />

      <main className="relative z-10 mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="hidden animate-fade-in-up lg:block">
          <div className="rounded-[2rem] border border-amber-200 bg-white/60 p-8 shadow-2xl backdrop-blur-xl dark:border-amber-900 dark:bg-gray-900/60">
            <div className="mb-8 inline-flex rounded-full bg-amber-100 px-4 py-2 text-sm font-bold text-amber-800">
              🍯 Apiário Vitória Seven
            </div>

            <h1 className="text-5xl font-black leading-tight text-amber-950 dark:text-amber-300">
              Entre na sua conta e acompanhe seus pedidos.
            </h1>

            <p className="mt-5 text-lg text-gray-600 dark:text-gray-300">
              Acesse sua conta para comprar produtos naturais,
              acompanhar pedidos e visualizar detalhes das suas
              compras.
            </p>

            <div className="mt-8 grid gap-4">
              <div className="rounded-3xl border border-amber-100 bg-white/80 p-5 shadow-md transition hover:-translate-y-1 hover:shadow-xl dark:border-amber-900 dark:bg-gray-950/70">
                <div className="text-3xl">📦</div>

                <h3 className="mt-3 font-extrabold text-amber-900 dark:text-amber-300">
                  Histórico de pedidos
                </h3>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Consulte status, produtos comprados e detalhes de
                  cada pedido.
                </p>
              </div>

              <div className="rounded-3xl border border-amber-100 bg-white/80 p-5 shadow-md transition hover:-translate-y-1 hover:shadow-xl dark:border-amber-900 dark:bg-gray-950/70">
                <div className="text-3xl">🛒</div>

                <h3 className="mt-3 font-extrabold text-amber-900 dark:text-amber-300">
                  Compra simples
                </h3>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Adicione produtos ao carrinho e finalize seus pedidos
                  com facilidade.
                </p>
              </div>

              <div className="rounded-3xl border border-amber-100 bg-white/80 p-5 shadow-md transition hover:-translate-y-1 hover:shadow-xl dark:border-amber-900 dark:bg-gray-950/70">
                <div className="text-3xl">🐝</div>

                <h3 className="mt-3 font-extrabold text-amber-900 dark:text-amber-300">
                  Produtos naturais
                </h3>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Mel, própolis e produtos artesanais disponíveis na
                  loja.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="animate-fade-in-up">
          <div className="overflow-hidden rounded-[2rem] border border-amber-200 bg-white/85 shadow-2xl backdrop-blur-xl dark:border-amber-800 dark:bg-gray-900/90">
            <div className="bg-gradient-to-r from-amber-700 via-yellow-600 to-amber-700 px-6 py-8 text-white sm:px-10">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 animate-bounce-soft items-center justify-center rounded-3xl bg-white/15 text-4xl shadow-inner">
                  🐝
                </div>

                <div>
                  <p className="text-sm font-bold uppercase tracking-wider text-amber-100">
                    Bem-vindo de volta
                  </p>

                  <h2 className="text-3xl font-black">
                    Acesse sua conta
                  </h2>
                </div>
              </div>

              <p className="mt-4 max-w-2xl text-sm text-amber-50">
                Faça login para continuar comprando, acompanhar pedidos
                e gerenciar sua experiência na loja.
              </p>
            </div>

            <div className="p-6 sm:p-10">
              {erro && (
                <div className="mb-6 animate-fade-in rounded-2xl border border-red-300 bg-red-50 px-5 py-4 text-sm font-medium text-red-700 shadow-sm dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
                  {erro}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="animate-fade-in-up delay-100">
                  <label htmlFor="email" className={labelClass}>
                    E-mail
                  </label>

                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg">
                      ✉️
                    </span>

                    <input
                      id="email"
                      type="email"
                      placeholder="seuemail@email.com"
                      value={email}
                      onChange={(event) =>
                        setEmail(event.target.value)
                      }
                      className={`${inputClass} pl-12`}
                      autoComplete="email"
                      required
                    />
                  </div>
                </div>

                <div className="animate-fade-in-up delay-200">
                  <label htmlFor="password" className={labelClass}>
                    Senha
                  </label>

                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg">
                      🔒
                    </span>

                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Digite sua senha"
                      value={password}
                      onChange={(event) =>
                        setPassword(event.target.value)
                      }
                      className={`${inputClass} px-12`}
                      autoComplete="current-password"
                      required
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (previousValue) => !previousValue,
                        )
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-amber-700 transition hover:text-amber-900 dark:text-amber-300"
                    >
                      {showPassword ? 'Ocultar' : 'Ver'}
                    </button>
                  </div>
                </div>

                <div className="flex animate-fade-in-up flex-col gap-3 delay-300 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Use seus dados cadastrados para entrar.
                  </p>

                  <Link
                    to="/cadastro"
                    className="text-sm font-bold text-amber-700 transition hover:text-amber-900 dark:text-amber-300"
                  >
                    Criar conta
                  </Link>
                </div>

                <div className="animate-fade-in-up space-y-4 delay-400">
                  <button
                    type="submit"
                    disabled={loading}
                    className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 px-6 py-4 font-black text-white shadow-xl transition duration-300 hover:-translate-y-1 hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    <span className="absolute inset-0 translate-x-[-100%] bg-white/20 transition duration-700 group-hover:translate-x-[100%]" />

                    <span className="relative flex items-center justify-center gap-2">
                      {loading ? (
                        <>
                          <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Entrando...
                        </>
                      ) : (
                        <>
                          Entrar na loja
                          <span className="transition group-hover:translate-x-1">
                            →
                          </span>
                        </>
                      )}
                    </span>
                  </button>

                  <Link
                    to="/produtos"
                    className="block rounded-2xl border border-amber-200 px-4 py-3 text-center text-sm font-bold text-amber-800 transition hover:bg-amber-50 dark:border-amber-800 dark:text-amber-300 dark:hover:bg-gray-800"
                  >
                    Ver produtos sem entrar
                  </Link>
                </div>
              </form>

              <div className="mt-8 grid grid-cols-3 gap-2 text-center text-xs text-gray-500 dark:text-gray-400">
                <div className="rounded-2xl bg-gray-50 p-3 dark:bg-gray-800">
                  <div className="text-lg">🍯</div>
                  Mel puro
                </div>

                <div className="rounded-2xl bg-gray-50 p-3 dark:bg-gray-800">
                  <div className="text-lg">📦</div>
                  Pedidos
                </div>

                <div className="rounded-2xl bg-gray-50 p-3 dark:bg-gray-800">
                  <div className="text-lg">🛒</div>
                  Carrinho
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

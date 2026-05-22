import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';

interface CadastroFormData {
  name: string;
  email: string;
  password: string;
  phone: string;
  street: string;
  addressNumber: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export function Cadastro() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<CadastroFormData>({
    name: '',
    email: '',
    password: '',
    phone: '',
    street: '',
    addressNumber: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: '',
  });

  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof CadastroFormData, value: string) => {
    let formattedValue = value;

    if (field === 'phone') {
      formattedValue = value.replace(/\D/g, '').slice(0, 11);
    }

    if (field === 'zipCode') {
      formattedValue = value.replace(/\D/g, '').slice(0, 8);
    }

    if (field === 'state') {
      formattedValue = value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 2);
    }

    setFormData((prev) => ({
      ...prev,
      [field]: formattedValue,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setErro('');
      setSucesso('');
      setLoading(true);

      await api.post('/clientes', formData);

      setSucesso('Cadastro realizado com sucesso! Redirecionando para o login...');

      setTimeout(() => {
        navigate('/login');
      }, 1400);
    } catch (err: any) {
      console.error('Erro ao realizar cadastro:', {
        statusCode: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });

      setErro(
        err.response?.data?.message ||
          err.response?.data?.error ||
          'Erro ao realizar cadastro. Verifique os dados e tente novamente.'
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
      <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-amber-300/30 blur-3xl animate-pulse-gentle" />
      <div className="absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-yellow-400/30 blur-3xl animate-pulse-gentle" />
      <div className="absolute left-1/2 top-1/3 h-48 w-48 rounded-full bg-orange-300/20 blur-3xl animate-spin-slow" />

      <main className="relative z-10 mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        <section className="hidden animate-fade-in-up lg:block">
          <div className="rounded-[2rem] border border-amber-200 bg-white/60 p-8 shadow-2xl backdrop-blur-xl dark:border-amber-900 dark:bg-gray-900/60">
            <div className="mb-8 inline-flex rounded-full bg-amber-100 px-4 py-2 text-sm font-bold text-amber-800">
              🍯 Apiário Vitória Seven
            </div>

            <h1 className="text-5xl font-black leading-tight text-amber-950 dark:text-amber-300">
              Crie sua conta e compre produtos naturais com facilidade.
            </h1>

            <p className="mt-5 text-lg text-gray-600 dark:text-gray-300">
              Cadastre seus dados para acompanhar pedidos, finalizar compras e receber atualizações sobre seus produtos.
            </p>

            <div className="mt-8 grid gap-4">
              <div className="rounded-3xl border border-amber-100 bg-white/80 p-5 shadow-md dark:border-amber-900 dark:bg-gray-950/70">
                <div className="text-3xl">📦</div>
                <h3 className="mt-3 font-extrabold text-amber-900 dark:text-amber-300">
                  Acompanhe seus pedidos
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Veja status, detalhes e histórico de compras.
                </p>
              </div>

              <div className="rounded-3xl border border-amber-100 bg-white/80 p-5 shadow-md dark:border-amber-900 dark:bg-gray-950/70">
                <div className="text-3xl">🐝</div>
                <h3 className="mt-3 font-extrabold text-amber-900 dark:text-amber-300">
                  Produtos artesanais
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Mel, própolis e produtos naturais em uma experiência simples.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="animate-fade-in-up">
          <div className="overflow-hidden rounded-[2rem] border border-amber-200 bg-white/85 shadow-2xl backdrop-blur-xl dark:border-amber-800 dark:bg-gray-900/90">
            <div className="bg-gradient-to-r from-amber-700 via-yellow-600 to-amber-700 px-6 py-8 text-white sm:px-10">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/15 text-4xl shadow-inner">
                  🍯
                </div>

                <div>
                  <p className="text-sm font-bold uppercase tracking-wider text-amber-100">
                    Criar conta
                  </p>
                  <h2 className="text-3xl font-black">
                    Cadastro de cliente
                  </h2>
                </div>
              </div>

              <p className="mt-4 max-w-2xl text-sm text-amber-50">
                Preencha seus dados para comprar e acompanhar seus pedidos. Sim, o formulário é grande, porque entrega precisa de endereço, essa pequena exigência da realidade física.
              </p>
            </div>

            <div className="p-6 sm:p-10">
              {erro && (
                <div className="mb-6 animate-fade-in rounded-2xl border border-red-300 bg-red-50 px-5 py-4 text-sm font-medium text-red-700 shadow-sm dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
                  {erro}
                </div>
              )}

              {sucesso && (
                <div className="mb-6 animate-fade-in rounded-2xl border border-green-300 bg-green-50 px-5 py-4 text-sm font-medium text-green-700 shadow-sm dark:border-green-900 dark:bg-green-950/40 dark:text-green-300">
                  {sucesso}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                <section className="animate-fade-in-up delay-100">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 text-xl">
                      👤
                    </div>

                    <div>
                      <h3 className="text-lg font-black text-amber-900 dark:text-amber-300">
                        Dados pessoais
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Informações básicas da sua conta.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="md:col-span-2">
                      <label className={labelClass}>Nome completo</label>
                      <input
                        type="text"
                        placeholder="Ex: Carlos Silva"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        className={inputClass}
                        required
                      />
                    </div>

                    <div>
                      <label className={labelClass}>E-mail</label>
                      <input
                        type="email"
                        placeholder="seuemail@email.com"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        className={inputClass}
                        required
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Senha</label>
                      <input
                        type="password"
                        placeholder="Mínimo 6 caracteres"
                        value={formData.password}
                        onChange={(e) => handleChange('password', e.target.value)}
                        className={inputClass}
                        minLength={6}
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className={labelClass}>Telefone</label>
                      <input
                        type="tel"
                        placeholder="85999999999"
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        className={inputClass}
                        required
                      />
                    </div>
                  </div>
                </section>

                <section className="animate-fade-in-up delay-200">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 text-xl">
                      🏠
                    </div>

                    <div>
                      <h3 className="text-lg font-black text-amber-900 dark:text-amber-300">
                        Endereço de entrega
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Usado para facilitar a entrega dos produtos.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className={labelClass}>CEP</label>
                      <input
                        type="text"
                        placeholder="60000000"
                        value={formData.zipCode}
                        onChange={(e) => handleChange('zipCode', e.target.value)}
                        className={inputClass}
                        required
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Estado</label>
                      <input
                        type="text"
                        placeholder="CE"
                        value={formData.state}
                        onChange={(e) => handleChange('state', e.target.value)}
                        className={inputClass}
                        required
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Cidade</label>
                      <input
                        type="text"
                        placeholder="Fortaleza"
                        value={formData.city}
                        onChange={(e) => handleChange('city', e.target.value)}
                        className={inputClass}
                        required
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Bairro</label>
                      <input
                        type="text"
                        placeholder="Centro"
                        value={formData.neighborhood}
                        onChange={(e) => handleChange('neighborhood', e.target.value)}
                        className={inputClass}
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className={labelClass}>Rua</label>
                      <input
                        type="text"
                        placeholder="Rua das Flores"
                        value={formData.street}
                        onChange={(e) => handleChange('street', e.target.value)}
                        className={inputClass}
                        required
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Número</label>
                      <input
                        type="text"
                        placeholder="123"
                        value={formData.addressNumber}
                        onChange={(e) => handleChange('addressNumber', e.target.value)}
                        className={inputClass}
                        required
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Complemento</label>
                      <input
                        type="text"
                        placeholder="Apartamento, bloco, referência..."
                        value={formData.complement}
                        onChange={(e) => handleChange('complement', e.target.value)}
                        className={inputClass}
                      />
                    </div>
                  </div>
                </section>

                <div className="animate-fade-in-up delay-300 space-y-4">
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
                          Cadastrando...
                        </>
                      ) : (
                        <>
                          Criar minha conta
                          <span className="transition group-hover:translate-x-1">→</span>
                        </>
                      )}
                    </span>
                  </button>

                  <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                    Já tem uma conta?{' '}
                    <Link
                      to="/login"
                      className="font-bold text-amber-700 transition hover:text-amber-900 dark:text-amber-300"
                    >
                      Entrar agora
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
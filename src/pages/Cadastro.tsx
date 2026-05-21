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
    setFormData((prev) => ({
      ...prev,
      [field]: value,
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
      }, 1500);
    } catch {
      setErro('Erro ao realizar cadastro. Verifique os dados e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-gradient-to-br from-amber-100 via-orange-50 to-yellow-100 dark:from-gray-900 dark:via-amber-950 dark:to-gray-800">
      <div className="bg-white/95 dark:bg-gray-800/95 rounded-2xl shadow-2xl border border-amber-200 dark:border-amber-700 p-8 w-full max-w-3xl">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🍯</div>

          <h1 className="text-3xl font-bold text-amber-800 dark:text-amber-400">
            Criar conta
          </h1>

          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Cadastre-se para comprar produtos do Apiário Vitória Seven.
          </p>
        </div>

        {erro && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-5 text-sm">
            {erro}
          </div>
        )}

        {sucesso && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-5 text-sm">
            {sucesso}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <h2 className="text-lg font-semibold text-amber-800 dark:text-amber-400 mb-3">
              Dados pessoais
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Nome completo"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-amber-200 dark:border-amber-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />

              <input
                type="email"
                placeholder="E-mail"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-amber-200 dark:border-amber-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />

              <input
                type="password"
                placeholder="Senha"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-amber-200 dark:border-amber-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
                minLength={6}
              />

              <input
                type="text"
                placeholder="Telefone"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-amber-200 dark:border-amber-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-amber-800 dark:text-amber-400 mb-3">
              Endereço de entrega
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="CEP"
                value={formData.zipCode}
                onChange={(e) => handleChange('zipCode', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-amber-200 dark:border-amber-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />

              <input
                type="text"
                placeholder="Rua"
                value={formData.street}
                onChange={(e) => handleChange('street', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-amber-200 dark:border-amber-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />

              <input
                type="text"
                placeholder="Número"
                value={formData.addressNumber}
                onChange={(e) => handleChange('addressNumber', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-amber-200 dark:border-amber-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />

              <input
                type="text"
                placeholder="Complemento. Ex: Apto 302, bloco B"
                value={formData.complement}
                onChange={(e) => handleChange('complement', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-amber-200 dark:border-amber-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />

              <input
                type="text"
                placeholder="Bairro"
                value={formData.neighborhood}
                onChange={(e) => handleChange('neighborhood', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-amber-200 dark:border-amber-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />

              <input
                type="text"
                placeholder="Cidade"
                value={formData.city}
                onChange={(e) => handleChange('city', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-amber-200 dark:border-amber-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />

              <input
                type="text"
                placeholder="Estado. Ex: CE"
                value={formData.state}
                onChange={(e) => handleChange('state', e.target.value.toUpperCase())}
                maxLength={2}
                className="w-full px-4 py-3 rounded-xl border border-amber-200 dark:border-amber-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-amber-300 text-white font-bold py-3 rounded-xl transition shadow-md"
          >
            {loading ? 'Cadastrando...' : 'Criar conta'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Já tem uma conta?{' '}
            <Link
              to="/login"
              className="font-semibold text-amber-700 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-300 transition"
            >
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
import { useState, type FormEvent } from 'react';
import { motion, type Variants } from 'framer-motion';
import { login, setAuthToken } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import { decodeToken } from '../utils/decodeToken';

// Constantes de animação fora do componente (evita recriação)
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

const iconVariants: Variants = {
  hidden: { scale: 0.8, rotate: -10 },
  visible: {
    scale: 1,
    rotate: 0,
    transition: { duration: 0.5, type: 'spring', stiffness: 200 },
  },
};

const inputVariants: Variants = {
  focus: { scale: 1.02, transition: { duration: 0.2 } },
  blur: { scale: 1 },
};

const errorVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [erro, setErro] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setErro('');
    setIsLoading(true);

    try {
      const { token } = await login(email, password);

      localStorage.setItem('token', token);
      setAuthToken(token);

      const decoded = decodeToken(token);

      if (decoded?.role === 'ADMIN') {
        localStorage.setItem('role', 'ADMIN');
      } else {
        localStorage.setItem('role', 'CLIENTE');
      }

      navigate('/produtos');
    } catch {
      setErro('Email ou senha inválidos');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-amber-100 via-orange-50 to-yellow-100 dark:from-gray-900 dark:via-amber-950 dark:to-gray-800">
      {/* Elementos decorativos flutuantes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/3 -right-20 w-72 h-72 bg-amber-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-0 left-1/3 w-56 h-56 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-amber-300 dark:border-amber-700 transition-all duration-300 hover:shadow-3xl">
          {/* Cabeçalho com ícone animado */}
          <div className="text-center mb-8">
            <motion.div
              variants={iconVariants}
              initial="hidden"
              animate="visible"
              className="inline-block"
            >
              <div className="text-6xl mb-3 filter drop-shadow-lg">🐝</div>
            </motion.div>

            <h1 className="text-3xl font-extrabold text-amber-800 dark:text-amber-400 tracking-tight">
              Apiário Vitória Seven
            </h1>

            <p className="text-amber-600 dark:text-amber-500 mt-2 text-sm font-medium">
              Entre no mundo do mel puro
            </p>
          </div>

          <h2 className="text-2xl font-semibold text-amber-800 dark:text-amber-400 mb-6 text-center">
            Acesse sua conta
          </h2>

          {erro && (
            <motion.div
              variants={errorVariants}
              initial="hidden"
              animate="visible"
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm"
            >
              {erro}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <motion.div variants={inputVariants} whileFocus="focus">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-amber-800 dark:text-amber-300 mb-1"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-amber-200 dark:border-amber-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                required
              />
            </motion.div>

            <motion.div variants={inputVariants} whileFocus="focus">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-amber-800 dark:text-amber-300 mb-1"
              >
                Senha
              </label>

              <input
                id="password"
                type="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-amber-200 dark:border-amber-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                required
              />
            </motion.div>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </motion.button>

            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Ainda não tem conta?{' '}
                <Link
                  to="/cadastro"
                  className="font-semibold text-amber-700 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-300 transition"
                >
                  Criar conta
                </Link>
              </p>
            </div>
          </form>

          <div className="mt-6 text-center text-xs text-amber-500 dark:text-amber-400">
            <span>🍯 Produtos frescos do apiário para você</span>
          </div>
        </div>

        {/* Selo decorativo */}
        <div className="mt-6 text-center text-amber-600/60 text-sm flex justify-center gap-4">
          <span>🐝 100% natural</span>
          <span>✓ Sem agrotóxicos</span>
          <span>🍯 Colheita recente</span>
        </div>
      </motion.div>
    </div>
  );
}
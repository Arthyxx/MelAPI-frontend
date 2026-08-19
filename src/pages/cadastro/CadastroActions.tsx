import { Link } from 'react-router-dom';

interface CadastroActionsProps {
  loading: boolean;
}

export function CadastroActions({
  loading,
}: CadastroActionsProps) {
  return (
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

              <span className="transition group-hover:translate-x-1">
                →
              </span>
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
  );
}
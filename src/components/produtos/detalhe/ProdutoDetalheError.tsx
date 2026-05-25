import { Link } from 'react-router-dom';

interface ProdutoDetalheErrorProps {
  message?: string;
}

export function ProdutoDetalheError({ message }: ProdutoDetalheErrorProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100 px-4 dark:from-gray-950 dark:via-gray-900 dark:to-amber-950">
      <div className="max-w-xl rounded-3xl border border-red-200 bg-white p-8 text-center shadow-2xl dark:border-red-900 dark:bg-gray-900">
        <div className="mb-4 text-6xl">⚠️</div>

        <h1 className="text-2xl font-black text-red-700 dark:text-red-300">
          Produto não encontrado
        </h1>

        <p className="mt-3 text-gray-600 dark:text-gray-400">
          {message || 'Não conseguimos encontrar esse produto.'}
        </p>

        <Link
          to="/produtos"
          className="mt-6 inline-flex rounded-2xl bg-amber-600 px-6 py-3 font-bold text-white shadow-lg transition hover:-translate-y-1 hover:bg-amber-700 hover:shadow-xl"
        >
          Voltar para produtos
        </Link>
      </div>
    </div>
  );
}
import { Link } from 'react-router-dom';

export function PerfilHeader() {
  return (
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
          Atualize seus dados pessoais
          e endereço de entrega.
        </p>
      </div>

      <div className="flex h-20 w-20 items-center justify-center rounded-[2rem] bg-gradient-to-br from-amber-600 to-yellow-500 text-5xl text-white shadow-2xl">
        👤
      </div>
    </header>
  );
}
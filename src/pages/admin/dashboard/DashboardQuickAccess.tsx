import { Link } from 'react-router-dom';

export function DashboardQuickAccess() {
  return (
    <section>
      <div className="mb-4">
        <h2 className="text-xl font-black text-gray-950">
          Acesso rápido
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Escolha o que deseja
          administrar.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Link
          to="/admin/produtos"
          className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-amber-200 hover:shadow-md"
        >
          <span className="text-3xl">
            📦
          </span>

          <h3 className="mt-4 font-black text-gray-950">
            Produtos
          </h3>

          <p className="mt-1 text-sm leading-relaxed text-gray-500">
            Cadastre produtos,
            altere preços, fotos e
            estoque.
          </p>
        </Link>

        <Link
          to="/admin/categorias"
          className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-amber-200 hover:shadow-md"
        >
          <span className="text-3xl">
            🏷️
          </span>

          <h3 className="mt-4 font-black text-gray-950">
            Categorias
          </h3>

          <p className="mt-1 text-sm leading-relaxed text-gray-500">
            Organize os produtos
            da loja por categoria.
          </p>
        </Link>

        <Link
          to="/admin/clientes"
          className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-amber-200 hover:shadow-md"
        >
          <span className="text-3xl">
            👥
          </span>

          <h3 className="mt-4 font-black text-gray-950">
            Clientes
          </h3>

          <p className="mt-1 text-sm leading-relaxed text-gray-500">
            Consulte os clientes
            cadastrados na loja.
          </p>
        </Link>

        <Link
          to="/admin/pedidos"
          className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-amber-200 hover:shadow-md"
        >
          <span className="text-3xl">
            📋
          </span>

          <h3 className="mt-4 font-black text-gray-950">
            Pedidos
          </h3>

          <p className="mt-1 text-sm leading-relaxed text-gray-500">
            Acompanhe pedidos,
            pagamentos e entregas.
          </p>
        </Link>
      </div>
    </section>
  );
}
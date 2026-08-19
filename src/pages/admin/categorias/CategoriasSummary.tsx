interface CategoriasSummaryProps {
  totalItems: number;
  categoriasAtivasNaPagina: number;
  categoriasInativasNaPagina: number;
}

export function CategoriasSummary({
  totalItems,
  categoriasAtivasNaPagina,
  categoriasInativasNaPagina,
}: CategoriasSummaryProps) {
  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p className="text-sm font-black uppercase tracking-[0.2em] text-amber-700">
          Administração
        </p>

        <h2 className="mt-2 text-3xl font-black tracking-tight text-gray-950">
          Categorias
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          Organize os tipos de produtos
          exibidos na loja.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3">
          <p className="text-2xl font-black text-gray-950">
            {totalItems}
          </p>

          <p className="text-xs font-bold text-gray-500">
            Encontradas
          </p>
        </div>

        <div className="rounded-2xl border border-green-100 bg-green-50 px-4 py-3">
          <p className="text-2xl font-black text-green-700">
            {categoriasAtivasNaPagina}
          </p>

          <p className="text-xs font-bold text-green-700">
            Ativas na página
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3">
          <p className="text-2xl font-black text-gray-600">
            {categoriasInativasNaPagina}
          </p>

          <p className="text-xs font-bold text-gray-500">
            Inativas na página
          </p>
        </div>
      </div>
    </div>
  );
}
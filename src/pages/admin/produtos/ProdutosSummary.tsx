interface ProdutosSummaryProps {
  totalItems: number;
  produtosAtivosNaPagina: number;
  produtosSemEstoqueNaPagina: number;
}

export function ProdutosSummary({
  totalItems,
  produtosAtivosNaPagina,
  produtosSemEstoqueNaPagina,
}: ProdutosSummaryProps) {
  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p className="text-sm font-black uppercase tracking-[0.2em] text-amber-700">
          Administração
        </p>

        <h2 className="mt-2 text-3xl font-black tracking-tight text-gray-950">
          Produtos
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          Cadastre, edite e acompanhe os produtos exibidos na loja.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3">
          <p className="text-2xl font-black text-gray-950">
            {totalItems}
          </p>

          <p className="text-xs font-bold text-gray-500">
            Encontrados
          </p>
        </div>

        <div className="rounded-2xl border border-green-100 bg-green-50 px-4 py-3">
          <p className="text-2xl font-black text-green-700">
            {produtosAtivosNaPagina}
          </p>

          <p className="text-xs font-bold text-green-700">
            Ativos na página
          </p>
        </div>

        <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3">
          <p className="text-2xl font-black text-red-700">
            {produtosSemEstoqueNaPagina}
          </p>

          <p className="text-xs font-bold text-red-700">
            Sem estoque na página
          </p>
        </div>
      </div>
    </div>
  );
}
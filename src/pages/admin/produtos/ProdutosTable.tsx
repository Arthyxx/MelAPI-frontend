import { formatCurrency } from '../../../utils/formatCurrency';

import type { Produto } from './produto.types';

interface ProdutosTableProps {
  produtos: Produto[];
  loading: boolean;
  onEdit: (
    produto: Produto,
  ) => void;
  onDelete: (
    produtoId: number,
  ) => void;
}

export function ProdutosTable({
  produtos,
  loading,
  onEdit,
  onDelete,
}: ProdutosTableProps) {
  if (loading) {
    return (
      <div className="p-10 text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-amber-200 border-t-amber-700" />

        <p className="mt-4 font-semibold text-gray-600">
          Carregando produtos...
        </p>
      </div>
    );
  }

  if (produtos.length === 0) {
    return (
      <div className="p-10 text-center text-gray-500">
        Nenhum produto encontrado.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[900px] border-collapse">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs font-black uppercase tracking-wide text-gray-500">
            <th className="px-6 py-4">
              Produto
            </th>

            <th className="px-6 py-4">
              Preço
            </th>

            <th className="px-6 py-4">
              Estoque
            </th>

            <th className="px-6 py-4">
              Categoria
            </th>

            <th className="px-6 py-4">
              Status
            </th>

            <th className="px-6 py-4 text-right">
              Ações
            </th>
          </tr>
        </thead>

        <tbody>
          {produtos.map(
            (produto) => (
              <tr
                key={produto.id}
                className="border-b border-gray-100 transition hover:bg-gray-50"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-amber-50 text-xl">
                      {produto.imageUrl ? (
                        <img
                          src={
                            produto.imageUrl
                          }
                          alt={
                            produto.name
                          }
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        '🍯'
                      )}
                    </div>

                    <div>
                      <p className="font-black text-gray-900">
                        {produto.name}
                      </p>

                      <p className="line-clamp-1 max-w-sm text-sm text-gray-500">
                        {produto.description ||
                          'Sem descrição'}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 font-bold text-gray-800">
                  {formatCurrency(
                    produto.price,
                  )}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-black ${
                      produto.stockQuantity >
                      0
                        ? 'bg-green-50 text-green-700'
                        : 'bg-red-50 text-red-700'
                    }`}
                  >
                    {
                      produto.stockQuantity
                    }
                  </span>
                </td>

                <td className="px-6 py-4 text-sm font-semibold text-gray-600">
                  {produto.category
                    ?.name ||
                    'Sem categoria'}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-black ${
                      produto.active
                        ? 'bg-green-50 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {produto.active
                      ? 'Ativo'
                      : 'Inativo'}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        onEdit(
                          produto,
                        )
                      }
                      className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-black text-gray-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-gray-50 hover:shadow-md"
                    >
                      Editar
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        onDelete(
                          produto.id,
                        )
                      }
                      className="rounded-xl border border-red-100 bg-red-50 px-4 py-2 text-sm font-black text-red-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-red-100 hover:shadow-md"
                    >
                      Excluir
                    </button>
                  </div>
                </td>
              </tr>
            ),
          )}
        </tbody>
      </table>
    </div>
  );
}
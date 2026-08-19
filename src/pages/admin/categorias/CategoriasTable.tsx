import type {
  Categoria,
} from './categoria.types';

interface CategoriasTableProps {
  categorias: Categoria[];
  loading: boolean;
  onEdit: (
    categoria: Categoria,
  ) => void;
  onDelete: (
    categoriaId: number,
  ) => void;
}

export function CategoriasTable({
  categorias,
  loading,
  onEdit,
  onDelete,
}: CategoriasTableProps) {
  if (loading) {
    return (
      <div className="p-10 text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-amber-200 border-t-amber-700" />

        <p className="mt-4 font-semibold text-gray-600">
          Carregando categorias...
        </p>
      </div>
    );
  }

  if (categorias.length === 0) {
    return (
      <div className="p-10 text-center text-gray-500">
        Nenhuma categoria encontrada.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] border-collapse">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs font-black uppercase tracking-wide text-gray-500">
            <th className="px-6 py-4">
              Categoria
            </th>

            <th className="px-6 py-4">
              Descrição
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
          {categorias.map(
            (categoria) => (
              <tr
                key={categoria.id}
                className="border-b border-gray-100 transition hover:bg-gray-50"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-xl">
                      🏷️
                    </div>

                    <div>
                      <p className="font-black text-gray-900">
                        {categoria.name}
                      </p>

                      <p className="text-xs text-gray-500">
                        ID #{categoria.id}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 text-sm font-medium text-gray-600">
                  {categoria.description ||
                    'Sem descrição'}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-black ${
                      categoria.active
                        ? 'bg-green-50 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {categoria.active
                      ? 'Ativa'
                      : 'Inativa'}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        onEdit(
                          categoria,
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
                          categoria.id,
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
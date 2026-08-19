import type { Cliente } from './cliente.types';

interface ClientesTableProps {
  clientes: Cliente[];
  loading: boolean;
  onEdit: (
    cliente: Cliente,
  ) => void;
  onDelete: (
    clienteId: number,
  ) => void;
}

function getClienteInitials(
  name: string,
) {
  return (
    name
      ?.split(' ')
      .slice(0, 2)
      .map(
        (part) =>
          part[0],
      )
      .join('')
      .toUpperCase() ||
    'CL'
  );
}

export function ClientesTable({
  clientes,
  loading,
  onEdit,
  onDelete,
}: ClientesTableProps) {
  if (loading) {
    return (
      <div className="p-10 text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-amber-200 border-t-amber-700" />

        <p className="mt-4 font-semibold text-gray-600">
          Carregando clientes...
        </p>
      </div>
    );
  }

  if (clientes.length === 0) {
    return (
      <div className="p-10 text-center text-gray-500">
        Nenhum cliente encontrado.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[940px] border-collapse">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs font-black uppercase tracking-wide text-gray-500">
            <th className="px-6 py-4">
              Cliente
            </th>

            <th className="px-6 py-4">
              Contato
            </th>

            <th className="px-6 py-4">
              Perfil
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
          {clientes.map(
            (cliente) => (
              <tr
                key={cliente.id}
                className="border-b border-gray-100 transition hover:bg-gray-50"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gray-100 text-sm font-black text-gray-700">
                      {getClienteInitials(
                        cliente.name,
                      )}
                    </div>

                    <div>
                      <p className="font-black text-gray-900">
                        {cliente.name}
                      </p>

                      <p className="text-xs text-gray-500">
                        ID #{cliente.id}
                        {cliente.city
                          ? ` • ${cliente.city}`
                          : ''}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <p className="text-sm font-semibold text-gray-700">
                    {cliente.email}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    {cliente.phone ||
                      'Telefone não informado'}
                  </p>
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-black ${
                      cliente.role ===
                      'ADMIN'
                        ? 'bg-purple-50 text-purple-700'
                        : 'bg-blue-50 text-blue-700'
                    }`}
                  >
                    {cliente.role ===
                    'ADMIN'
                      ? 'Administrador'
                      : 'Cliente'}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-black ${
                      cliente.active
                        ? 'bg-green-50 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {cliente.active
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
                          cliente,
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
                          cliente.id,
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
interface ClientesSummaryProps {
  totalItems: number;
  totalClientesNaPagina: number;
  totalAdminsNaPagina: number;
  totalAtivosNaPagina: number;
}

export function ClientesSummary({
  totalItems,
  totalClientesNaPagina,
  totalAdminsNaPagina,
  totalAtivosNaPagina,
}: ClientesSummaryProps) {
  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p className="text-sm font-black uppercase tracking-[0.2em] text-amber-700">
          Administração
        </p>

        <h2 className="mt-2 text-3xl font-black tracking-tight text-gray-950">
          Clientes
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          Gerencie contas de clientes e
          administradores.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 text-center sm:grid-cols-4">
        <div className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3">
          <p className="text-2xl font-black text-gray-950">
            {totalItems}
          </p>

          <p className="text-xs font-bold text-gray-500">
            Encontrados
          </p>
        </div>

        <div className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3">
          <p className="text-2xl font-black text-blue-700">
            {totalClientesNaPagina}
          </p>

          <p className="text-xs font-bold text-blue-700">
            Clientes na página
          </p>
        </div>

        <div className="rounded-2xl border border-purple-100 bg-purple-50 px-4 py-3">
          <p className="text-2xl font-black text-purple-700">
            {totalAdminsNaPagina}
          </p>

          <p className="text-xs font-bold text-purple-700">
            Admins na página
          </p>
        </div>

        <div className="rounded-2xl border border-green-100 bg-green-50 px-4 py-3">
          <p className="text-2xl font-black text-green-700">
            {totalAtivosNaPagina}
          </p>

          <p className="text-xs font-bold text-green-700">
            Ativos na página
          </p>
        </div>
      </div>
    </div>
  );
}
export function DashboardLoading() {
  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-10 text-center shadow-sm">
      <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-amber-200 border-t-amber-700" />

      <p className="mt-4 font-semibold text-gray-600">
        Carregando informações da loja...
      </p>
    </div>
  );
}
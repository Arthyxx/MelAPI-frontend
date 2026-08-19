interface PerfilActionsProps {
  saving: boolean;
}

export function PerfilActions({
  saving,
}: PerfilActionsProps) {
  return (
    <div className="animate-fade-in-up delay-200 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Revise os dados antes de
        salvar. Entrega errada por
        endereço errado é uma tragédia
        logística perfeitamente
        evitável.
      </p>

      <button
        type="submit"
        disabled={saving}
        className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 px-8 py-4 font-black text-white shadow-xl transition duration-300 hover:-translate-y-1 hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-70"
      >
        <span className="absolute inset-0 translate-x-[-100%] bg-white/20 transition duration-700 group-hover:translate-x-[100%]" />

        <span className="relative flex items-center justify-center gap-2">
          {saving ? (
            <>
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Salvando...
            </>
          ) : (
            <>
              Salvar alterações

              <span className="transition group-hover:translate-x-1">
                →
              </span>
            </>
          )}
        </span>
      </button>
    </div>
  );
}
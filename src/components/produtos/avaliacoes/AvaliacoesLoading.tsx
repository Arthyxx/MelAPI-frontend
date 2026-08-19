export function AvaliacoesLoading() {
  return (
    <section className="mt-8 rounded-[2rem] border border-amber-200 bg-white/90 p-6 shadow-xl dark:border-amber-800 dark:bg-gray-900/90">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 animate-pulse rounded-2xl bg-amber-100" />

        <div>
          <div className="h-4 w-40 animate-pulse rounded bg-amber-100" />

          <div className="mt-2 h-3 w-56 animate-pulse rounded bg-amber-50" />
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="h-28 animate-pulse rounded-3xl bg-amber-50" />

        <div className="h-28 animate-pulse rounded-3xl bg-amber-50" />
      </div>
    </section>
  );
}
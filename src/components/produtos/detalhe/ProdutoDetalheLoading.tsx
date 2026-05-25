export function ProdutoDetalheLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100 dark:from-gray-950 dark:via-gray-900 dark:to-amber-950">
      <div className="relative">
        <div className="mb-4 text-8xl drop-shadow-lg animate-bounce-soft">
          🍯
        </div>

        <div className="absolute inset-0 rounded-full bg-amber-200/30 blur-xl animate-pulse-gentle" />
      </div>

      <p className="mt-4 text-xl font-bold text-amber-700 dark:text-amber-300">
        Carregando produto...
      </p>
    </div>
  );
}
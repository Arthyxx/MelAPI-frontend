export function PerfilLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100 dark:from-gray-950 dark:via-gray-900 dark:to-amber-950">
      <div className="text-center">
        <div className="mb-4 text-7xl animate-bounce-soft">
          👤
        </div>

        <p className="text-xl font-semibold text-amber-700 dark:text-amber-300">
          Carregando perfil...
        </p>
      </div>
    </div>
  );
}
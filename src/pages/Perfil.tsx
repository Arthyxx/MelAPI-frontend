import {
  PerfilActions,
} from './perfil/PerfilActions';
import {
  PerfilAddress,
} from './perfil/PerfilAddress';
import {
  PerfilHeader,
} from './perfil/PerfilHeader';
import {
  PerfilLoading,
} from './perfil/PerfilLoading';
import {
  PerfilMessages,
} from './perfil/PerfilMessages';
import {
  PerfilPersonalData,
} from './perfil/PerfilPersonalData';
import {
  usePerfilForm,
} from './perfil/usePerfilForm';

export function Perfil() {
  const {
    formData,
    loading,
    saving,
    error,
    success,
    handleChange,
    handleSubmit,
  } = usePerfilForm();

  if (loading) {
    return <PerfilLoading />;
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100 px-4 py-10 dark:from-gray-950 dark:via-gray-900 dark:to-amber-950">
      <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-amber-300/30 blur-3xl animate-pulse-gentle" />

      <div className="absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-yellow-400/30 blur-3xl animate-pulse-gentle" />

      <div className="absolute left-1/2 top-1/3 h-48 w-48 rounded-full bg-orange-300/20 blur-3xl animate-spin-slow" />

      <main className="relative z-10 mx-auto max-w-5xl">
        <PerfilHeader />

        <section className="overflow-hidden rounded-[2rem] border border-amber-200 bg-white/85 shadow-2xl backdrop-blur-xl dark:border-amber-800 dark:bg-gray-900/90">
          <div className="bg-gradient-to-r from-amber-700 via-yellow-600 to-amber-700 px-6 py-8 text-white sm:px-10">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-wider text-amber-100">
                  Dados da conta
                </p>

                <h2 className="text-3xl font-black">
                  Informações do cliente
                </h2>

                <p className="mt-2 text-sm text-amber-50">
                  Esses dados ajudam no
                  contato e na entrega
                  dos produtos.
                </p>
              </div>

              {formData.role && (
                <span className="w-fit rounded-full bg-white/15 px-4 py-2 text-sm font-black text-white">
                  {formData.role}
                </span>
              )}
            </div>
          </div>

          <div className="p-6 sm:p-10">
            <PerfilMessages
              error={error}
              success={success}
            />

            <form
              onSubmit={handleSubmit}
              className="space-y-8"
            >
              <PerfilPersonalData
                formData={formData}
                onChange={handleChange}
              />

              <PerfilAddress
                formData={formData}
                onChange={handleChange}
              />

              <PerfilActions
                saving={saving}
              />
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}
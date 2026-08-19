import {
  CadastroActions,
} from './cadastro/CadastroActions';
import {
  CadastroAddress,
} from './cadastro/CadastroAddress';
import {
  CadastroHeader,
} from './cadastro/CadastroHeader';
import {
  CadastroHero,
} from './cadastro/CadastroHero';
import {
  CadastroMessages,
} from './cadastro/CadastroMessages';
import {
  CadastroPersonalData,
} from './cadastro/CadastroPersonalData';
import {
  useCadastroForm,
} from './cadastro/useCadastroForm';

export function Cadastro() {
  const {
    formData,
    erro,
    sucesso,
    loading,
    handleChange,
    handleSubmit,
  } = useCadastroForm();

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100 px-4 py-10 dark:from-gray-950 dark:via-gray-900 dark:to-amber-950">
      <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-amber-300/30 blur-3xl animate-pulse-gentle" />

      <div className="absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-yellow-400/30 blur-3xl animate-pulse-gentle" />

      <div className="absolute left-1/2 top-1/3 h-48 w-48 rounded-full bg-orange-300/20 blur-3xl animate-spin-slow" />

      <main className="relative z-10 mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        <CadastroHero />

        <section className="animate-fade-in-up">
          <div className="overflow-hidden rounded-[2rem] border border-amber-200 bg-white/85 shadow-2xl backdrop-blur-xl dark:border-amber-800 dark:bg-gray-900/90">
            <CadastroHeader />

            <div className="p-6 sm:p-10">
              <CadastroMessages
                erro={erro}
                sucesso={sucesso}
              />

              <form
                onSubmit={handleSubmit}
                className="space-y-8"
              >
                <CadastroPersonalData
                  formData={formData}
                  onChange={handleChange}
                />

                <CadastroAddress
                  formData={formData}
                  onChange={handleChange}
                />

                <CadastroActions
                  loading={loading}
                />
              </form>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
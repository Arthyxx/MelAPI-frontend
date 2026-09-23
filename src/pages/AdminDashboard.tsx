import { DashboardAttention } from "./admin/dashboard/DashboardAttention";
import { DashboardHero } from "./admin/dashboard/DashboardHero";
import { DashboardLoading } from "./admin/dashboard/DashboardLoading";
import { DashboardNumbers } from "./admin/dashboard/DashboardNumbers";
import { DashboardOverview } from "./admin/dashboard/DashboardOverview";
import { DashboardQuickAccess } from "./admin/dashboard/DashboardQuickAccess";
import { useDashboardSummary } from "./admin/dashboard/useDashboardSummary";

export function AdminDashboard() {
  const { summary, loading, error } = useDashboardSummary();

  if (loading) {
    return <DashboardLoading />;
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div
          role="alert"
          className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700 shadow-sm"
        >
          <h2 className="text-xl font-black text-red-900">
            Não foi possível carregar o dashboard
          </h2>

          <p className="mt-2 text-sm font-semibold">{error}</p>

          <button
            type="button"
            onClick={() => {
              window.location.reload();
            }}
            className="mt-5 rounded-2xl bg-red-700 px-5 py-3 text-sm font-black text-white transition hover:bg-red-800"
          >
            Tentar novamente
          </button>
        </div>

        <DashboardQuickAccess />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardHero />

      <DashboardAttention summary={summary} />

      <DashboardNumbers summary={summary} />

      <DashboardOverview summary={summary} />

      <DashboardQuickAccess />
    </div>
  );
}

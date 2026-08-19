import {
  DashboardAttention,
} from './admin/dashboard/DashboardAttention';
import {
  DashboardHero,
} from './admin/dashboard/DashboardHero';
import {
  DashboardLoading,
} from './admin/dashboard/DashboardLoading';
import {
  DashboardNumbers,
} from './admin/dashboard/DashboardNumbers';
import {
  DashboardOverview,
} from './admin/dashboard/DashboardOverview';
import {
  DashboardQuickAccess,
} from './admin/dashboard/DashboardQuickAccess';
import {
  useDashboardSummary,
} from './admin/dashboard/useDashboardSummary';

export function AdminDashboard() {
  const {
    summary,
    loading,
    error,
  } = useDashboardSummary();

  if (loading) {
    return <DashboardLoading />;
  }

  return (
    <div className="space-y-6">
      {error && (
        <div
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700"
        >
          {error}
        </div>
      )}

      <DashboardHero />

      <DashboardAttention
        summary={summary}
      />

      <DashboardNumbers
        summary={summary}
      />

      <DashboardOverview
        summary={summary}
      />

      <DashboardQuickAccess />
    </div>
  );
}
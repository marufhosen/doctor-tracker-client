import { MetricCards } from "@/components/dashboard/metric-cards";
import { getDashboardSummary } from "@/lib/dashboard/dashboard.service.server";

export default async function DashboardPage() {
  const summary = await getDashboardSummary();

  return (
    <div className="space-y-6 lg:space-y-8">
      <MetricCards summary={summary} />
    </div>
  );
}

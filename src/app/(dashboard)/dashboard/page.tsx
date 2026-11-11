import { DoctorPatientAnalytics } from "@/components/dashboard/doctor-patient-analytics";
import { MetricCards } from "@/components/dashboard/metric-cards";
import { TrendAnalytics } from "@/components/dashboard/trend-analytics";
import {
  getDashboardSummary,
  getDashboardTrends,
  getPatientsByDoctor,
} from "@/lib/dashboard/dashboard.service.server";
import { parseDashboardDateRange } from "@/lib/dashboard/dashboard-range";

export default async function DashboardPage({ searchParams }: PageProps<"/dashboard">) {
  const rawSearchParams = await searchParams;
  const range = parseDashboardDateRange(rawSearchParams);
  const [summary, doctors, trends] = await Promise.all([
    getDashboardSummary(),
    getPatientsByDoctor(),
    range.success ? getDashboardTrends(range.query) : Promise.resolve(null),
  ]);

  return (
    <div className="space-y-6 lg:space-y-8">
      <MetricCards summary={summary} />
      <DoctorPatientAnalytics doctors={doctors} />
      <TrendAnalytics
        trends={trends}
        range={range.values}
        validationMessage={range.success ? undefined : range.message}
      />
    </div>
  );
}

import { Suspense } from "react";
import {
  DashboardSectionError,
  DashboardSectionSkeleton,
} from "@/components/dashboard/dashboard-feedback";
import { DoctorPatientAnalytics } from "@/components/dashboard/doctor-patient-analytics";
import { MetricCards } from "@/components/dashboard/metric-cards";
import { TrendAnalytics } from "@/components/dashboard/trend-analytics";
import { PageHeader } from "@/components/layout/page-navigation";
import {
  getDashboardSummary,
  getDashboardTrends,
  getPatientsByDoctor,
} from "@/lib/dashboard/dashboard.service.server";
import { parseDashboardDateRange } from "@/lib/dashboard/dashboard-range";

export const instant = false;

export default async function DashboardPage({ searchParams }: PageProps<"/dashboard">) {
  const rawSearchParams = await searchParams;
  const range = parseDashboardDateRange(rawSearchParams);

  return (
    <div className="space-y-6 lg:space-y-8">
      <PageHeader title="Overview" description="Your care network, at a glance." />
      <Suspense
        fallback={
          <DashboardSectionSkeleton label="Loading dashboard summary" className="sm:min-h-48" />
        }
      >
        <SummarySection />
      </Suspense>
      <div className="grid gap-5 xl:grid-cols-[1.65fr_1fr]">
        <Suspense fallback={<DashboardSectionSkeleton label="Loading dashboard trends" />}>
          <TrendsSection range={range} />
        </Suspense>
        <Suspense fallback={<DashboardSectionSkeleton label="Loading doctor analytics" />}>
          <DoctorAnalyticsSection />
        </Suspense>
      </div>
      <section className="rounded-[10px] border bg-card px-6 py-6">
        <h2 className="text-lg">Network summary</h2>
        <p className="mt-3 text-sm text-muted-foreground">
          Open Doctors to review assigned patients, or Patients to search and manage all records.
        </p>
      </section>
    </div>
  );
}

async function SummarySection() {
  try {
    return <MetricCards summary={await getDashboardSummary()} />;
  } catch {
    return <DashboardSectionError title="Dashboard summary unavailable" />;
  }
}

async function DoctorAnalyticsSection() {
  try {
    return <DoctorPatientAnalytics doctors={await getPatientsByDoctor()} />;
  } catch {
    return <DashboardSectionError title="Doctor analytics unavailable" />;
  }
}

async function TrendsSection({ range }: { range: ReturnType<typeof parseDashboardDateRange> }) {
  if (!range.success) {
    return <TrendAnalytics trends={null} range={range.values} validationMessage={range.message} />;
  }

  try {
    return <TrendAnalytics trends={await getDashboardTrends(range.query)} range={range.values} />;
  } catch {
    return <DashboardSectionError title="Creation trends unavailable" />;
  }
}

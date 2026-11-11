import { DoctorPatientAnalytics } from "@/components/dashboard/doctor-patient-analytics";
import { MetricCards } from "@/components/dashboard/metric-cards";
import { getDashboardSummary, getPatientsByDoctor } from "@/lib/dashboard/dashboard.service.server";

export default async function DashboardPage() {
  const [summary, doctors] = await Promise.all([getDashboardSummary(), getPatientsByDoctor()]);

  return (
    <div className="space-y-6 lg:space-y-8">
      <MetricCards summary={summary} />
      <DoctorPatientAnalytics doctors={doctors} />
    </div>
  );
}

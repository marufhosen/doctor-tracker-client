import type { DashboardSummary } from "@/lib/api/schemas/dashboard";

export function MetricCards({ summary }: { summary: DashboardSummary }) {
  const metrics = [
    {
      label: "Total doctors",
      value: summary.totalDoctors,
      detail: "Across your care network",
    },
    {
      label: "Total patients",
      value: summary.totalPatients,
      detail: "Across all doctors",
    },
    {
      label: "Patients per doctor",
      value:
        summary.totalDoctors > 0
          ? (summary.totalPatients / summary.totalDoctors).toFixed(2)
          : "0.00",
      detail: "Average assigned patients",
    },
  ] as const;

  return (
    <section aria-labelledby="summary-heading">
      <h2 id="summary-heading" className="sr-only">
        Dashboard summary
      </h2>
      <dl className="grid gap-4 sm:grid-cols-3">
        {metrics.map(({ label, value, detail }) => (
          <div key={label} className="rounded-[10px] border bg-card p-4 shadow-card sm:p-5">
            <dt className="text-sm text-muted-foreground">{label}</dt>
            <dd className="mt-2 text-3xl font-semibold tabular-nums tracking-tight">{value}</dd>
            <p className="mt-2 text-xs text-primary">{detail}</p>
          </div>
        ))}
      </dl>
    </section>
  );
}

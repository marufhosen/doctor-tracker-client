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
      <dl className="grid overflow-hidden rounded-[10px] border bg-card shadow-card sm:grid-cols-3 sm:divide-x">
        {metrics.map(({ label, value, detail }) => (
          <div key={label} className="border-t px-4 py-3 first:border-t-0 sm:border-t-0">
            <dt className="text-xs text-muted-foreground">{label}</dt>
            <dd className="mt-1 text-2xl font-semibold tabular-nums tracking-tight">{value}</dd>
            <p className="mt-1 text-[11px] text-primary">{detail}</p>
          </div>
        ))}
      </dl>
    </section>
  );
}

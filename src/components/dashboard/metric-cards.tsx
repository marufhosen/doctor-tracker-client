import { Stethoscope, Users } from "lucide-react";

import type { DashboardSummary } from "@/lib/api/schemas/dashboard";

export function MetricCards({ summary }: { summary: DashboardSummary }) {
  const metrics = [
    {
      label: "Total doctors",
      value: summary.totalDoctors,
      icon: Stethoscope,
      detail: "Registered care providers",
    },
    {
      label: "Total patients",
      value: summary.totalPatients,
      icon: Users,
      detail: "Patient records under care",
    },
  ] as const;

  return (
    <section aria-labelledby="summary-heading">
      <h2 id="summary-heading" className="sr-only">
        Dashboard summary
      </h2>
      <dl className="grid gap-4 sm:grid-cols-2 xl:max-w-4xl">
        {metrics.map(({ label, value, icon: Icon, detail }) => (
          <div key={label} className="rounded-2xl border bg-card p-5 shadow-card sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
                <dd className="mt-2 text-3xl font-semibold tabular-nums tracking-tight">{value}</dd>
              </div>
              <span className="grid size-11 place-items-center rounded-xl bg-secondary text-primary">
                <Icon aria-hidden="true" className="size-5" />
              </span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">{detail}</p>
          </div>
        ))}
      </dl>
    </section>
  );
}

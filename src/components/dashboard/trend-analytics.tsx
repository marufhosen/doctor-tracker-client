import dynamic from "next/dynamic";
import Link from "next/link";

import { combineTrendSeries, formatTrendDate } from "@/components/dashboard/trend-chart.core";
import { Button } from "@/components/ui/button";
import type { DashboardTrends } from "@/lib/api/schemas/dashboard";

const TrendChart = dynamic(() =>
  import("@/components/dashboard/trend-chart.client").then((module) => module.TrendChart),
);

type TrendAnalyticsProps = {
  trends: DashboardTrends | null;
  range: { from?: string | undefined; to?: string | undefined };
  validationMessage?: string | undefined;
};

export function TrendAnalytics({ trends, range, validationMessage }: TrendAnalyticsProps) {
  const data = trends ? combineTrendSeries(trends) : [];

  return (
    <section aria-labelledby="trends-heading" className="rounded-2xl border bg-card shadow-card">
      <div className="border-b px-5 py-4 sm:px-6">
        <h2 id="trends-heading" className="text-lg">
          Creation trends
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          New doctors and patients grouped by UTC day.
        </p>
        <form method="get" className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
          <label className="grid gap-1 text-sm font-medium">
            From
            <input
              type="date"
              name="from"
              defaultValue={range.from}
              className="h-control rounded-lg border bg-background px-3 text-sm"
            />
          </label>
          <label className="grid gap-1 text-sm font-medium">
            To
            <input
              type="date"
              name="to"
              defaultValue={range.to}
              className="h-control rounded-lg border bg-background px-3 text-sm"
            />
          </label>
          <div className="flex gap-2">
            <Button type="submit" className="h-control px-4">
              Apply range
            </Button>
            <Button asChild type="button" variant="outline" className="h-control px-4">
              <Link href="/dashboard">Clear</Link>
            </Button>
          </div>
        </form>
        {validationMessage && (
          <p role="alert" className="mt-3 text-sm text-destructive">
            {validationMessage}
          </p>
        )}
      </div>
      <div className="p-4 sm:p-6">
        {!validationMessage && data.length === 0 ? (
          <div className="grid min-h-48 place-items-center text-center text-sm text-muted-foreground">
            No doctor or patient creation activity was recorded for this range.
          </div>
        ) : null}
        {data.length > 0 && (
          <>
            <TrendChart data={data} />
            <details className="mt-4 rounded-lg border bg-muted/35">
              <summary className="min-h-11 cursor-pointer px-4 py-3 text-sm font-medium">
                View trend data
              </summary>
              <div className="overflow-x-auto border-t">
                <table className="w-full text-left text-sm">
                  <caption className="sr-only">Daily doctor and patient creation counts</caption>
                  <thead>
                    <tr className="text-muted-foreground">
                      <th scope="col" className="px-4 py-2 font-medium">
                        Date
                      </th>
                      <th scope="col" className="px-4 py-2 text-right font-medium">
                        Doctors
                      </th>
                      <th scope="col" className="px-4 py-2 text-right font-medium">
                        Patients
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((point) => (
                      <tr key={point.date} className="border-t">
                        <th scope="row" className="px-4 py-2 font-medium">
                          {formatTrendDate(point.date)}
                        </th>
                        <td className="px-4 py-2 text-right tabular-nums">{point.doctors}</td>
                        <td className="px-4 py-2 text-right tabular-nums">{point.patients}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>
          </>
        )}
      </div>
    </section>
  );
}

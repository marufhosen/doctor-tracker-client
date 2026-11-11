import dynamic from "next/dynamic";
import Link from "next/link";

import { combineTrendSeries } from "@/components/dashboard/trend-chart.core";
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
    <section aria-labelledby="trends-heading" className="rounded-[10px] border bg-card shadow-card">
      <div className="px-4 pt-4">
        <h2 id="trends-heading" className="text-base">
          Patient registrations
        </h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          New doctors and patients in the selected period.
        </p>
        <form method="get" className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-end">
          <label className="grid gap-0.5 text-xs font-medium">
            From
            <input
              type="date"
              name="from"
              defaultValue={range.from}
              className="h-8 rounded-md border bg-background px-2.5 text-xs"
            />
          </label>
          <label className="grid gap-0.5 text-xs font-medium">
            To
            <input
              type="date"
              name="to"
              defaultValue={range.to}
              className="h-8 rounded-md border bg-background px-2.5 text-xs"
            />
          </label>
          <div className="flex gap-2">
            <Button type="submit" size="sm" className="h-8 px-3">
              Apply range
            </Button>
            <Button asChild type="button" variant="outline" size="sm" className="h-8 px-3">
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
      <div className="p-4">
        {!validationMessage && data.length === 0 ? (
          <div className="grid min-h-40 place-items-center text-center text-sm text-muted-foreground">
            No doctor or patient creation activity was recorded for this range.
          </div>
        ) : null}
        {data.length > 0 && <TrendChart data={data} />}
      </div>
    </section>
  );
}

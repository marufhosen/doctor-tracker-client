import type { DashboardTrends } from "@/lib/api/schemas/dashboard";

export type CombinedTrendPoint = {
  date: string;
  doctors: number;
  patients: number;
};

export function combineTrendSeries(trends: DashboardTrends): CombinedTrendPoint[] {
  const points = new Map<string, CombinedTrendPoint>();

  for (const point of trends.doctors) {
    points.set(point.date, { date: point.date, doctors: point.count, patients: 0 });
  }
  for (const point of trends.patients) {
    const current = points.get(point.date) ?? { date: point.date, doctors: 0, patients: 0 };
    points.set(point.date, { ...current, patients: point.count });
  }

  return [...points.values()].sort((left, right) => left.date.localeCompare(right.date));
}

export function formatTrendDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00.000Z`));
}

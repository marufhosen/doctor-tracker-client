import { expect, test } from "bun:test";

import { combineTrendSeries, formatTrendDate } from "@/components/dashboard/trend-chart.core";

test("combines sparse series in UTC date order without dropping zeros", () => {
  expect(
    combineTrendSeries({
      doctors: [
        { date: "2026-11-03", count: 2 },
        { date: "2026-11-01", count: 0 },
      ],
      patients: [{ date: "2026-11-02", count: 4 }],
    }),
  ).toEqual([
    { date: "2026-11-01", doctors: 0, patients: 0 },
    { date: "2026-11-02", doctors: 0, patients: 4 },
    { date: "2026-11-03", doctors: 2, patients: 0 },
  ]);
  expect(formatTrendDate("2026-11-03")).toBe("Nov 3");
  expect(combineTrendSeries({ doctors: [], patients: [] })).toEqual([]);
});

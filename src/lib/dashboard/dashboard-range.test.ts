import { expect, test } from "bun:test";

import { parseDashboardDateRange } from "@/lib/dashboard/dashboard-range";

test("converts URL dates to inclusive UTC boundaries", () => {
  expect(parseDashboardDateRange({ from: "2026-11-01", to: "2026-11-30" })).toEqual({
    success: true,
    values: { from: "2026-11-01", to: "2026-11-30" },
    query: { from: "2026-11-01T00:00:00.000Z", to: "2026-11-30T23:59:59.999Z" },
  });
});

test("rejects malformed, repeated, and reversed URL ranges", () => {
  expect(parseDashboardDateRange({ from: "2026-12-01", to: "2026-11-01" }).success).toBe(false);
  expect(parseDashboardDateRange({ from: "not-a-date" }).success).toBe(false);
  expect(parseDashboardDateRange({ from: ["2026-11-01", "2026-11-02"] }).success).toBe(false);
});

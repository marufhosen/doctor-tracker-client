import { z } from "zod";

import type { DashboardTrendsQuery } from "@/lib/api/query";

const urlRangeSchema = z
  .object({
    from: z.iso.date().optional(),
    to: z.iso.date().optional(),
  })
  .strict()
  .refine(({ from, to }) => !from || !to || from <= to, {
    message: "From date must be before or equal to the to date.",
  });

export type DashboardDateRange =
  | {
      success: true;
      values: { from?: string | undefined; to?: string | undefined };
      query: DashboardTrendsQuery;
    }
  | {
      success: false;
      values: { from?: string | undefined; to?: string | undefined };
      message: string;
    };

export function parseDashboardDateRange(input: {
  from?: string | string[];
  to?: string | string[];
}): DashboardDateRange {
  const values = {
    ...(typeof input.from === "string" && input.from ? { from: input.from } : {}),
    ...(typeof input.to === "string" && input.to ? { to: input.to } : {}),
  };
  const parsed = urlRangeSchema.safeParse(values);

  if (!parsed.success || Array.isArray(input.from) || Array.isArray(input.to)) {
    return { success: false, values, message: "Choose a valid, ordered date range." };
  }

  return {
    success: true,
    values: parsed.data,
    query: {
      ...(parsed.data.from ? { from: `${parsed.data.from}T00:00:00.000Z` } : {}),
      ...(parsed.data.to ? { to: `${parsed.data.to}T23:59:59.999Z` } : {}),
    },
  };
}

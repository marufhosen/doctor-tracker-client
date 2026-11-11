import type { ParsedPatientListQuery } from "@/lib/api/query";
import { objectIdSchema } from "@/lib/api/schemas/common";

export type PatientListUrlParams = Record<string, string | string[] | undefined>;

const text = (value: string | string[] | undefined, maximum: number) =>
  typeof value === "string" && value.trim() ? value.trim().slice(0, maximum) : undefined;

const integer = (value: string | string[] | undefined, fallback: number, maximum: number) => {
  if (typeof value !== "string" || !/^\d+$/.test(value)) return fallback;
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed >= 1 && parsed <= maximum ? parsed : fallback;
};

const date = (value: string | string[] | undefined, endOfDay: boolean) => {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined;
  const parsed = new Date(`${value}T${endOfDay ? "23:59:59.999" : "00:00:00.000"}Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value
    ? parsed.toISOString()
    : undefined;
};

export function parsePatientListQuery(params: PatientListUrlParams): ParsedPatientListQuery {
  let createdFrom = date(params.createdFrom, false);
  let createdTo = date(params.createdTo, true);
  if (createdFrom && createdTo && createdFrom > createdTo) {
    createdFrom = undefined;
    createdTo = undefined;
  }
  const doctorId = objectIdSchema.safeParse(params.doctorId);
  const sortBy =
    typeof params.sortBy === "string" &&
    ["name", "condition", "age", "createdAt"].includes(params.sortBy)
      ? (params.sortBy as "name" | "condition" | "age" | "createdAt")
      : undefined;
  const sortOrder =
    params.sortOrder === "asc" || params.sortOrder === "desc" ? params.sortOrder : undefined;
  const search = text(params.search, 100);
  const condition = text(params.condition, 200);

  return {
    ...(search ? { search } : {}),
    ...(doctorId.success ? { doctorId: doctorId.data } : {}),
    ...(condition ? { condition } : {}),
    ...(createdFrom ? { createdFrom } : {}),
    ...(createdTo ? { createdTo } : {}),
    ...(sortBy ? { sortBy } : {}),
    ...(sortOrder ? { sortOrder } : {}),
    page: integer(params.page, 1, Number.MAX_SAFE_INTEGER),
    limit: integer(params.limit, 10, 100),
  };
}

import type { ParsedDoctorListQuery } from "@/lib/api/query";

export type DoctorListUrlParams = {
  search?: string | string[];
  specialization?: string | string[];
  hospital?: string | string[];
  createdFrom?: string | string[];
  createdTo?: string | string[];
  sortBy?: string | string[];
  sortOrder?: string | string[];
  page?: string | string[];
  limit?: string | string[];
};

const readText = (value: string | string[] | undefined, maximum: number) =>
  typeof value === "string" && value.trim() ? value.trim().slice(0, maximum) : undefined;

const readDate = (value: string | string[] | undefined, endOfDay: boolean) => {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined;
  const date = new Date(`${value}T${endOfDay ? "23:59:59.999" : "00:00:00.000"}Z`);
  return Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value
    ? undefined
    : date.toISOString();
};

const parseInteger = (value: string | string[] | undefined, fallback: number, maximum: number) => {
  if (typeof value !== "string" || !/^\d+$/.test(value)) return fallback;
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed >= 1 && parsed <= maximum ? parsed : fallback;
};

export function parseDoctorListQuery(params: DoctorListUrlParams): ParsedDoctorListQuery {
  const search = readText(params.search, 100);
  const specialization = readText(params.specialization, 120);
  const hospital = readText(params.hospital, 160);
  let createdFrom = readDate(params.createdFrom, false);
  let createdTo = readDate(params.createdTo, true);
  if (createdFrom && createdTo && createdFrom > createdTo) {
    createdFrom = undefined;
    createdTo = undefined;
  }
  const sortBy =
    typeof params.sortBy === "string" &&
    ["name", "specialization", "hospital", "createdAt"].includes(params.sortBy)
      ? (params.sortBy as "name" | "specialization" | "hospital" | "createdAt")
      : undefined;
  const sortOrder =
    params.sortOrder === "asc" || params.sortOrder === "desc" ? params.sortOrder : undefined;
  return {
    ...(search ? { search } : {}),
    ...(specialization ? { specialization } : {}),
    ...(hospital ? { hospital } : {}),
    ...(createdFrom ? { createdFrom } : {}),
    ...(createdTo ? { createdTo } : {}),
    ...(sortBy ? { sortBy } : {}),
    ...(sortOrder ? { sortOrder } : {}),
    page: parseInteger(params.page, 1, Number.MAX_SAFE_INTEGER),
    limit: parseInteger(params.limit, 10, 100),
  };
}

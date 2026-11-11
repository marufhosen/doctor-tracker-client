import type { ParsedDoctorListQuery } from "@/lib/api/query";

export type DoctorListUrlParams = {
  search?: string | string[];
  page?: string | string[];
  limit?: string | string[];
};

const parseInteger = (value: string | string[] | undefined, fallback: number, maximum: number) => {
  if (typeof value !== "string" || !/^\d+$/.test(value)) return fallback;
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed >= 1 && parsed <= maximum ? parsed : fallback;
};

export function parseDoctorListQuery(params: DoctorListUrlParams): ParsedDoctorListQuery {
  const search = typeof params.search === "string" ? params.search.trim().slice(0, 100) : "";
  return {
    ...(search ? { search } : {}),
    page: parseInteger(params.page, 1, Number.MAX_SAFE_INTEGER),
    limit: parseInteger(params.limit, 10, 100),
  };
}

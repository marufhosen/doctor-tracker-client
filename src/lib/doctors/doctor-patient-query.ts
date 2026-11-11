import type { DoctorPatientListQuery } from "@/lib/api/query";

export function parseDoctorPatientQuery(
  params: Record<string, string | string[] | undefined>,
): DoctorPatientListQuery {
  const text = (key: string, max: number) =>
    typeof params[key] === "string" && params[key].trim()
      ? params[key].trim().slice(0, max)
      : undefined;
  const integer = (key: string, fallback: number, max: number) => {
    const value = params[key];
    if (typeof value !== "string" || !/^\d+$/.test(value)) return fallback;
    const number = Number(value);
    return number >= 1 && number <= max ? number : fallback;
  };
  const sortBy = ["name", "condition", "age", "createdAt"].includes(String(params.sortBy))
    ? (params.sortBy as "name" | "condition" | "age" | "createdAt")
    : undefined;
  const sortOrder =
    params.sortOrder === "asc" || params.sortOrder === "desc" ? params.sortOrder : undefined;
  return {
    ...(text("patientSearch", 100) ? { search: text("patientSearch", 100) } : {}),
    ...(text("condition", 200) ? { condition: text("condition", 200) } : {}),
    ...(sortBy ? { sortBy } : {}),
    ...(sortOrder ? { sortOrder } : {}),
    page: integer("patientPage", 1, Number.MAX_SAFE_INTEGER),
    limit: 10,
  };
}

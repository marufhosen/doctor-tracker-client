import { z } from "zod";

import { objectIdSchema } from "@/lib/api/schemas/common";

const optionalTrimmedString = (maxLength: number) =>
  z.preprocess(
    (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
    z.string().trim().min(1).max(maxLength).optional(),
  );

const queryDateSchema = z
  .union([z.date(), z.iso.date(), z.iso.datetime({ offset: true })])
  .transform((value) => (value instanceof Date ? value : new Date(value)))
  .refine((value) => !Number.isNaN(value.getTime()), "Invalid date")
  .transform((value) => value.toISOString());

const paginationFields = {
  page: z.number().int().min(1).optional(),
  limit: z.number().int().min(1).max(100).optional(),
};

const listDateFields = {
  createdFrom: queryDateSchema.optional(),
  createdTo: queryDateSchema.optional(),
};

const hasOrderedRange = (input: {
  createdFrom?: string | undefined;
  createdTo?: string | undefined;
}): boolean => !input.createdFrom || !input.createdTo || input.createdFrom <= input.createdTo;

export const doctorListQuerySchema = z
  .object({
    search: optionalTrimmedString(100),
    specialization: optionalTrimmedString(120),
    hospital: optionalTrimmedString(160),
    ...listDateFields,
    ...paginationFields,
    sortBy: z.enum(["name", "specialization", "hospital", "createdAt"]).optional(),
    sortOrder: z.enum(["asc", "desc"]).optional(),
  })
  .strict()
  .refine(hasOrderedRange, {
    message: "createdFrom must be before or equal to createdTo",
    path: ["createdFrom"],
  });

const patientListFields = {
  search: optionalTrimmedString(100),
  condition: optionalTrimmedString(200),
  ...listDateFields,
  ...paginationFields,
  sortBy: z.enum(["name", "condition", "age", "createdAt"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
};

export const patientListQuerySchema = z
  .object({
    ...patientListFields,
    doctorId: objectIdSchema.optional(),
  })
  .strict()
  .refine(hasOrderedRange, {
    message: "createdFrom must be before or equal to createdTo",
    path: ["createdFrom"],
  });

export const doctorPatientListQuerySchema = z
  .object(patientListFields)
  .strict()
  .refine(hasOrderedRange, {
    message: "createdFrom must be before or equal to createdTo",
    path: ["createdFrom"],
  });

export const dashboardTrendsQuerySchema = z
  .object({
    from: queryDateSchema.optional(),
    to: queryDateSchema.optional(),
  })
  .strict()
  .refine(({ from, to }) => !from || !to || from <= to, {
    message: "from must be before or equal to to",
    path: ["from"],
  });

type QueryValue = string | number | undefined;

const serializeQuery = (
  query: Record<string, QueryValue>,
  keys: readonly string[],
): URLSearchParams => {
  const parameters = new URLSearchParams();

  for (const key of keys) {
    const value = query[key];

    if (value !== undefined && value !== "") {
      parameters.set(key, String(value));
    }
  }

  return parameters;
};

const doctorKeys = [
  "search",
  "specialization",
  "hospital",
  "createdFrom",
  "createdTo",
  "page",
  "limit",
  "sortBy",
  "sortOrder",
] as const;

const patientKeys = [
  "search",
  "doctorId",
  "condition",
  "createdFrom",
  "createdTo",
  "page",
  "limit",
  "sortBy",
  "sortOrder",
] as const;

export function serializeDoctorListQuery(input: unknown): URLSearchParams {
  return serializeQuery(doctorListQuerySchema.parse(input), doctorKeys);
}

export function serializePatientListQuery(input: unknown): URLSearchParams {
  return serializeQuery(patientListQuerySchema.parse(input), patientKeys);
}

export function serializeDoctorPatientListQuery(input: unknown): URLSearchParams {
  return serializeQuery(
    doctorPatientListQuerySchema.parse(input),
    patientKeys.filter((key) => key !== "doctorId"),
  );
}

export function serializeDashboardTrendsQuery(input: unknown): URLSearchParams {
  return serializeQuery(dashboardTrendsQuerySchema.parse(input), ["from", "to"]);
}

export function withQuery(path: string, parameters: URLSearchParams): string {
  const query = parameters.toString();

  return query ? `${path}?${query}` : path;
}

export type DashboardTrendsQuery = z.input<typeof dashboardTrendsQuerySchema>;
export type DoctorListQuery = z.input<typeof doctorListQuerySchema>;
export type ParsedDoctorListQuery = z.output<typeof doctorListQuerySchema>;
export type DoctorPatientListQuery = z.input<typeof doctorPatientListQuerySchema>;
export type PatientListQuery = z.input<typeof patientListQuerySchema>;
export type ParsedPatientListQuery = z.output<typeof patientListQuerySchema>;

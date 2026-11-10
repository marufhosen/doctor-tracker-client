import { z } from "zod";

import { objectIdSchema, successResponseSchema } from "@/lib/api/schemas/common";

export const dashboardSummarySchema = z
  .object({
    totalDoctors: z.number().int().nonnegative(),
    totalPatients: z.number().int().nonnegative(),
  })
  .strict();

export const doctorPatientCountSchema = z
  .object({
    doctorId: objectIdSchema,
    doctorName: z.string().min(1),
    patientCount: z.number().int().nonnegative(),
  })
  .strict();

export const dateTrendPointSchema = z
  .object({
    date: z.iso.date(),
    count: z.number().int().nonnegative(),
  })
  .strict();

export const dashboardTrendsSchema = z
  .object({
    doctors: z.array(dateTrendPointSchema),
    patients: z.array(dateTrendPointSchema),
  })
  .strict();

export const dashboardSummaryResponseSchema = successResponseSchema(
  z.object({ summary: dashboardSummarySchema }).strict(),
);
export const patientsByDoctorResponseSchema = successResponseSchema(
  z.object({ doctors: z.array(doctorPatientCountSchema) }).strict(),
);
export const dashboardTrendsResponseSchema = successResponseSchema(
  z.object({ trends: dashboardTrendsSchema }).strict(),
);

export type DashboardSummary = z.infer<typeof dashboardSummarySchema>;
export type DashboardTrends = z.infer<typeof dashboardTrendsSchema>;
export type DateTrendPoint = z.infer<typeof dateTrendPointSchema>;
export type DoctorPatientCount = z.infer<typeof doctorPatientCountSchema>;

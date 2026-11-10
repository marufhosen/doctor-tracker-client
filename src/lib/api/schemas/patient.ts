import { z } from "zod";

import {
  isoDateTimeSchema,
  objectIdSchema,
  paginatedResponseSchema,
  successResponseSchema,
} from "@/lib/api/schemas/common";

const optionalPhoneSchema = z
  .string()
  .trim()
  .regex(/^\+?[0-9][0-9 ()-]{6,19}$/)
  .max(21);

const patientFields = {
  name: z.string().trim().min(1).max(120),
  condition: z.string().trim().min(1).max(200),
  phone: optionalPhoneSchema.optional(),
  email: z.string().trim().toLowerCase().email().max(254).optional(),
  age: z.number().int().min(0).max(150).optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
  address: z.string().trim().min(1).max(500).optional(),
};

export const patientInputSchema = z.object(patientFields).strict();

export const patientUpdateSchema = z
  .object(patientFields)
  .partial()
  .strict()
  .refine((input) => Object.keys(input).length > 0, "At least one field must be provided");

export const patientSchema = patientInputSchema.extend({
  id: objectIdSchema,
  doctorId: objectIdSchema,
  createdAt: isoDateTimeSchema,
  updatedAt: isoDateTimeSchema,
});

export const patientResponseSchema = successResponseSchema(
  z.object({ patient: patientSchema }).strict(),
);
export const patientListResponseSchema = paginatedResponseSchema(patientSchema);

export type Patient = z.infer<typeof patientSchema>;
export type PatientInput = z.infer<typeof patientInputSchema>;
export type PatientListResponse = z.infer<typeof patientListResponseSchema>;
export type PatientResponse = z.infer<typeof patientResponseSchema>;
export type PatientUpdate = z.infer<typeof patientUpdateSchema>;

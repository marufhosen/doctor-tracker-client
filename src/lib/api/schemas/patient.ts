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
  .regex(/^\+?[0-9][0-9 ()-]{6,19}$/, "Enter a valid phone number.")
  .max(21, "Phone number must be 21 characters or fewer.");

const patientFields = {
  name: z
    .string()
    .trim()
    .min(1, "Enter the patient's full name.")
    .max(120, "Full name must be 120 characters or fewer."),
  condition: z
    .string()
    .trim()
    .min(1, "Enter the patient's condition.")
    .max(200, "Condition must be 200 characters or fewer."),
  phone: optionalPhoneSchema.optional(),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Enter a valid email address.")
    .max(254, "Email address must be 254 characters or fewer.")
    .optional(),
  age: z
    .number({ error: "Enter a valid age." })
    .int("Age must be a whole number.")
    .min(0, "Age cannot be negative.")
    .max(150, "Age must be 150 or less.")
    .optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"], { error: "Select a valid gender." }).optional(),
  address: z
    .string()
    .trim()
    .min(1, "Enter an address or leave the field empty.")
    .max(500, "Address must be 500 characters or fewer.")
    .optional(),
};

export const patientInputSchema = z.object(patientFields).strict();

export const patientUpdateSchema = z
  .object(patientFields)
  .partial()
  .strict()
  .refine((input) => Object.keys(input).length > 0, "Make at least one change before saving.");

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

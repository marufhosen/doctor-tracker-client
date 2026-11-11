import { z } from "zod";

import {
  isoDateTimeSchema,
  objectIdSchema,
  paginatedResponseSchema,
  successResponseSchema,
} from "@/lib/api/schemas/common";

const phoneSchema = z
  .string()
  .trim()
  .min(1, "Enter a phone number.")
  .regex(/^\+?[0-9][0-9 ()-]{6,19}$/, "Enter a valid phone number.")
  .max(21, "Phone number must be 21 characters or fewer.");

export const doctorInputSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Enter the doctor's full name.")
      .max(120, "Full name must be 120 characters or fewer."),
    specialization: z
      .string()
      .trim()
      .min(1, "Enter a specialization.")
      .max(120, "Specialization must be 120 characters or fewer."),
    hospital: z
      .string()
      .trim()
      .min(1, "Enter a hospital or clinic.")
      .max(160, "Hospital name must be 160 characters or fewer."),
    phone: phoneSchema,
    email: z
      .string()
      .trim()
      .min(1, "Enter an email address.")
      .toLowerCase()
      .email("Enter a valid email address.")
      .max(254, "Email address must be 254 characters or fewer."),
  })
  .strict();

export const doctorSchema = doctorInputSchema.extend({
  id: objectIdSchema,
  createdBy: objectIdSchema.optional(),
  createdAt: isoDateTimeSchema,
  updatedAt: isoDateTimeSchema,
});

export const doctorResponseSchema = successResponseSchema(
  z.object({ doctor: doctorSchema }).strict(),
);
export const doctorListResponseSchema = paginatedResponseSchema(doctorSchema);

export type Doctor = z.infer<typeof doctorSchema>;
export type DoctorInput = z.infer<typeof doctorInputSchema>;
export type DoctorListResponse = z.infer<typeof doctorListResponseSchema>;
export type DoctorResponse = z.infer<typeof doctorResponseSchema>;

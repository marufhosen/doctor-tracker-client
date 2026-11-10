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
  .regex(/^\+?[0-9][0-9 ()-]{6,19}$/)
  .max(21);

export const doctorInputSchema = z
  .object({
    name: z.string().trim().min(1).max(120),
    specialization: z.string().trim().min(1).max(120),
    hospital: z.string().trim().min(1).max(160),
    phone: phoneSchema,
    email: z.string().trim().toLowerCase().email().max(254),
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

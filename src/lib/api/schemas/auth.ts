import { z } from "zod";

import { objectIdSchema, successResponseSchema } from "@/lib/api/schemas/common";

export const userRoleSchema = z.enum(["ADMIN", "USER"]);

export const userSchema = z
  .object({
    id: objectIdSchema,
    name: z.string().min(1),
    email: z.string().email(),
    role: userRoleSchema,
  })
  .strict();

export const loginInputSchema = z
  .object({
    email: z.string().trim().toLowerCase().email(),
    password: z.string().min(1).max(256),
    rememberMe: z.boolean().default(false),
  })
  .strict();

export const userResponseSchema = successResponseSchema(z.object({ user: userSchema }).strict());

export type LoginInput = z.infer<typeof loginInputSchema>;
export type User = z.infer<typeof userSchema>;
export type UserResponse = z.infer<typeof userResponseSchema>;

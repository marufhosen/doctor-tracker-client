import { z } from "zod";

export const objectIdSchema = z.string().regex(/^[a-f\d]{24}$/i, "Invalid identifier");
export const isoDateTimeSchema = z.iso.datetime({ offset: true });

export const paginationMetaSchema = z
  .object({
    page: z.number().int().min(1),
    limit: z.number().int().min(1).max(100),
    total: z.number().int().nonnegative(),
    totalPages: z.number().int().nonnegative(),
  })
  .strict();

export const apiErrorResponseSchema = z
  .object({
    success: z.literal(false),
    message: z.string().min(1),
    error: z
      .object({
        code: z.string().min(1),
        details: z.unknown().optional(),
      })
      .strict(),
  })
  .strict();

export const successResponseSchema = <DataSchema extends z.ZodType>(dataSchema: DataSchema) =>
  z
    .object({
      success: z.literal(true),
      message: z.string().min(1),
      data: dataSchema,
    })
    .strict();

export const paginatedResponseSchema = <ItemSchema extends z.ZodType>(itemSchema: ItemSchema) =>
  successResponseSchema(z.array(itemSchema)).extend({
    meta: paginationMetaSchema,
  });

export const nullResponseSchema = successResponseSchema(z.null());

export type ApiErrorResponse = z.infer<typeof apiErrorResponseSchema>;
export type PaginationMeta = z.infer<typeof paginationMetaSchema>;

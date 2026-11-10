import { z } from "zod";

const apiBaseUrlSchema = z
  .string()
  .trim()
  .url("API_BASE_URL must be an absolute URL")
  .transform((value) => new URL(value))
  .refine(
    (url) => url.protocol === "http:" || url.protocol === "https:",
    "API_BASE_URL must use HTTP or HTTPS",
  )
  .refine(
    (url) => url.username === "" && url.password === "",
    "API_BASE_URL must not contain credentials",
  )
  .refine(
    (url) => url.search === "" && url.hash === "",
    "API_BASE_URL must not contain a query or hash",
  )
  .transform((url) => url.toString().replace(/\/+$/, ""));

const serverEnvironmentSchema = z.object({
  API_BASE_URL: apiBaseUrlSchema,
});

export function parseServerEnvironment(input: {
  API_BASE_URL: string | undefined;
}): z.infer<typeof serverEnvironmentSchema> {
  const result = serverEnvironmentSchema.safeParse(input);

  if (!result.success) {
    const invalidVariables = result.error.issues
      .map((issue) => issue.path.join("."))
      .filter(Boolean)
      .join(", ");

    throw new Error(`Invalid server environment configuration: ${invalidVariables}`);
  }

  return result.data;
}

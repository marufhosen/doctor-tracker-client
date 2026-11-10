import { type SafeApiError, toSafeApiError } from "@/lib/api/errors";
import type { LoginInput, User } from "@/lib/api/schemas/auth";
import { loginInputSchema } from "@/lib/api/schemas/auth";

export type LoginActionResult =
  | { success: true; user: User }
  | { success: false; error: SafeApiError };

interface LoginDependencies {
  login(input: LoginInput, origin: string): Promise<{ user: User; headers: Headers }>;
  synchronizeCookies(headers: Headers): Promise<number>;
}

const validationError = (issues: Array<{ path: PropertyKey[]; message: string }>): SafeApiError => {
  const fieldErrors: Record<string, string[]> = {};
  for (const issue of issues) {
    const field = issue.path.join(".") || "form";
    fieldErrors[field] = [...(fieldErrors[field] ?? []), issue.message];
  }
  return {
    kind: "validation",
    message: "Please review the highlighted fields.",
    fieldErrors,
  };
};

export async function performLogin(
  input: unknown,
  origin: string,
  dependencies: LoginDependencies,
): Promise<LoginActionResult> {
  const parsed = loginInputSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: validationError(parsed.error.issues) };

  try {
    const result = await dependencies.login(parsed.data, origin);
    if (result.user.role !== "ADMIN") {
      return {
        success: false,
        error: {
          kind: "forbidden",
          message: "This portal is available to administrators only.",
        },
      };
    }

    const synchronized = await dependencies.synchronizeCookies(result.headers);
    if (synchronized !== 3) throw new Error("Authentication cookies were not returned");

    return { success: true, user: result.user };
  } catch (error) {
    const safeError = toSafeApiError(error);
    if (safeError.code === "INVALID_CREDENTIALS") {
      return {
        success: false,
        error: { ...safeError, message: "Email or password is incorrect." },
      };
    }
    return { success: false, error: safeError };
  }
}

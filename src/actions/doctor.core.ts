import { toSafeApiError } from "@/lib/api/errors";
import { type Doctor, type DoctorInput, doctorInputSchema } from "@/lib/api/schemas/doctor";
import type { SessionState } from "@/lib/auth/session.core";

export type DoctorActionResult =
  | { success: true; doctorId: string }
  | { success: false; message: string; fieldErrors?: Partial<Record<keyof DoctorInput, string>> };

export async function performCreateDoctor(
  input: unknown,
  session: SessionState,
  create: (input: DoctorInput) => Promise<Doctor>,
): Promise<DoctorActionResult> {
  const parsed = doctorInputSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Partial<Record<keyof DoctorInput, string>> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0];
      if (typeof field === "string" && !(field in fieldErrors)) {
        fieldErrors[field as keyof DoctorInput] = issue.message;
      }
    }
    return { success: false, message: "Please review the highlighted fields.", fieldErrors };
  }
  if (session.status !== "authenticated") {
    return { success: false, message: "Your session has expired. Please sign in again." };
  }
  if (session.user.role !== "ADMIN") {
    return { success: false, message: "You do not have permission to create doctors." };
  }
  try {
    return { success: true, doctorId: (await create(parsed.data)).id };
  } catch (error) {
    const safe = toSafeApiError(error);
    const fieldErrors = safe.fieldErrors
      ? Object.fromEntries(
          Object.entries(safe.fieldErrors).map(([key, messages]) => [key, messages[0]]),
        )
      : undefined;
    return { success: false, message: safe.message, ...(fieldErrors ? { fieldErrors } : {}) };
  }
}

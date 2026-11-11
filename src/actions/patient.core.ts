import { toSafeApiError } from "@/lib/api/errors";
import { objectIdSchema } from "@/lib/api/schemas/common";
import { type Patient, type PatientUpdate, patientUpdateSchema } from "@/lib/api/schemas/patient";
import type { SessionState } from "@/lib/auth/session.core";

export type PatientActionResult =
  | { success: true; patient?: Patient }
  | { success: false; message: string; fieldErrors?: Record<string, string[]> };
const isAdmin = (session: SessionState) =>
  session.status === "authenticated" && session.user.role === "ADMIN";

export async function performUpdatePatient(
  patientId: unknown,
  input: unknown,
  session: SessionState,
  update: (id: string, changes: PatientUpdate) => Promise<Patient>,
): Promise<PatientActionResult> {
  const id = objectIdSchema.safeParse(patientId);
  const changes = patientUpdateSchema.safeParse(input);
  if (!id.success) return { success: false, message: "Patient selection is invalid." };
  if (!changes.success)
    return {
      success: false,
      message: "Patient changes are invalid.",
      fieldErrors: changes.error.flatten().fieldErrors,
    };
  if (!isAdmin(session))
    return { success: false, message: "You do not have permission to update patients." };
  try {
    return { success: true, patient: await update(id.data, changes.data) };
  } catch (error) {
    const safe = toSafeApiError(error);
    return {
      success: false,
      message: safe.message,
      ...(safe.fieldErrors ? { fieldErrors: safe.fieldErrors } : {}),
    };
  }
}

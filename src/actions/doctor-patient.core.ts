import { toSafeApiError } from "@/lib/api/errors";
import { objectIdSchema } from "@/lib/api/schemas/common";
import { type Patient, type PatientInput, patientInputSchema } from "@/lib/api/schemas/patient";
import type { SessionState } from "@/lib/auth/session.core";

export type PatientMutationResult = { success: true } | { success: false; message: string };
export type CreatePatientResult =
  | { success: true; patientId: string }
  | { success: false; message: string; fieldErrors?: Record<string, string[]> };
const isAdmin = (session: SessionState) =>
  session.status === "authenticated" && session.user.role === "ADMIN";

export async function performCreateDoctorPatient(
  doctorId: unknown,
  input: unknown,
  session: SessionState,
  create: (doctorId: string, input: PatientInput) => Promise<Patient>,
): Promise<CreatePatientResult> {
  const id = objectIdSchema.safeParse(doctorId);
  const patient = patientInputSchema.safeParse(input);
  if (!id.success) return { success: false, message: "Doctor selection is invalid." };
  if (!patient.success)
    return {
      success: false,
      message: "Patient details are invalid.",
      fieldErrors: patient.error.flatten().fieldErrors,
    };
  if (!isAdmin(session))
    return { success: false, message: "You do not have permission to add patients." };
  try {
    const created = await create(id.data, patient.data);
    return { success: true, patientId: created.id };
  } catch (error) {
    return { success: false, message: toSafeApiError(error).message };
  }
}

export async function performRemoveDoctorPatient(
  doctorId: unknown,
  patientId: unknown,
  session: SessionState,
  remove: (doctorId: string, patientId: string) => Promise<void>,
): Promise<PatientMutationResult> {
  const doctor = objectIdSchema.safeParse(doctorId);
  const patient = objectIdSchema.safeParse(patientId);
  if (!doctor.success || !patient.success)
    return { success: false, message: "Patient selection is invalid." };
  if (!isAdmin(session))
    return { success: false, message: "You do not have permission to remove patients." };
  try {
    await remove(doctor.data, patient.data);
    return { success: true };
  } catch (error) {
    return { success: false, message: toSafeApiError(error).message };
  }
}

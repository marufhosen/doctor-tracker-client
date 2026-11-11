"use server";

import { revalidatePath } from "next/cache";
import {
  type DeletePatientResult,
  type PatientActionResult,
  performDeletePatient,
  performUpdatePatient,
} from "@/actions/patient.core";
import { authenticatedActionRequest } from "@/lib/api/authenticated-action.server";
import { apiEndpoints } from "@/lib/api/endpoints";
import { nullResponseSchema } from "@/lib/api/schemas/common";
import { type PatientUpdate, patientResponseSchema } from "@/lib/api/schemas/patient";
import { getSession } from "@/lib/auth/session.server";

export async function deletePatientAction(patientId: string): Promise<DeletePatientResult> {
  const result = await performDeletePatient(patientId, await getSession(), async (id) => {
    const current = await authenticatedActionRequest({
      path: apiEndpoints.patients.detail(id),
      cache: "no-store",
      responseSchema: patientResponseSchema,
    });
    await authenticatedActionRequest({
      path: apiEndpoints.patients.detail(id),
      method: "DELETE",
      responseSchema: nullResponseSchema,
    });
    return current.data.data.patient.doctorId;
  });
  if (result.success) {
    revalidatePath("/patients");
    revalidatePath("/doctors");
    revalidatePath("/dashboard");
    if (result.doctorId) revalidatePath(`/doctors/${result.doctorId}`);
  }
  return result;
}

export async function updatePatientAction(
  patientId: string,
  input: unknown,
): Promise<PatientActionResult> {
  const result = await performUpdatePatient(
    patientId,
    input,
    await getSession(),
    async (id, changes: PatientUpdate) => {
      const response = await authenticatedActionRequest({
        path: apiEndpoints.patients.detail(id),
        method: "PATCH",
        body: changes,
        responseSchema: patientResponseSchema,
      });
      return response.data.data.patient;
    },
  );
  if (result.success && result.patient) {
    revalidatePath(`/patients/${result.patient.id}`);
    revalidatePath(`/doctors/${result.patient.doctorId}`);
    revalidatePath("/patients");
    revalidatePath("/doctors");
    revalidatePath("/dashboard");
  }
  return result;
}

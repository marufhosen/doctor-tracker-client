"use server";

import { revalidatePath } from "next/cache";
import {
  type DeletePatientResult,
  type PatientActionResult,
  performDeletePatient,
  performUpdatePatient,
} from "@/actions/patient.core";
import { apiClient } from "@/lib/api/client.server";
import { apiEndpoints } from "@/lib/api/endpoints";
import { nullResponseSchema } from "@/lib/api/schemas/common";
import { type PatientUpdate, patientResponseSchema } from "@/lib/api/schemas/patient";
import { getAuthCookies } from "@/lib/auth/cookies.server";
import { getTrustedRequestOrigin } from "@/lib/auth/origin.server";
import { getSession } from "@/lib/auth/session.server";

async function mutationContext() {
  const cookies = await getAuthCookies();
  const csrf = cookies.doctor_tracker_csrf;
  if (!csrf) throw new Error("CSRF token is required");
  return { cookies, headers: { Origin: await getTrustedRequestOrigin(), "X-CSRF-Token": csrf } };
}

export async function deletePatientAction(patientId: string): Promise<DeletePatientResult> {
  const result = await performDeletePatient(patientId, await getSession(), async (id) => {
    const context = await mutationContext();
    const current = await apiClient.request({
      path: apiEndpoints.patients.detail(id),
      cookies: context.cookies,
      cache: "no-store",
      responseSchema: patientResponseSchema,
    });
    await apiClient.request({
      path: apiEndpoints.patients.detail(id),
      method: "DELETE",
      ...context,
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
      const response = await apiClient.request({
        path: apiEndpoints.patients.detail(id),
        method: "PATCH",
        body: changes,
        ...(await mutationContext()),
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

"use server";

import { revalidatePath } from "next/cache";
import {
  type CreatePatientResult,
  type PatientMutationResult,
  performCreateDoctorPatient,
  performRemoveDoctorPatient,
} from "@/actions/doctor-patient.core";
import { apiClient } from "@/lib/api/client.server";
import { apiEndpoints } from "@/lib/api/endpoints";
import { nullResponseSchema } from "@/lib/api/schemas/common";
import { type PatientInput, patientResponseSchema } from "@/lib/api/schemas/patient";
import { getAuthCookies } from "@/lib/auth/cookies.server";
import { getTrustedRequestOrigin } from "@/lib/auth/origin.server";
import { getSession } from "@/lib/auth/session.server";

async function context() {
  const cookies = await getAuthCookies();
  const csrf = cookies.doctor_tracker_csrf;
  if (!csrf) throw new Error("CSRF token is required");
  return { cookies, headers: { Origin: await getTrustedRequestOrigin(), "X-CSRF-Token": csrf } };
}
function refresh(doctorId: string) {
  revalidatePath(`/doctors/${doctorId}`);
  revalidatePath("/doctors");
  revalidatePath("/patients");
  revalidatePath("/dashboard");
}

export async function createDoctorPatientAction(
  doctorId: string,
  input: unknown,
): Promise<CreatePatientResult> {
  const result = await performCreateDoctorPatient(
    doctorId,
    input,
    await getSession(),
    async (id, patient: PatientInput) => {
      const response = await apiClient.request({
        path: apiEndpoints.doctors.patients(id),
        method: "POST",
        body: patient,
        ...(await context()),
        responseSchema: patientResponseSchema,
      });
      return response.data.data.patient;
    },
  );
  if (result.success) refresh(doctorId);
  return result;
}
export async function removeDoctorPatientAction(
  doctorId: string,
  patientId: string,
): Promise<PatientMutationResult> {
  const result = await performRemoveDoctorPatient(
    doctorId,
    patientId,
    await getSession(),
    async (id, targetId) => {
      await apiClient.request({
        path: apiEndpoints.doctors.patient(id, targetId),
        method: "DELETE",
        ...(await context()),
        responseSchema: nullResponseSchema,
      });
    },
  );
  if (result.success) refresh(doctorId);
  return result;
}

"use server";

import { revalidatePath } from "next/cache";
import {
  type CreatePatientResult,
  type PatientMutationResult,
  performCreateDoctorPatient,
  performRemoveDoctorPatient,
} from "@/actions/doctor-patient.core";
import { authenticatedActionRequest } from "@/lib/api/authenticated-action.server";
import { apiEndpoints } from "@/lib/api/endpoints";
import { nullResponseSchema } from "@/lib/api/schemas/common";
import { type PatientInput, patientResponseSchema } from "@/lib/api/schemas/patient";
import { getSession } from "@/lib/auth/session.server";

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
      const response = await authenticatedActionRequest({
        path: apiEndpoints.doctors.patients(id),
        method: "POST",
        body: patient,
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
      await authenticatedActionRequest({
        path: apiEndpoints.doctors.patient(id, targetId),
        method: "DELETE",
        responseSchema: nullResponseSchema,
      });
    },
  );
  if (result.success) refresh(doctorId);
  return result;
}

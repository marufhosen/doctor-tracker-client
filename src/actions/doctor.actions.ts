"use server";

import { revalidatePath } from "next/cache";

import { type DoctorActionResult, performCreateDoctor } from "@/actions/doctor.core";
import { authenticatedActionRequest } from "@/lib/api/authenticated-action.server";
import { apiEndpoints } from "@/lib/api/endpoints";
import { type DoctorInput, doctorResponseSchema } from "@/lib/api/schemas/doctor";
import { getSession } from "@/lib/auth/session.server";

export async function createDoctorAction(input: unknown): Promise<DoctorActionResult> {
  const result = await performCreateDoctor(
    input,
    await getSession(),
    async (doctorInput: DoctorInput) => {
      const response = await authenticatedActionRequest({
        path: apiEndpoints.doctors.create,
        method: "POST",
        body: doctorInput,
        responseSchema: doctorResponseSchema,
      });
      return response.data.data.doctor;
    },
  );
  if (result.success) {
    revalidatePath("/doctors");
    revalidatePath("/dashboard");
  }
  return result;
}

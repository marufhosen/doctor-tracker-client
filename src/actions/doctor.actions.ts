"use server";

import { revalidatePath } from "next/cache";

import { type DoctorActionResult, performCreateDoctor } from "@/actions/doctor.core";
import { apiClient } from "@/lib/api/client.server";
import { apiEndpoints } from "@/lib/api/endpoints";
import { type DoctorInput, doctorResponseSchema } from "@/lib/api/schemas/doctor";
import { getAuthCookies } from "@/lib/auth/cookies.server";
import { getTrustedRequestOrigin } from "@/lib/auth/origin.server";
import { getSession } from "@/lib/auth/session.server";

export async function createDoctorAction(input: unknown): Promise<DoctorActionResult> {
  const result = await performCreateDoctor(
    input,
    await getSession(),
    async (doctorInput: DoctorInput) => {
      const cookies = await getAuthCookies();
      const csrfToken = cookies.doctor_tracker_csrf;
      if (!csrfToken) throw new Error("CSRF token is required");
      const response = await apiClient.request({
        path: apiEndpoints.doctors.create,
        method: "POST",
        body: doctorInput,
        cookies,
        headers: { Origin: await getTrustedRequestOrigin(), "X-CSRF-Token": csrfToken },
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

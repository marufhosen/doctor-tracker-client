import type { ApiClient } from "@/lib/api/client.core";
import type { AuthCookies } from "@/lib/api/cookies";
import { apiEndpoints } from "@/lib/api/endpoints";
import {
  type DashboardSummary,
  type DoctorPatientCount,
  dashboardSummaryResponseSchema,
  patientsByDoctorResponseSchema,
} from "@/lib/api/schemas/dashboard";

export async function loadDashboardSummary(
  client: ApiClient,
  cookies: AuthCookies,
): Promise<DashboardSummary> {
  const response = await client.request({
    path: apiEndpoints.dashboard.summary,
    cookies,
    cache: "no-store",
    responseSchema: dashboardSummaryResponseSchema,
  });

  return response.data.data.summary;
}

export async function loadPatientsByDoctor(
  client: ApiClient,
  cookies: AuthCookies,
): Promise<DoctorPatientCount[]> {
  const response = await client.request({
    path: apiEndpoints.dashboard.patientsByDoctor,
    cookies,
    cache: "no-store",
    responseSchema: patientsByDoctorResponseSchema,
  });

  return response.data.data.doctors;
}

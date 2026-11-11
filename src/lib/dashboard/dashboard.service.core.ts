import type { ApiClient } from "@/lib/api/client.core";
import type { AuthCookies } from "@/lib/api/cookies";
import { apiEndpoints } from "@/lib/api/endpoints";
import {
  type DashboardTrendsQuery,
  serializeDashboardTrendsQuery,
  withQuery,
} from "@/lib/api/query";
import {
  type DashboardSummary,
  type DashboardTrends,
  type DoctorPatientCount,
  dashboardSummaryResponseSchema,
  dashboardTrendsResponseSchema,
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

export async function loadDashboardTrends(
  client: ApiClient,
  cookies: AuthCookies,
  query: DashboardTrendsQuery,
): Promise<DashboardTrends> {
  const parameters = serializeDashboardTrendsQuery(query);
  const response = await client.request({
    path: withQuery(apiEndpoints.dashboard.trends, parameters),
    cookies,
    cache: "no-store",
    responseSchema: dashboardTrendsResponseSchema,
  });

  return response.data.data.trends;
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

import type { ApiClient } from "@/lib/api/client.core";
import type { AuthCookies } from "@/lib/api/cookies";
import { apiEndpoints } from "@/lib/api/endpoints";
import { type PatientListQuery, serializePatientListQuery, withQuery } from "@/lib/api/query";
import { patientListResponseSchema } from "@/lib/api/schemas/patient";

export async function loadPatientList(
  client: ApiClient,
  cookies: AuthCookies,
  query: PatientListQuery,
) {
  const response = await client.request({
    path: withQuery(apiEndpoints.patients.list, serializePatientListQuery(query)),
    cookies,
    cache: "no-store",
    responseSchema: patientListResponseSchema,
  });
  return { patients: response.data.data, meta: response.data.meta };
}

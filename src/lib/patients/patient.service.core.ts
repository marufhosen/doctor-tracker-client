import type { ApiClient } from "@/lib/api/client.core";
import type { AuthCookies } from "@/lib/api/cookies";
import { apiEndpoints } from "@/lib/api/endpoints";
import { type PatientListQuery, serializePatientListQuery, withQuery } from "@/lib/api/query";
import { objectIdSchema } from "@/lib/api/schemas/common";
import { patientListResponseSchema, patientResponseSchema } from "@/lib/api/schemas/patient";

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

export async function loadPatientDetail(
  client: ApiClient,
  cookies: AuthCookies,
  patientId: string,
) {
  const id = objectIdSchema.parse(patientId);
  const response = await client.request({
    path: apiEndpoints.patients.detail(id),
    cookies,
    cache: "no-store",
    responseSchema: patientResponseSchema,
  });
  return response.data.data.patient;
}

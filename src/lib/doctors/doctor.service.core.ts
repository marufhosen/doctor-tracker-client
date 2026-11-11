import type { ApiClient } from "@/lib/api/client.core";
import type { AuthCookies } from "@/lib/api/cookies";
import { apiEndpoints } from "@/lib/api/endpoints";
import { type DoctorListQuery, serializeDoctorListQuery, withQuery } from "@/lib/api/query";
import { doctorListResponseSchema } from "@/lib/api/schemas/doctor";

export async function loadDoctorList(
  client: ApiClient,
  cookies: AuthCookies,
  query: DoctorListQuery,
) {
  const response = await client.request({
    path: withQuery(apiEndpoints.doctors.list, serializeDoctorListQuery(query)),
    cookies,
    cache: "no-store",
    responseSchema: doctorListResponseSchema,
  });

  return { doctors: response.data.data, meta: response.data.meta };
}

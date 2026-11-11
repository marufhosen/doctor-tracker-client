import type { ApiClient } from "@/lib/api/client.core";
import type { AuthCookies } from "@/lib/api/cookies";
import { apiEndpoints } from "@/lib/api/endpoints";
import {
  type DoctorListQuery,
  type DoctorPatientListQuery,
  serializeDoctorListQuery,
  serializeDoctorPatientListQuery,
  withQuery,
} from "@/lib/api/query";
import { objectIdSchema } from "@/lib/api/schemas/common";
import { doctorListResponseSchema, doctorResponseSchema } from "@/lib/api/schemas/doctor";
import { patientListResponseSchema } from "@/lib/api/schemas/patient";

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

export async function loadDoctorPatients(
  client: ApiClient,
  cookies: AuthCookies,
  doctorId: string,
  query: DoctorPatientListQuery,
) {
  const id = objectIdSchema.parse(doctorId);
  const response = await client.request({
    path: withQuery(apiEndpoints.doctors.patients(id), serializeDoctorPatientListQuery(query)),
    cookies,
    cache: "no-store",
    responseSchema: patientListResponseSchema,
  });
  return { patients: response.data.data, meta: response.data.meta };
}

export async function loadDoctorDetail(client: ApiClient, cookies: AuthCookies, doctorId: string) {
  const id = objectIdSchema.parse(doctorId);
  const response = await client.request({
    path: apiEndpoints.doctors.detail(id),
    cookies,
    cache: "no-store",
    responseSchema: doctorResponseSchema,
  });
  return response.data.data.doctor;
}

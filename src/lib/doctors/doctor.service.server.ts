import "server-only";

import { apiClient } from "@/lib/api/client.server";
import type { DoctorListQuery } from "@/lib/api/query";
import { getAuthCookies } from "@/lib/auth/cookies.server";
import { loadDoctorList } from "@/lib/doctors/doctor.service.core";

export async function getDoctorList(query: DoctorListQuery) {
  return loadDoctorList(apiClient, await getAuthCookies(), query);
}

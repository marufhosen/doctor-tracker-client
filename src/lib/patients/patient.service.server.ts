import "server-only";

import { apiClient } from "@/lib/api/client.server";
import type { PatientListQuery } from "@/lib/api/query";
import { getAuthCookies } from "@/lib/auth/cookies.server";
import { loadPatientDetail, loadPatientList } from "@/lib/patients/patient.service.core";

export async function getPatientList(query: PatientListQuery) {
  return loadPatientList(apiClient, await getAuthCookies(), query);
}

export async function getPatientDetail(patientId: string) {
  return loadPatientDetail(apiClient, await getAuthCookies(), patientId);
}

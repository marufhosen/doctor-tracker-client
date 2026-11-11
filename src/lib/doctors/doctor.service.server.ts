import "server-only";

import { apiClient } from "@/lib/api/client.server";
import type { DoctorListQuery, DoctorPatientListQuery } from "@/lib/api/query";
import { getAuthCookies } from "@/lib/auth/cookies.server";
import {
  loadDoctorDetail,
  loadDoctorList,
  loadDoctorPatients,
} from "@/lib/doctors/doctor.service.core";

export async function getDoctorList(query: DoctorListQuery) {
  return loadDoctorList(apiClient, await getAuthCookies(), query);
}

export async function getDoctorPatients(doctorId: string, query: DoctorPatientListQuery) {
  return loadDoctorPatients(apiClient, await getAuthCookies(), doctorId, query);
}

export async function getDoctorDetail(doctorId: string) {
  return loadDoctorDetail(apiClient, await getAuthCookies(), doctorId);
}

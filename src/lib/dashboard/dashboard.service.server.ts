import "server-only";

import { apiClient } from "@/lib/api/client.server";
import { getAuthCookies } from "@/lib/auth/cookies.server";
import { loadDashboardSummary, loadPatientsByDoctor } from "@/lib/dashboard/dashboard.service.core";

export async function getDashboardSummary() {
  return loadDashboardSummary(apiClient, await getAuthCookies());
}

export async function getPatientsByDoctor() {
  return loadPatientsByDoctor(apiClient, await getAuthCookies());
}

import "server-only";

import { apiClient } from "@/lib/api/client.server";
import type { DashboardTrendsQuery } from "@/lib/api/query";
import { getAuthCookies } from "@/lib/auth/cookies.server";
import {
  loadDashboardSummary,
  loadDashboardTrends,
  loadPatientsByDoctor,
} from "@/lib/dashboard/dashboard.service.core";

export async function getDashboardSummary() {
  return loadDashboardSummary(apiClient, await getAuthCookies());
}

export async function getPatientsByDoctor() {
  return loadPatientsByDoctor(apiClient, await getAuthCookies());
}

export async function getDashboardTrends(query: DashboardTrendsQuery) {
  return loadDashboardTrends(apiClient, await getAuthCookies(), query);
}

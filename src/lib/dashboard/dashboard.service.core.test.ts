import { expect, test } from "bun:test";

import type { ApiClient } from "@/lib/api/client.core";
import { loadDashboardSummary } from "@/lib/dashboard/dashboard.service.core";

const cookies = { doctor_tracker_access: "access-token" };

test("loads a validated summary with authenticated no-store request options", async () => {
  let requestOptions: unknown;
  const client = {
    request: async (options: unknown) => {
      requestOptions = options;
      return {
        data: {
          success: true as const,
          message: "Dashboard summary retrieved successfully",
          data: { summary: { totalDoctors: 0, totalPatients: 12 } },
        },
        headers: new Headers(),
        status: 200,
      };
    },
  } as ApiClient;

  await expect(loadDashboardSummary(client, cookies)).resolves.toEqual({
    totalDoctors: 0,
    totalPatients: 12,
  });
  expect(requestOptions).toMatchObject({
    path: "dashboard/summary",
    cookies,
    cache: "no-store",
  });
});

test("preserves authentication and backend failures for the route boundary", async () => {
  for (const failure of [
    { kind: "unauthenticated", message: "Sign in required" },
    { kind: "server", message: "Unable to load dashboard data" },
  ]) {
    const client = { request: async () => Promise.reject(failure) } as unknown as ApiClient;
    await expect(loadDashboardSummary(client, cookies)).rejects.toBe(failure);
  }
});

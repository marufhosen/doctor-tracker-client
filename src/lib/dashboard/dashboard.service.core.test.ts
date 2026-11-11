import { expect, test } from "bun:test";

import type { ApiClient } from "@/lib/api/client.core";
import {
  loadDashboardSummary,
  loadDashboardTrends,
  loadPatientsByDoctor,
} from "@/lib/dashboard/dashboard.service.core";

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

test("retains doctors with zero patients in validated analytics", async () => {
  const doctors = [
    { doctorId: "507f1f77bcf86cd799439011", doctorName: "Dr. A", patientCount: 0 },
    { doctorId: "507f1f77bcf86cd799439012", doctorName: "Dr. B", patientCount: 4 },
  ];
  let requestOptions: unknown;
  const client = {
    request: async (options: unknown) => {
      requestOptions = options;
      return {
        data: {
          success: true as const,
          message: "Doctor patient analytics retrieved successfully",
          data: { doctors },
        },
        headers: new Headers(),
        status: 200,
      };
    },
  } as ApiClient;

  await expect(loadPatientsByDoctor(client, cookies)).resolves.toEqual(doctors);
  expect(requestOptions).toMatchObject({
    path: "dashboard/patients-by-doctor",
    cookies,
    cache: "no-store",
  });
});

test("normalizes trend ranges to UTC before requesting validated analytics", async () => {
  let requestedPath = "";
  const client = {
    request: async ({ path }: { path: string }) => {
      requestedPath = path;
      return {
        data: {
          success: true as const,
          message: "Dashboard trends retrieved successfully",
          data: { trends: { doctors: [], patients: [] } },
        },
        headers: new Headers(),
        status: 200,
      };
    },
  } as unknown as ApiClient;

  await loadDashboardTrends(client, cookies, {
    from: "2026-11-01T00:00:00+06:00",
    to: "2026-11-30",
  });

  expect(requestedPath).toBe(
    "dashboard/trends?from=2026-10-31T18%3A00%3A00.000Z&to=2026-11-30T00%3A00%3A00.000Z",
  );
});

test("rejects invalid and reversed ranges before reaching the backend", async () => {
  let requestCount = 0;
  const client = {
    request: async () => {
      requestCount += 1;
      throw new Error("must not run");
    },
  } as unknown as ApiClient;

  await expect(
    loadDashboardTrends(client, cookies, { from: "2026-12-01", to: "2026-11-01" }),
  ).rejects.toThrow("from must be before or equal to to");
  await expect(loadDashboardTrends(client, cookies, { from: "invalid" })).rejects.toThrow();
  expect(requestCount).toBe(0);
});

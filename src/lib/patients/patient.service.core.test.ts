import { expect, test } from "bun:test";

import type { ApiClient } from "@/lib/api/client.core";
import { loadPatientList } from "@/lib/patients/patient.service.core";

test("loads validated patient pagination with authenticated no-store isolation", async () => {
  let options: unknown;
  const client = {
    request: async (input: unknown) => {
      options = input;
      return {
        data: {
          success: true as const,
          message: "Patients retrieved successfully",
          data: [],
          meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
        },
        headers: new Headers(),
        status: 200,
      };
    },
  } as ApiClient;

  await expect(
    loadPatientList(client, { doctor_tracker_access: "access" }, { page: 1, limit: 10 }),
  ).resolves.toEqual({ patients: [], meta: { page: 1, limit: 10, total: 0, totalPages: 0 } });
  expect(options).toMatchObject({
    path: "patients?page=1&limit=10",
    cookies: { doctor_tracker_access: "access" },
    cache: "no-store",
  });
});

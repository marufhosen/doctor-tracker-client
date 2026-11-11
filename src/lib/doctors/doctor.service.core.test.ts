import { expect, test } from "bun:test";

import type { ApiClient } from "@/lib/api/client.core";
import { loadDoctorList } from "@/lib/doctors/doctor.service.core";

test("loads authenticated no-store doctors with validated pagination metadata", async () => {
  let options: unknown;
  const client = {
    request: async (input: unknown) => {
      options = input;
      return {
        data: {
          success: true as const,
          message: "Doctors retrieved successfully",
          data: [],
          meta: { page: 2, limit: 10, total: 0, totalPages: 0 },
        },
        headers: new Headers(),
        status: 200,
      };
    },
  } as ApiClient;

  await expect(
    loadDoctorList(client, { doctor_tracker_access: "access" }, { page: 2, limit: 10 }),
  ).resolves.toEqual({ doctors: [], meta: { page: 2, limit: 10, total: 0, totalPages: 0 } });
  expect(options).toMatchObject({
    path: "doctors?page=2&limit=10",
    cookies: { doctor_tracker_access: "access" },
    cache: "no-store",
  });
});

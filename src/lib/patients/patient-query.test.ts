import { expect, test } from "bun:test";

import { parsePatientListQuery } from "@/lib/patients/patient-query";

test("parses supported patient filters into a safe global listing query", () => {
  expect(
    parsePatientListQuery({
      search: " Rahim ",
      doctorId: "507f1f77bcf86cd799439011",
      condition: "Hypertension",
      createdFrom: "2026-11-01",
      createdTo: "2026-11-30",
      page: "2",
      limit: "25",
      sortBy: "createdAt",
      sortOrder: "desc",
    }),
  ).toEqual({
    search: "Rahim",
    doctorId: "507f1f77bcf86cd799439011",
    condition: "Hypertension",
    createdFrom: "2026-11-01T00:00:00.000Z",
    createdTo: "2026-11-30T23:59:59.999Z",
    page: 2,
    limit: 25,
    sortBy: "createdAt",
    sortOrder: "desc",
  });
});

test("falls back safely for malformed filters and pagination", () => {
  expect(
    parsePatientListQuery({
      doctorId: "invalid",
      createdFrom: "2026-12-01",
      createdTo: "2026-11-01",
      page: "0",
      limit: "101",
      sortBy: "doctorId",
      search: ["one", "two"],
    }),
  ).toEqual({ page: 1, limit: 10 });
});

import { expect, test } from "bun:test";

import {
  serializeDashboardTrendsQuery,
  serializeDoctorListQuery,
  serializeDoctorPatientListQuery,
  serializePatientListQuery,
  withQuery,
} from "@/lib/api/query";

test("serializes doctor filters in stable API order and omits blanks", () => {
  const parameters = serializeDoctorListQuery({
    search: "  Samira Khan  ",
    specialization: " ",
    hospital: "City & General",
    page: 2,
    limit: 25,
    sortBy: "name",
    sortOrder: "asc",
  });

  expect(parameters.toString()).toBe(
    "search=Samira+Khan&hospital=City+%26+General&page=2&limit=25&sortBy=name&sortOrder=asc",
  );
  expect(withQuery("doctors", parameters)).toBe(
    "doctors?search=Samira+Khan&hospital=City+%26+General&page=2&limit=25&sortBy=name&sortOrder=asc",
  );
});

test("normalizes list and trend dates to UTC ISO strings", () => {
  expect(
    serializePatientListQuery({
      createdFrom: "2026-11-01",
      createdTo: new Date("2026-11-30T23:59:59.999Z"),
    }).toString(),
  ).toBe("createdFrom=2026-11-01T00%3A00%3A00.000Z&createdTo=2026-11-30T23%3A59%3A59.999Z");
  expect(
    serializeDashboardTrendsQuery({
      from: "2026-11-01T00:00:00+06:00",
      to: "2026-11-30T23:59:59.999Z",
    }).toString(),
  ).toBe("from=2026-10-31T18%3A00%3A00.000Z&to=2026-11-30T23%3A59%3A59.999Z");
});

test("supports the global doctor filter but rejects it for nested patient lists", () => {
  const doctorId = "671000000000000000000001";
  expect(serializePatientListQuery({ doctorId }).get("doctorId")).toBe(doctorId);
  expect(() => serializeDoctorPatientListQuery({ doctorId })).toThrow();
});

test("rejects unsupported, out-of-range, and reversed query values", () => {
  expect(() => serializeDoctorListQuery({ page: 0 })).toThrow();
  expect(() => serializePatientListQuery({ limit: 101 })).toThrow();
  expect(() => serializeDoctorListQuery({ sortBy: "age" })).toThrow();
  expect(() => serializeDoctorListQuery({ unsupported: "value" })).toThrow();
  expect(() =>
    serializePatientListQuery({ createdFrom: "2026-12-01", createdTo: "2026-11-01" }),
  ).toThrow("createdFrom must be before or equal to createdTo");
});

test("does not add a question mark for an empty query", () => {
  expect(withQuery("patients", serializePatientListQuery({}))).toBe("patients");
});

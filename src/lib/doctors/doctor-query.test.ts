import { expect, test } from "bun:test";

import { parseDoctorListQuery } from "@/lib/doctors/doctor-query";

test("parses valid pagination and safely defaults invalid URL values", () => {
  expect(parseDoctorListQuery({ page: "3", limit: "25" })).toEqual({ page: 3, limit: 25 });
  expect(parseDoctorListQuery({ page: "0", limit: "101" })).toEqual({ page: 1, limit: 10 });
  expect(parseDoctorListQuery({ page: "3.5", limit: ["10", "20"] })).toEqual({
    page: 1,
    limit: 10,
  });
});

test("normalizes search while ignoring repeated or blank values", () => {
  expect(parseDoctorListQuery({ search: "  Samira Khan  " })).toEqual({
    search: "Samira Khan",
    page: 1,
    limit: 10,
  });
  expect(parseDoctorListQuery({ search: ["Samira", "Khan"] })).toEqual({ page: 1, limit: 10 });
  expect(parseDoctorListQuery({ search: "   " })).toEqual({ page: 1, limit: 10 });
});

test("parses supported filter combinations and drops invalid ranges and sorting", () => {
  expect(
    parseDoctorListQuery({
      specialization: " Cardiology ",
      hospital: "City Hospital",
      createdFrom: "2026-11-01",
      createdTo: "2026-11-30",
      sortBy: "createdAt",
      sortOrder: "desc",
    }),
  ).toMatchObject({
    specialization: "Cardiology",
    hospital: "City Hospital",
    createdFrom: "2026-11-01T00:00:00.000Z",
    createdTo: "2026-11-30T23:59:59.999Z",
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  expect(
    parseDoctorListQuery({
      createdFrom: "2026-12-01",
      createdTo: "2026-11-01",
      sortBy: "age",
      sortOrder: "sideways",
    }),
  ).toEqual({ page: 1, limit: 10 });
});

import { expect, test } from "bun:test";

import { parseDoctorPatientQuery } from "@/lib/doctors/doctor-patient-query";

test("parses doctor-scoped patient URL state without accepting a doctor override", () => {
  expect(
    parseDoctorPatientQuery({
      patientSearch: " Rahim ",
      condition: "Hypertension",
      patientPage: "2",
      sortBy: "name",
      sortOrder: "asc",
      doctorId: "other",
    }),
  ).toEqual({
    search: "Rahim",
    condition: "Hypertension",
    page: 2,
    limit: 10,
    sortBy: "name",
    sortOrder: "asc",
  });
});

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

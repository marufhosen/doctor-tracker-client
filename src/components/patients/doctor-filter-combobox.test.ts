import { describe, expect, test } from "bun:test";

import { filterDoctorOptions } from "@/components/patients/doctor-filter-combobox";

const doctors = [
  { id: "1", name: "Dr. Sarah Wilson" },
  { id: "2", name: "Dr. James Chen" },
  { id: "3", name: "Dr. Olivia Bennett" },
];

describe("filterDoctorOptions", () => {
  test("matches doctor names without case sensitivity", () => {
    expect(filterDoctorOptions(doctors, "JAMES")).toEqual([
      { id: "2", name: "Dr. James Chen" },
    ]);
  });

  test("trims search input and returns all doctors for an empty query", () => {
    expect(filterDoctorOptions(doctors, "  olivia ")).toEqual([
      { id: "3", name: "Dr. Olivia Bennett" },
    ]);
    expect(filterDoctorOptions(doctors, "   ")).toEqual(doctors);
  });
});

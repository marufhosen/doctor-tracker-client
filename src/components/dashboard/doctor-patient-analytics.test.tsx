import { expect, test } from "bun:test";
import { render, screen, within } from "@testing-library/react";

import { DoctorPatientAnalytics } from "@/components/dashboard/doctor-patient-analytics";

test("groups doctors into scalable workload bands and retains zero-patient doctors", () => {
  render(
    <DoctorPatientAnalytics
      doctors={[
        { doctorId: "507f1f77bcf86cd799439011", doctorName: "Dr. Zero", patientCount: 0 },
        { doctorId: "507f1f77bcf86cd799439012", doctorName: "Dr. Four", patientCount: 4 },
      ]}
    />,
  );

  const distribution = screen.getByRole("list", { name: "Doctor workload distribution" });
  expect(within(distribution).getByText("No patients").isConnected).toBe(true);
  expect(within(distribution).getByText("1–5 patients").isConnected).toBe(true);
  expect(within(distribution).getAllByText("1")).toHaveLength(2);
});

test("distinguishes an empty doctor collection from zero-patient data", () => {
  render(<DoctorPatientAnalytics doctors={[]} />);
  expect(
    screen.getByText("No doctors are available for patient assignment analytics yet.").isConnected,
  ).toBe(true);
  expect(screen.queryByRole("list")).toBeNull();
});

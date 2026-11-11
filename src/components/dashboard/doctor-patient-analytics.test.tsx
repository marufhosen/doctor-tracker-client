import { expect, test } from "bun:test";
import { render, screen } from "@testing-library/react";

import { DoctorAnalyticsTable } from "@/components/dashboard/doctor-patient-analytics";

test("provides a labelled data alternative and retains zero-patient doctors", () => {
  render(
    <DoctorAnalyticsTable
      doctors={[
        { doctorId: "507f1f77bcf86cd799439011", doctorName: "Dr. Zero", patientCount: 0 },
        { doctorId: "507f1f77bcf86cd799439012", doctorName: "Dr. Four", patientCount: 4 },
      ]}
    />,
  );

  expect(screen.getByRole("table", { name: "Patient count for every doctor" }).isConnected).toBe(
    true,
  );
  expect(screen.getByRole("rowheader", { name: "Dr. Zero" }).isConnected).toBe(true);
  expect(screen.getAllByRole("cell").map((cell) => cell.textContent)).toEqual(["0", "4"]);
});

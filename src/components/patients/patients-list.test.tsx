import { expect, test } from "bun:test";
import { render, screen } from "@testing-library/react";
import { PatientsList } from "@/components/patients/patients-list";

const patient = {
  id: "507f1f77bcf86cd799439011",
  doctorId: "507f1f77bcf86cd799439012",
  name: "Rahim",
  condition: "Recovery",
  createdAt: "2026-11-01T00:00:00.000Z",
  updatedAt: "2026-11-01T00:00:00.000Z",
};

test("renders responsive patient views with optional fields explicit", () => {
  render(<PatientsList patients={[patient]} />);
  expect(screen.getByRole("table", { name: "Patient directory" }).isConnected).toBe(true);
  expect(screen.getAllByRole("link", { name: "View Rahim" })).toHaveLength(2);
  expect(screen.getAllByText("Not provided").length).toBeGreaterThanOrEqual(3);
});

test("renders an explicit empty patient state", () => {
  render(<PatientsList patients={[]} />);
  expect(screen.getByRole("heading", { name: "No patients found" }).isConnected).toBe(true);
});

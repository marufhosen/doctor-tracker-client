import { expect, test } from "bun:test";
import { render, screen } from "@testing-library/react";

import { DoctorsList } from "@/components/doctors/doctors-list";

const doctor = {
  id: "507f1f77bcf86cd799439011",
  name: "Dr. Samira Khan",
  specialization: "Cardiology",
  hospital: "City Hospital",
  phone: "+880 1712-345678",
  email: "samira@example.com",
  createdAt: "2026-11-01T00:00:00.000Z",
  updatedAt: "2026-11-01T00:00:00.000Z",
};

test("renders accessible desktop and mobile doctor views with detail links", () => {
  render(<DoctorsList doctors={[doctor]} />);
  expect(screen.getByRole("table", { name: "Doctor directory" }).isConnected).toBe(true);
  expect(screen.getAllByRole("link", { name: "View Dr. Samira Khan" })).toHaveLength(2);
  expect(screen.getAllByText("Cardiology")).toHaveLength(2);
});

test("renders an explicit empty directory state", () => {
  render(<DoctorsList doctors={[]} />);
  expect(screen.getByRole("heading", { name: "No doctors found" }).isConnected).toBe(true);
});

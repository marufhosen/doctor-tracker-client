import { expect, test } from "bun:test";
import { performUpdatePatient } from "@/actions/patient.core";
import type { Patient } from "@/lib/api/schemas/patient";

const id = "507f1f77bcf86cd799439011";
const admin = {
  status: "authenticated" as const,
  user: { id, name: "Admin", email: "admin@example.com", role: "ADMIN" as const },
};
const patient: Patient = {
  id,
  doctorId: "507f1f77bcf86cd799439012",
  name: "Amina",
  condition: "Stable",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-02T00:00:00.000Z",
};

test("updates a validated patient for an administrator", async () => {
  expect(
    await performUpdatePatient(id, { condition: "Stable" }, admin, async () => patient),
  ).toEqual({ success: true, patient });
});

test("rejects doctor assignment and does not call the API", async () => {
  let called = false;
  const result = await performUpdatePatient(id, { doctorId: patient.doctorId }, admin, async () => {
    called = true;
    return patient;
  });
  expect(result.success).toBe(false);
  expect(called).toBe(false);
});

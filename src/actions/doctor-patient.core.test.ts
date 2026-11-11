import { expect, test } from "bun:test";
import {
  performCreateDoctorPatient,
  performRemoveDoctorPatient,
} from "@/actions/doctor-patient.core";
import type { Patient } from "@/lib/api/schemas/patient";

const id = "507f1f77bcf86cd799439011";
const admin = {
  status: "authenticated" as const,
  user: { id, name: "Admin", email: "admin@example.com", role: "ADMIN" as const },
};
const patient: Patient = {
  id,
  doctorId: id,
  name: "Rahim",
  condition: "Recovery",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};
test("authorizes validated doctor-scoped add and removal", async () => {
  let calls = 0;
  const create = async () => {
    calls += 1;
    return patient;
  };
  const remove = async () => {
    calls += 1;
  };
  expect(
    await performCreateDoctorPatient(
      id,
      { name: patient.name, condition: patient.condition },
      admin,
      create,
    ),
  ).toEqual({
    success: true,
    patientId: id,
  });
  expect((await performRemoveDoctorPatient(id, id, admin, remove)).success).toBe(true);
  expect(calls).toBe(2);
});
test("blocks invalid identifiers and non-admin mutations", async () => {
  let calls = 0;
  const remove = async () => {
    calls += 1;
  };
  const create = async () => {
    calls += 1;
    return patient;
  };
  expect((await performRemoveDoctorPatient("bad", id, admin, remove)).success).toBe(false);
  expect(
    (
      await performCreateDoctorPatient(
        id,
        { name: "A", condition: "B" },
        { status: "unauthenticated" },
        create,
      )
    ).success,
  ).toBe(false);
  expect(calls).toBe(0);
});
test("returns typed field errors for invalid patient input", async () => {
  const result = await performCreateDoctorPatient(
    id,
    { name: "", condition: "" },
    admin,
    async () => patient,
  );
  expect(result.success).toBe(false);
  if (!result.success) {
    expect(result.fieldErrors?.name).toBeDefined();
    expect(result.fieldErrors?.condition).toBeDefined();
  }
});

import { expect, test } from "bun:test";
import {
  performCreateDoctorPatient,
  performRemoveDoctorPatient,
} from "@/actions/doctor-patient.core";

const id = "507f1f77bcf86cd799439011";
const admin = {
  status: "authenticated" as const,
  user: { id, name: "Admin", email: "admin@example.com", role: "ADMIN" as const },
};
test("authorizes validated doctor-scoped add and removal", async () => {
  let calls = 0;
  const operation = async () => {
    calls += 1;
  };
  expect(
    (
      await performCreateDoctorPatient(
        id,
        { name: "Rahim", condition: "Recovery" },
        admin,
        operation,
      )
    ).success,
  ).toBe(true);
  expect((await performRemoveDoctorPatient(id, id, admin, operation)).success).toBe(true);
  expect(calls).toBe(2);
});
test("blocks invalid identifiers and non-admin mutations", async () => {
  let calls = 0;
  const operation = async () => {
    calls += 1;
  };
  expect((await performRemoveDoctorPatient("bad", id, admin, operation)).success).toBe(false);
  expect(
    (
      await performCreateDoctorPatient(
        id,
        { name: "A", condition: "B" },
        { status: "unauthenticated" },
        operation,
      )
    ).success,
  ).toBe(false);
  expect(calls).toBe(0);
});

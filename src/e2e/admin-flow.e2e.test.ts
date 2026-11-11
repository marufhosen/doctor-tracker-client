import { expect, test } from "bun:test";
import { performLogin } from "@/actions/auth.core";
import { performCreateDoctor } from "@/actions/doctor.core";
import { performCreateDoctorPatient } from "@/actions/doctor-patient.core";
import { performDeletePatient, performUpdatePatient } from "@/actions/patient.core";
import type { Doctor } from "@/lib/api/schemas/doctor";
import type { Patient } from "@/lib/api/schemas/patient";
import { getProxyDecision } from "@/lib/auth/proxy.core";
import { parsePatientListQuery } from "@/lib/patients/patient-query";

const adminId = "507f1f77bcf86cd799439011";
const doctorId = "507f1f77bcf86cd799439012";
const patientId = "507f1f77bcf86cd799439013";
const admin = { id: adminId, name: "Admin", email: "admin@example.com", role: "ADMIN" as const };
const adminSession = { status: "authenticated" as const, user: admin };

test("administrative journey covers authentication, navigation, doctor and patient CRUD", async () => {
  expect(getProxyDecision("/patients", false, false)).toBe("login");
  expect(getProxyDecision("/patients", false, true)).toBe("refresh");
  const login = await performLogin(
    { email: admin.email, password: "secret", rememberMe: false },
    "http://localhost:3000",
    {
      login: async () => ({ user: admin, headers: new Headers() }),
      synchronizeCookies: async () => 3,
    },
  );
  expect(login.success).toBe(true);
  expect(getProxyDecision("/patients", true, false)).toBe("continue");

  const doctor: Doctor = {
    id: doctorId,
    name: "Dr. Asha",
    specialization: "Cardiology",
    hospital: "Central Hospital",
    phone: "+8801712345678",
    email: "asha@example.com",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  };
  expect(
    await performCreateDoctor(
      {
        name: doctor.name,
        specialization: doctor.specialization,
        hospital: doctor.hospital,
        phone: doctor.phone,
        email: doctor.email,
      },
      adminSession,
      async () => doctor,
    ),
  ).toEqual({ success: true, doctorId });

  let patient: Patient = {
    id: patientId,
    doctorId,
    name: "Rahim",
    condition: "Observation",
    createdAt: "2026-01-02T00:00:00.000Z",
    updatedAt: "2026-01-02T00:00:00.000Z",
  };
  expect(
    await performCreateDoctorPatient(
      doctorId,
      { name: patient.name, condition: patient.condition },
      adminSession,
      async () => patient,
    ),
  ).toEqual({ success: true, patientId });
  expect(
    parsePatientListQuery({ search: " Rahim ", doctorId, sortBy: "name", sortOrder: "asc" }),
  ).toMatchObject({ search: "Rahim", doctorId, sortBy: "name", sortOrder: "asc" });
  expect(
    (
      await performUpdatePatient(
        patientId,
        { condition: "Stable" },
        adminSession,
        async (_id, changes) => {
          patient = {
            ...patient,
            ...changes,
            name: changes.name ?? patient.name,
            condition: changes.condition ?? patient.condition,
            updatedAt: "2026-01-03T00:00:00.000Z",
          };
          return patient;
        },
      )
    ).success,
  ).toBe(true);
  expect(await performDeletePatient(patientId, adminSession, async () => doctorId)).toEqual({
    success: true,
    doctorId,
  });
});

test("non-admin users are denied administrative mutations", async () => {
  const userSession = {
    status: "authenticated" as const,
    user: { ...admin, role: "USER" as const },
  };
  let called = false;
  const result = await performCreateDoctor(
    {
      name: "Dr. Asha",
      specialization: "Cardiology",
      hospital: "Central Hospital",
      phone: "+8801712345678",
      email: "asha@example.com",
    },
    userSession,
    async () => {
      called = true;
      throw new Error("unreachable");
    },
  );
  expect(result.success).toBe(false);
  expect(called).toBe(false);
});

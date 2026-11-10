import { expect, test } from "bun:test";

import {
  apiErrorResponseSchema,
  dashboardSummaryResponseSchema,
  dashboardTrendsResponseSchema,
  doctorListResponseSchema,
  doctorResponseSchema,
  loginInputSchema,
  nullResponseSchema,
  patientResponseSchema,
  patientsByDoctorResponseSchema,
  patientUpdateSchema,
  userResponseSchema,
} from "@/lib/api/schemas";

const id = "671000000000000000000001";
const timestamp = "2026-11-11T08:30:00.000Z";

const doctor = {
  id,
  name: "Dr. Samira Khan",
  specialization: "Cardiology",
  hospital: "City Hospital",
  phone: "+880 1712-345678",
  email: "samira@example.com",
  createdAt: timestamp,
  updatedAt: timestamp,
};

const patient = {
  id: "671000000000000000000002",
  doctorId: id,
  name: "Rahim Ahmed",
  condition: "Hypertension",
  age: 42,
  gender: "MALE",
  createdAt: timestamp,
  updatedAt: timestamp,
};

test("accepts the verified auth and error envelopes", () => {
  expect(
    userResponseSchema.safeParse({
      success: true,
      message: "Current user retrieved successfully",
      data: { user: { id, name: "Admin User", email: "admin@example.com", role: "ADMIN" } },
    }).success,
  ).toBe(true);
  expect(
    apiErrorResponseSchema.safeParse({
      success: false,
      message: "Validation failed",
      error: { code: "VALIDATION_ERROR", details: [] },
    }).success,
  ).toBe(true);
});

test("validates doctor detail and list response shapes", () => {
  expect(
    doctorResponseSchema.safeParse({
      success: true,
      message: "Doctor retrieved successfully",
      data: { doctor },
    }).success,
  ).toBe(true);
  expect(
    doctorListResponseSchema.safeParse({
      success: true,
      message: "Doctors retrieved successfully",
      data: [doctor],
      meta: { page: 1, limit: 10, total: 1, totalPages: 1 },
    }).success,
  ).toBe(true);
});

test("validates patient optional fields and rejects an empty update", () => {
  expect(
    patientResponseSchema.safeParse({
      success: true,
      message: "Patient retrieved successfully",
      data: { patient },
    }).success,
  ).toBe(true);
  expect(patientUpdateSchema.safeParse({}).success).toBe(false);
  expect(patientUpdateSchema.safeParse({ condition: "Recovered" }).success).toBe(true);
});

test("validates dashboard analytics response families", () => {
  expect(
    dashboardSummaryResponseSchema.safeParse({
      success: true,
      message: "Dashboard summary retrieved successfully",
      data: { summary: { totalDoctors: 1, totalPatients: 1 } },
    }).success,
  ).toBe(true);
  expect(
    patientsByDoctorResponseSchema.safeParse({
      success: true,
      message: "Doctor patient analytics retrieved successfully",
      data: { doctors: [{ doctorId: id, doctorName: doctor.name, patientCount: 1 }] },
    }).success,
  ).toBe(true);
  expect(
    dashboardTrendsResponseSchema.safeParse({
      success: true,
      message: "Dashboard trends retrieved successfully",
      data: { trends: { doctors: [{ date: "2026-11-11", count: 1 }], patients: [] } },
    }).success,
  ).toBe(true);
});

test("validates successful null responses", () => {
  expect(
    nullResponseSchema.safeParse({ success: true, message: "Logout successful", data: null })
      .success,
  ).toBe(true);
});

test("rejects malformed identifiers, timestamps, pages, and extra input fields", () => {
  expect(
    doctorResponseSchema.safeParse({ data: { doctor: { ...doctor, id: "bad" } } }).success,
  ).toBe(false);
  expect(
    doctorListResponseSchema.safeParse({
      success: true,
      message: "Doctors retrieved successfully",
      data: [{ ...doctor, createdAt: "yesterday" }],
      meta: { page: 0, limit: 10, total: 1, totalPages: 1 },
    }).success,
  ).toBe(false);
  expect(
    loginInputSchema.safeParse({
      email: "admin@example.com",
      password: "secret",
      rememberMe: false,
      token: "not-allowed",
    }).success,
  ).toBe(false);
});

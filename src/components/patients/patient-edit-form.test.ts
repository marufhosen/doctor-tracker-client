import { expect, test } from "bun:test";
import {
  normalizePatientUpdate,
  patientEditValues,
  validatePatientEditValues,
} from "@/components/patients/patient-edit-form.core";
import type { Patient } from "@/lib/api/schemas/patient";

const patient: Patient = {
  id: "507f1f77bcf86cd799439011",
  doctorId: "507f1f77bcf86cd799439012",
  name: "Amina",
  condition: "Recovery",
  phone: "+8801712345678",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

test("hydrates editable values without exposing doctor assignment", () => {
  expect(patientEditValues(patient)).toEqual({
    name: "Amina",
    condition: "Recovery",
    phone: "+8801712345678",
    email: "",
    age: "",
    gender: "",
    address: "",
  });
});

test("returns field-specific edit errors instead of a generic form message", () => {
  expect(
    validatePatientEditValues({
      ...patientEditValues(patient),
      name: "",
      phone: "x",
      email: "bad",
      age: "-1",
    }),
  ).toMatchObject({
    name: "Enter the patient's full name.",
    phone: "Enter a valid phone number.",
    email: "Enter a valid email address.",
    age: "Age cannot be negative.",
  });
});

test("clears optional values and normalizes age", () => {
  expect(normalizePatientUpdate({ ...patientEditValues(patient), phone: "", age: "42" })).toEqual({
    name: "Amina",
    condition: "Recovery",
    phone: undefined,
    email: undefined,
    age: 42,
    gender: undefined,
    address: undefined,
  });
});

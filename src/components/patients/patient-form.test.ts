import { expect, test } from "bun:test";
import {
  normalizePatientValues,
  validatePatientValues,
} from "@/components/patients/patient-form.core";

test("normalizes optional patient fields and age in fixed doctor context", () => {
  expect(
    normalizePatientValues({
      name: " Rahim ",
      condition: " Recovery ",
      phone: "",
      email: "",
      age: "42",
      gender: "",
      address: "",
    }),
  ).toEqual({ name: "Rahim", condition: "Recovery", age: 42 });
  expect(
    normalizePatientValues({
      name: "",
      condition: "",
      phone: "",
      email: "",
      age: "151",
      gender: "",
      address: "",
    }),
  ).toBeNull();
});

test("returns actionable errors for every invalid patient field", () => {
  expect(
    validatePatientValues({
      name: "",
      condition: "",
      phone: "invalid",
      email: "invalid",
      age: "151",
      gender: "",
      address: "",
    }),
  ).toEqual({
    name: "Enter the patient's full name.",
    condition: "Enter the patient's condition.",
    phone: "Enter a valid phone number.",
    email: "Enter a valid email address.",
    age: "Age must be 150 or less.",
  });
});

import { expect, test } from "bun:test";
import { normalizePatientValues } from "@/components/patients/patient-form.core";

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

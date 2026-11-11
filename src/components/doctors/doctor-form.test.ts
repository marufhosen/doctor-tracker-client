import { expect, test } from "bun:test";

import { validateDoctorValues } from "@/components/doctors/doctor-form";

test("validates every supported doctor field with the shared schema", () => {
  expect(
    validateDoctorValues({ name: "", specialization: "", hospital: "", phone: "x", email: "bad" }),
  ).toMatchObject({
    name: expect.any(String),
    specialization: expect.any(String),
    hospital: expect.any(String),
    phone: expect.any(String),
    email: expect.any(String),
  });
  expect(
    validateDoctorValues({
      name: "Dr. Samira Khan",
      specialization: "Cardiology",
      hospital: "City Hospital",
      phone: "+880 1712-345678",
      email: "samira@example.com",
    }),
  ).toEqual({});
});

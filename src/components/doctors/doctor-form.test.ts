import { expect, test } from "bun:test";

import { validateDoctorValues } from "@/components/doctors/doctor-form";

test("validates every supported doctor field with the shared schema", () => {
  expect(
    validateDoctorValues({ name: "", specialization: "", hospital: "", phone: "x", email: "bad" }),
  ).toMatchObject({
    name: "Enter the doctor's full name.",
    specialization: "Enter a specialization.",
    hospital: "Enter a hospital or clinic.",
    phone: "Enter a valid phone number.",
    email: "Enter a valid email address.",
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

import { type PatientInput, patientInputSchema } from "@/lib/api/schemas/patient";

export type PatientFormValues = {
  name: string;
  condition: string;
  phone: string;
  email: string;
  age: string;
  gender: "" | "MALE" | "FEMALE" | "OTHER";
  address: string;
};

const patientInputCandidate = (values: PatientFormValues) => ({
  name: values.name,
  condition: values.condition,
  ...(values.phone.trim() ? { phone: values.phone } : {}),
  ...(values.email.trim() ? { email: values.email } : {}),
  ...(values.age !== "" ? { age: Number(values.age) } : {}),
  ...(values.gender ? { gender: values.gender } : {}),
  ...(values.address.trim() ? { address: values.address } : {}),
});

export function validatePatientValues(values: PatientFormValues) {
  const parsed = patientInputSchema.safeParse(patientInputCandidate(values));
  if (parsed.success) return {};

  const errors: Partial<Record<keyof PatientFormValues, string>> = {};
  for (const issue of parsed.error.issues) {
    const field = issue.path[0];
    if (typeof field === "string" && !(field in errors)) {
      errors[field as keyof PatientFormValues] = issue.message;
    }
  }
  return errors;
}

export function normalizePatientValues(values: PatientFormValues): PatientInput | null {
  const parsed = patientInputSchema.safeParse(patientInputCandidate(values));
  return parsed.success ? parsed.data : null;
}

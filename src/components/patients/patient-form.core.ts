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
export function normalizePatientValues(values: PatientFormValues): PatientInput | null {
  const parsed = patientInputSchema.safeParse({
    name: values.name,
    condition: values.condition,
    ...(values.phone.trim() ? { phone: values.phone } : {}),
    ...(values.email.trim() ? { email: values.email } : {}),
    ...(values.age !== "" ? { age: Number(values.age) } : {}),
    ...(values.gender ? { gender: values.gender } : {}),
    ...(values.address.trim() ? { address: values.address } : {}),
  });
  return parsed.success ? parsed.data : null;
}

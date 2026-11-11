import type { Patient, PatientUpdate } from "@/lib/api/schemas/patient";
import { patientUpdateSchema } from "@/lib/api/schemas/patient";

export type PatientEditValues = {
  name: string;
  condition: string;
  phone: string;
  email: string;
  age: string;
  gender: "" | "MALE" | "FEMALE" | "OTHER";
  address: string;
};

export const patientEditValues = (patient: Patient): PatientEditValues => ({
  name: patient.name,
  condition: patient.condition,
  phone: patient.phone ?? "",
  email: patient.email ?? "",
  age: patient.age?.toString() ?? "",
  gender: patient.gender ?? "",
  address: patient.address ?? "",
});

export function normalizePatientUpdate(values: PatientEditValues): PatientUpdate | null {
  const parsed = patientUpdateSchema.safeParse({
    name: values.name.trim(),
    condition: values.condition.trim(),
    phone: values.phone.trim() || undefined,
    email: values.email.trim() || undefined,
    age: values.age === "" ? undefined : Number(values.age),
    gender: values.gender || undefined,
    address: values.address.trim() || undefined,
  });
  return parsed.success ? parsed.data : null;
}

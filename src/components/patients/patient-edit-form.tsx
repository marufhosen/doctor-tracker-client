"use client";

import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import {
  normalizePatientUpdate,
  patientEditValues,
} from "@/components/patients/patient-edit-form.core";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Patient, PatientUpdate } from "@/lib/api/schemas/patient";

type Result =
  | { success: true }
  | { success: false; message: string; fieldErrors?: Record<string, string[]> };

export function PatientEditForm({
  patient,
  updateAction,
}: {
  patient: Patient;
  updateAction: (patientId: string, input: PatientUpdate) => Promise<Result>;
}) {
  const router = useRouter();
  const formik = useFormik({
    initialValues: patientEditValues(patient),
    validate: (values) =>
      normalizePatientUpdate(values) ? {} : { name: "Review the patient details." },
    onSubmit: async (values, helpers) => {
      const input = normalizePatientUpdate(values);
      if (!input) return;
      const result = await updateAction(patient.id, input);
      if (result.success) {
        router.push(`/patients/${patient.id}`);
        router.refresh();
        return;
      }
      helpers.setStatus(result.message);
      if (result.fieldErrors)
        helpers.setErrors(
          Object.fromEntries(
            Object.entries(result.fieldErrors).map(([key, messages]) => [key, messages[0]]),
          ),
        );
    },
  });
  const fields = [
    ["name", "Full name", "text"],
    ["condition", "Condition", "text"],
    ["phone", "Phone", "tel"],
    ["email", "Email", "email"],
    ["age", "Age", "number"],
    ["address", "Address", "text"],
  ] as const;
  return (
    <form onSubmit={formik.handleSubmit} noValidate className="max-w-2xl space-y-5">
      {formik.status && (
        <p
          role="alert"
          aria-live="assertive"
          className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive"
        >
          {formik.status}
        </p>
      )}
      <div className="grid gap-5 sm:grid-cols-2">
        {fields.map(([name, label, type]) => (
          <div key={name}>
            <Label htmlFor={`patient-${name}`}>
              {label}
              {name === "name" || name === "condition" ? " *" : ""}
            </Label>
            <Input
              id={`patient-${name}`}
              name={name}
              type={type}
              value={formik.values[name]}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              aria-invalid={Boolean(formik.touched[name] && formik.errors[name])}
              className="mt-2 h-control"
              min={name === "age" ? 0 : undefined}
              max={name === "age" ? 150 : undefined}
            />
            {formik.touched[name] && formik.errors[name] && (
              <p className="mt-1 text-sm text-destructive">{formik.errors[name]}</p>
            )}
          </div>
        ))}
        <div>
          <Label htmlFor="patient-gender">Gender</Label>
          <select
            id="patient-gender"
            name="gender"
            value={formik.values.gender}
            onChange={formik.handleChange}
            className="mt-2 h-control w-full rounded-lg border bg-background px-3"
          >
            <option value="">Not provided</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="OTHER">Other</option>
          </select>
        </div>
      </div>
      <Button
        type="submit"
        disabled={!formik.dirty || formik.isSubmitting}
        className="h-control px-5"
      >
        {formik.isSubmitting ? "Saving…" : "Save changes"}
      </Button>
    </form>
  );
}

"use client";

import { useFormik } from "formik";
import type { Route } from "next";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type DoctorInput, doctorInputSchema } from "@/lib/api/schemas/doctor";

type DoctorFormResult =
  | { success: true; doctorId: string }
  | { success: false; message: string; fieldErrors?: Partial<Record<keyof DoctorInput, string>> };

const initialValues: DoctorInput = {
  name: "",
  specialization: "",
  hospital: "",
  phone: "",
  email: "",
};

export function validateDoctorValues(values: DoctorInput) {
  const parsed = doctorInputSchema.safeParse(values);
  if (parsed.success) return {};
  const errors: Partial<Record<keyof DoctorInput, string>> = {};
  for (const issue of parsed.error.issues) {
    const field = issue.path[0];
    if (typeof field === "string" && !(field in errors)) {
      errors[field as keyof DoctorInput] = issue.message;
    }
  }
  return errors;
}

export function DoctorForm({
  submit,
}: {
  submit?: (input: DoctorInput) => Promise<DoctorFormResult>;
}) {
  const router = useRouter();
  const formik = useFormik({
    initialValues,
    validate: validateDoctorValues,
    onSubmit: async (values, helpers) => {
      if (!submit) return;
      const result = await submit(doctorInputSchema.parse(values));
      if (result.success) {
        router.push(`/doctors/${result.doctorId}` as Route);
        return;
      }
      helpers.setStatus(result.message);
      if (result.fieldErrors) helpers.setErrors(result.fieldErrors);
    },
  });

  const fields: Array<{
    name: keyof DoctorInput;
    label: string;
    type: "text" | "email" | "tel";
    autoComplete: string;
  }> = [
    { name: "name", label: "Full name", type: "text", autoComplete: "name" },
    { name: "specialization", label: "Specialization", type: "text", autoComplete: "off" },
    { name: "hospital", label: "Hospital", type: "text", autoComplete: "organization" },
    { name: "phone", label: "Phone", type: "tel", autoComplete: "tel" },
    { name: "email", label: "Email", type: "email", autoComplete: "email" },
  ];

  return (
    <form onSubmit={formik.handleSubmit} noValidate className="max-w-2xl space-y-5">
      {formik.status && (
        <p role="alert" className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {formik.status}
        </p>
      )}
      <div className="grid gap-5 sm:grid-cols-2">
        {fields.map((field) => {
          const error = formik.touched[field.name] ? formik.errors[field.name] : undefined;
          return (
            <div key={field.name} className={field.name === "name" ? "sm:col-span-2" : undefined}>
              <Label htmlFor={`doctor-${field.name}`}>{field.label}</Label>
              <Input
                id={`doctor-${field.name}`}
                name={field.name}
                type={field.type}
                autoComplete={field.autoComplete}
                value={formik.values[field.name]}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? `doctor-${field.name}-error` : undefined}
                className="mt-2 h-control"
              />
              {error && (
                <p id={`doctor-${field.name}-error`} className="mt-1 text-sm text-destructive">
                  {error}
                </p>
              )}
            </div>
          );
        })}
      </div>
      <Button type="submit" disabled={!submit || formik.isSubmitting} className="h-control px-5">
        {formik.isSubmitting ? "Creating doctor…" : "Create doctor"}
      </Button>
    </form>
  );
}

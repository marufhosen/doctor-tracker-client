"use client";

import { useFormik } from "formik";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  normalizePatientUpdate,
  patientEditValues,
  validatePatientEditValues,
} from "@/components/patients/patient-edit-form.core";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Patient, PatientUpdate } from "@/lib/api/schemas/patient";

type Result =
  | { success: true }
  | { success: false; message: string; fieldErrors?: Record<string, string[]> };

export function PatientEditForm({
  patient,
  updateAction,
  onSuccess,
  onCancel,
}: {
  patient: Patient;
  updateAction: (patientId: string, input: PatientUpdate) => Promise<Result>;
  onSuccess?: () => void;
  onCancel?: () => void;
}) {
  const router = useRouter();
  const formik = useFormik({
    initialValues: patientEditValues(patient),
    validate: validatePatientEditValues,
    onSubmit: async (values, helpers) => {
      const input = normalizePatientUpdate(values);
      if (!input) return;
      const result = await updateAction(patient.id, input);
      if (result.success) {
        helpers.resetForm();
        if (onSuccess) {
          onSuccess();
          return;
        }
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
    <form onSubmit={formik.handleSubmit} noValidate className="space-y-4">
      {formik.status && (
        <p
          role="alert"
          aria-live="assertive"
          className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive"
        >
          {formik.status}
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map(([name, label, type]) => {
          const error = formik.touched[name] ? formik.errors[name] : undefined;
          return (
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
                aria-invalid={Boolean(error)}
                aria-describedby={error ? `patient-${name}-error` : undefined}
                className="mt-2 h-control"
                min={name === "age" ? 0 : undefined}
                max={name === "age" ? 150 : undefined}
              />
              {error && (
                <p id={`patient-${name}-error`} className="mt-1 text-sm text-destructive">
                  {error}
                </p>
              )}
            </div>
          );
        })}
        <div className="sm:col-span-2">
          <Label htmlFor="patient-gender">Gender</Label>
          <Select
            value={formik.values.gender || "__empty__"}
            onValueChange={(value) =>
              formik.setFieldValue("gender", value === "__empty__" ? "" : value)
            }
          >
            <SelectTrigger
              id="patient-gender"
              className="mt-2 h-control rounded-lg bg-background px-3"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__empty__">Not provided</SelectItem>
              <SelectItem value="MALE">Male</SelectItem>
              <SelectItem value="FEMALE">Female</SelectItem>
              <SelectItem value="OTHER">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:justify-end">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={formik.isSubmitting}
            className="h-10 px-5"
          >
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={!formik.dirty || formik.isSubmitting} className="h-10 px-5">
          {formik.isSubmitting ? (
            <LoaderCircle aria-hidden="true" className="animate-spin" />
          ) : null}
          {formik.isSubmitting ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </form>
  );
}

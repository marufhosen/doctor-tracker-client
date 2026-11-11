"use client";

import { useFormik } from "formik";
import { LoaderCircle, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { createDoctorPatientAction } from "@/actions/doctor-patient.actions";
import {
  normalizePatientValues,
  type PatientFormValues as Values,
} from "@/components/patients/patient-form.core";
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

type DoctorOption = { id: string; name: string };

const initialValues: Values = {
  name: "",
  condition: "",
  phone: "",
  email: "",
  age: "",
  gender: "",
  address: "",
};

export function PatientForm({
  doctorId,
  doctorName,
  doctors,
  onSuccess,
  onCancel,
}: {
  doctorId?: string | undefined;
  doctorName?: string | undefined;
  doctors?: DoctorOption[] | undefined;
  onSuccess?: (doctorId: string) => void;
  onCancel?: () => void;
}) {
  const router = useRouter();
  const [selectedDoctorId, setSelectedDoctorId] = useState(doctorId ?? doctors?.[0]?.id ?? "");
  const formik = useFormik<Values>({
    initialValues,
    validate: (values) => {
      if (normalizePatientValues(values)) return {};
      const errors: Partial<Record<keyof Values, string>> = {};
      if (!values.name.trim()) errors.name = "Enter the patient name.";
      if (!values.condition.trim()) errors.condition = "Enter the patient condition.";
      if (!Object.keys(errors).length) errors.name = "Review the patient details.";
      return errors;
    },
    onSubmit: async (values, helpers) => {
      const input = normalizePatientValues(values);
      if (!input) {
        helpers.setStatus("Review the patient details.");
        return;
      }
      const targetDoctorId = doctorId ?? selectedDoctorId;
      if (!targetDoctorId) {
        helpers.setStatus("Select the doctor who will own this patient.");
        return;
      }
      const result = await createDoctorPatientAction(targetDoctorId, input);
      if (result.success) {
        helpers.resetForm();
        if (onSuccess) {
          onSuccess(targetDoctorId);
          return;
        }
        router.push(`/doctors/${targetDoctorId}`);
        router.refresh();
        return;
      }
      helpers.setStatus(result.message);
    },
  });

  const textFields = [
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
        {!doctorId && doctors ? (
          <div className="sm:col-span-2">
            <Label htmlFor="patient-doctor">Doctor *</Label>
            <Select
              value={selectedDoctorId || "__empty__"}
              onValueChange={(value) => setSelectedDoctorId(value === "__empty__" ? "" : value)}
              required
            >
              <SelectTrigger
                id="patient-doctor"
                className="mt-2 h-control rounded-lg bg-background px-3"
              >
                <SelectValue placeholder="Select a doctor" />
              </SelectTrigger>
              <SelectContent>
                {!selectedDoctorId && (
                  <SelectItem value="__empty__" disabled>
                    Select a doctor
                  </SelectItem>
                )}
                {doctors.map((doctor) => (
                  <SelectItem key={doctor.id} value={doctor.id}>
                    {doctor.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : doctorName ? (
          <p className="rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground sm:col-span-2">
            Assigning to <span className="font-medium text-foreground">{doctorName}</span>
          </p>
        ) : null}
        {textFields.map(([name, label, type]) => {
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
            className="h-control px-5"
          >
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={formik.isSubmitting} className="h-control px-5">
          {formik.isSubmitting ? (
            <LoaderCircle aria-hidden="true" className="animate-spin" />
          ) : (
            <Plus aria-hidden="true" />
          )}
          {formik.isSubmitting ? "Creating patient…" : "Create patient"}
        </Button>
      </div>
    </form>
  );
}

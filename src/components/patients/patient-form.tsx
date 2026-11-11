"use client";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { createDoctorPatientAction } from "@/actions/doctor-patient.actions";
import {
  normalizePatientValues,
  type PatientFormValues as Values,
} from "@/components/patients/patient-form.core";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialValues: Values = {
  name: "",
  condition: "",
  phone: "",
  email: "",
  age: "",
  gender: "",
  address: "",
};

export function PatientForm({ doctorId }: { doctorId: string }) {
  const router = useRouter();
  const formik = useFormik({
    initialValues,
    validate: (values) =>
      normalizePatientValues(values) ? {} : { name: "Review the patient details." },
    onSubmit: async (values, helpers) => {
      const input = normalizePatientValues(values);
      if (!input) return;
      const result = await createDoctorPatientAction(doctorId, input);
      if (result.success) {
        router.push(`/doctors/${doctorId}`);
        router.refresh();
        return;
      }
      helpers.setStatus(result.message);
    },
  });
  return (
    <form onSubmit={formik.handleSubmit} noValidate className="max-w-2xl space-y-5">
      {formik.status && (
        <p role="alert" className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          {formik.status}
        </p>
      )}
      <div className="grid gap-5 sm:grid-cols-2">
        {(
          [
            ["name", "Full name", "text"],
            ["condition", "Condition", "text"],
            ["phone", "Phone", "tel"],
            ["email", "Email", "email"],
            ["age", "Age", "number"],
            ["address", "Address", "text"],
          ] as const
        ).map(([name, label, type]) => (
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
              className="mt-2 h-control"
              min={name === "age" ? 0 : undefined}
              max={name === "age" ? 150 : undefined}
            />
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
      <Button type="submit" disabled={formik.isSubmitting} className="h-control px-5">
        {formik.isSubmitting ? "Creating patient…" : "Add patient"}
      </Button>
    </form>
  );
}

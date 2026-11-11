"use client";
import { useState, useTransition } from "react";
import { removeDoctorPatientAction } from "@/actions/doctor-patient.actions";
import { Button } from "@/components/ui/button";
export function RemovePatientButton({
  doctorId,
  patientId,
  patientName,
}: {
  doctorId: string;
  patientId: string;
  patientName: string;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const remove = () => {
    if (!window.confirm(`Remove ${patientName} from this doctor?`)) return;
    startTransition(async () => {
      const result = await removeDoctorPatientAction(doctorId, patientId);
      setError(result.success ? "" : result.message);
    });
  };
  return (
    <div className="text-right">
      <Button type="button" variant="destructive" size="sm" disabled={pending} onClick={remove}>
        {pending ? "Removing…" : "Remove"}
      </Button>
      {error && (
        <p role="alert" className="mt-1 text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

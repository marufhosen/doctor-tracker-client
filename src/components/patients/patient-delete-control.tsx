"use client";

import type { Route } from "next";
import { useRouter } from "next/navigation";

import { deletePatientAction } from "@/actions/patient.actions";
import { PatientDeleteDialog } from "@/components/patients/patient-delete-dialog";

export function PatientDeleteControl({
  patientId,
  patientName,
  compact = false,
  redirectTo,
}: {
  patientId: string;
  patientName: string;
  compact?: boolean;
  redirectTo?: Route;
}) {
  const router = useRouter();
  return (
    <PatientDeleteDialog
      patientId={patientId}
      patientName={patientName}
      compact={compact}
      deleteAction={deletePatientAction}
      onDeleted={() => {
        if (redirectTo) router.push(redirectTo);
        router.refresh();
      }}
    />
  );
}

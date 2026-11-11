"use client";

import { useRouter } from "next/navigation";
import { deletePatientAction } from "@/actions/patient.actions";
import { PatientDeleteDialog } from "@/components/patients/patient-delete-dialog";

export function PatientDeleteControl({
  patientId,
  patientName,
}: {
  patientId: string;
  patientName: string;
}) {
  const router = useRouter();
  return (
    <PatientDeleteDialog
      patientId={patientId}
      patientName={patientName}
      deleteAction={deletePatientAction}
      onDeleted={() => {
        router.push("/patients");
        router.refresh();
      }}
    />
  );
}

"use client";

import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { updatePatientAction } from "@/actions/patient.actions";
import { PatientEditForm } from "@/components/patients/patient-edit-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Patient } from "@/lib/api/schemas/patient";

export function PatientEditControl({
  patient,
  compact = false,
}: {
  patient: Patient;
  compact?: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) setFormKey((key) => key + 1);
      }}
    >
      <DialogTrigger asChild>
        {compact ? (
          <Button
            variant="ghost"
            size="icon-lg"
            aria-label={`Edit ${patient.name}`}
            className="text-muted-foreground hover:text-primary"
          >
            <Pencil aria-hidden="true" className="size-4" />
          </Button>
        ) : (
          <Button variant="outline">
            <Pencil aria-hidden="true" />
            Edit patient
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit patient</DialogTitle>
          <DialogDescription>
            Update the record for {patient.name}. Doctor assignment cannot be changed.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <PatientEditForm
            key={formKey}
            patient={patient}
            updateAction={updatePatientAction}
            onCancel={() => setOpen(false)}
            onSuccess={() => {
              setOpen(false);
              router.refresh();
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { PatientForm } from "@/components/patients/patient-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type DoctorOption = { id: string; name: string };

export function CreatePatientDialog({
  doctors,
  doctorId,
  doctorName,
  triggerLabel = "Create patient",
}: {
  doctors?: DoctorOption[] | undefined;
  doctorId?: string | undefined;
  doctorName?: string | undefined;
  triggerLabel?: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const noDoctors = doctors?.length === 0;

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) setFormKey((key) => key + 1);
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <Plus aria-hidden="true" />
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{triggerLabel}</DialogTitle>
          <DialogDescription>
            {noDoctors
              ? "Every patient must be assigned to exactly one doctor."
              : doctorName
                ? `Add a patient record assigned to ${doctorName}.`
                : "Choose the doctor who will own this patient record, then add the patient details."}
          </DialogDescription>
        </DialogHeader>
        {noDoctors ? (
          <div className="mt-5 rounded-xl border border-dashed px-4 py-6 text-center">
            <p className="font-medium">Create a doctor first</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Patient records need an assigned doctor before they can be created.
            </p>
            <Button asChild className="mt-4">
              <Link href="/doctors" onClick={() => setOpen(false)}>
                Go to doctors
              </Link>
            </Button>
          </div>
        ) : (
          <div className="mt-4">
            <PatientForm
              key={formKey}
              doctors={doctors}
              doctorId={doctorId}
              doctorName={doctorName}
              onCancel={() => setOpen(false)}
              onSuccess={() => {
                setOpen(false);
                router.refresh();
              }}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

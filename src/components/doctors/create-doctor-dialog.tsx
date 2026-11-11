"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { createDoctorAction } from "@/actions/doctor.actions";
import { DoctorForm } from "@/components/doctors/doctor-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function CreateDoctorDialog() {
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
        <Button>
          <Plus aria-hidden="true" />
          Add doctor
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add doctor</DialogTitle>
          <DialogDescription>
            Create a doctor record using the supported clinical and contact fields.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <DoctorForm
            key={formKey}
            submit={createDoctorAction}
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

"use client";
import { Dialog } from "radix-ui";
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
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const remove = () => {
    startTransition(async () => {
      const result = await removeDoctorPatientAction(doctorId, patientId);
      if (!result.success) {
        setError(result.message);
        return;
      }
      setOpen(false);
    });
  };
  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        if (!pending) {
          setOpen(next);
          if (next) setError("");
        }
      }}
    >
      <Dialog.Trigger asChild>
        <Button type="button" variant="destructive" size="sm">
          Remove
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-[2px]" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[min(30rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 rounded-2xl border bg-card p-6 shadow-xl outline-none">
          <Dialog.Title className="text-xl font-semibold">Remove {patientName}?</Dialog.Title>
          <Dialog.Description className="mt-2 text-sm text-muted-foreground">
            Remove this patient from the doctor’s list. This does not delete the global patient
            record.
          </Dialog.Description>
          {error && (
            <p
              role="alert"
              aria-live="assertive"
              className="mt-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive"
            >
              {error}
            </p>
          )}
          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Dialog.Close asChild>
              <Button variant="outline" disabled={pending}>
                Cancel
              </Button>
            </Dialog.Close>
            <Button variant="destructive" disabled={pending} onClick={remove}>
              {pending ? "Removing…" : `Remove ${patientName}`}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

"use client";

import { Trash2 } from "lucide-react";
import { Dialog } from "radix-ui";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";

type DeleteResult = { success: true } | { success: false; message: string };

export function PatientDeleteDialog({
  patientId,
  patientName,
  deleteAction,
  onDeleted,
  compact = false,
}: {
  patientId: string;
  patientName: string;
  deleteAction: (patientId: string) => Promise<DeleteResult>;
  onDeleted: () => void;
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  const confirm = () =>
    startTransition(async () => {
      const result = await deleteAction(patientId);
      if (!result.success) {
        setError(result.message);
        return;
      }
      setOpen(false);
      onDeleted();
    });
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
        {compact ? (
          <Button
            variant="ghost"
            size="icon-lg"
            aria-label={`Delete ${patientName}`}
            className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 aria-hidden="true" className="size-4" />
          </Button>
        ) : (
          <Button variant="destructive">
            <Trash2 aria-hidden="true" />
            Delete patient
          </Button>
        )}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-[2px]" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 max-h-[calc(100dvh-2rem)] w-[min(30rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border bg-card p-5 shadow-xl outline-none">
          <Dialog.Title className="text-xl font-semibold">Delete {patientName}?</Dialog.Title>
          <Dialog.Description className="mt-2 text-sm text-muted-foreground">
            This permanently deletes the patient record. This action cannot be undone.
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
          <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Dialog.Close asChild>
              <Button variant="outline" disabled={pending}>
                Cancel
              </Button>
            </Dialog.Close>
            <Button variant="destructive" disabled={pending} onClick={confirm}>
              {pending ? "Deleting…" : `Delete ${patientName}`}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

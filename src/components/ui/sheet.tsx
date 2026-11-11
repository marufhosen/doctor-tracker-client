"use client";

import { X } from "lucide-react";
import { Dialog } from "radix-ui";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

export const Sheet = Dialog.Root;
export const SheetTrigger = Dialog.Trigger;
export const SheetClose = Dialog.Close;
export const SheetTitle = Dialog.Title;
export const SheetDescription = Dialog.Description;

export function SheetContent({
  className,
  children,
  ...props
}: ComponentProps<typeof Dialog.Content>) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-[2px] data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
      <Dialog.Content
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-[min(20rem,85vw)] border-r border-sidebar-border bg-sidebar text-sidebar-foreground shadow-xl outline-none data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left",
          className,
        )}
        {...props}
      >
        {children}
        <Dialog.Close className="absolute right-3 top-3 grid size-11 place-items-center rounded-lg text-sidebar-foreground/80 outline-none hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring">
          <X aria-hidden="true" />
          <span className="sr-only">Close navigation</span>
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  );
}

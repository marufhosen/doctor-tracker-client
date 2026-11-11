"use client";

import { ChevronDown, LogOut, UserRound } from "lucide-react";
import { DropdownMenu } from "radix-ui";
import { useFormStatus } from "react-dom";

import { logoutAction } from "@/actions/auth.actions";
import { getInitials } from "@/components/layout/profile-menu.core";

type ProfileMenuProps = {
  user: {
    name: string;
    email: string;
    role: "ADMIN";
  };
};

export function ProfileMenu({ user }: ProfileMenuProps) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          aria-label={`Open profile menu for ${user.name}`}
          className="flex shrink-0 items-center gap-3 rounded-lg px-1 py-1 text-left outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span className="grid size-10 place-items-center rounded-full bg-secondary text-sm font-semibold text-primary">
            {getInitials(user.name)}
          </span>
          <span className="hidden min-w-24 sm:block">
            <span className="block truncate text-xs font-semibold">{user.name}</span>
            <span className="mt-0.5 block text-[11px] text-muted-foreground">Administrator</span>
          </span>
          <ChevronDown
            aria-hidden="true"
            className="hidden size-4 text-muted-foreground sm:block"
          />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className="z-50 min-w-64 rounded-xl border bg-popover p-1 text-popover-foreground shadow-card outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
        >
          <div className="flex gap-3 px-3 py-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-secondary text-secondary-foreground">
              <UserRound aria-hidden="true" className="size-4" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{user.name}</p>
              <p className="truncate text-xs text-muted-foreground">{user.email}</p>
              <p className="mt-1 text-xs font-medium text-primary">Administrator</p>
            </div>
          </div>
          <DropdownMenu.Separator className="my-1 h-px bg-border" />
          <form action={logoutAction}>
            <DropdownMenu.Item asChild>
              <LogoutButton />
            </DropdownMenu.Item>
          </form>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

function LogoutButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex min-h-10 w-full items-center gap-2 rounded-lg px-3 text-sm text-destructive outline-none hover:bg-destructive/10 focus:bg-destructive/10 disabled:opacity-50"
    >
      <LogOut aria-hidden="true" className="size-4" />
      {pending ? "Signing out…" : "Sign out"}
    </button>
  );
}

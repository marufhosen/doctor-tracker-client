"use client";

import type { Route } from "next";
import { usePathname, useRouter } from "next/navigation";
import { type FormEvent, type ReactNode, useTransition } from "react";

export function FilterForm({ children, className }: { children: ReactNode; className?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parameters = new URLSearchParams();
    for (const [key, value] of new FormData(event.currentTarget)) {
      if (typeof value === "string" && value.trim() && value !== "__empty__") {
        parameters.set(key, value.trim());
      }
    }

    const destination = parameters.size ? `${pathname}?${parameters}` : pathname;
    startTransition(() => router.push(destination as Route, { scroll: false }));
  }

  return (
    <form onSubmit={submit} className={className} aria-busy={pending}>
      {children}
    </form>
  );
}

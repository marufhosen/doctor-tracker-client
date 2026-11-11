import { Search, X } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function DoctorSearch({
  value = "",
  preservedQuery,
}: {
  value?: string | undefined;
  preservedQuery?: Record<string, string | undefined>;
}) {
  return (
    <search className="block w-full max-w-xl">
      <form method="get" className="flex items-end gap-2">
        {Object.entries(preservedQuery ?? {}).map(([name, fieldValue]) =>
          fieldValue ? <input key={name} type="hidden" name={name} value={fieldValue} /> : null,
        )}
        <label className="grid min-w-0 flex-1 gap-1 text-sm font-medium" htmlFor="doctor-search">
          Search doctors
          <span className="relative">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              id="doctor-search"
              name="search"
              type="search"
              defaultValue={value}
              placeholder="Name, email, or phone"
              maxLength={100}
              className="h-control pl-9"
            />
          </span>
        </label>
        <Button type="submit" className="h-control px-4">
          Search
        </Button>
        {value && (
          <Button asChild type="button" variant="outline" size="icon-lg" className="size-control">
            <Link href="/doctors" aria-label="Clear doctor search">
              <X aria-hidden="true" />
            </Link>
          </Button>
        )}
      </form>
    </search>
  );
}

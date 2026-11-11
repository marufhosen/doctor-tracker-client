import { RotateCcw, Search } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ParsedDoctorListQuery } from "@/lib/api/query";

const selectClass = "h-10 w-full min-w-0 rounded-lg border bg-card px-3 text-sm";
const labelClass = "grid min-w-0 gap-1 text-xs font-medium text-muted-foreground";

export function DoctorToolbar({ query }: { query: ParsedDoctorListQuery }) {
  const clearParams = new URLSearchParams();
  if (query.search) clearParams.set("search", query.search);
  const clearHref = clearParams.size ? `/doctors?${clearParams}` : "/doctors";

  return (
    <form method="get" className="mt-4 space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative min-w-0 flex-1">
          <label htmlFor="doctor-search" className="sr-only">
            Search doctors
          </label>
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            id="doctor-search"
            name="search"
            type="search"
            defaultValue={query.search ?? ""}
            placeholder="Search by name, email, or phone…"
            maxLength={100}
            className="h-11 rounded-lg pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Button type="submit" className="h-11 px-4">
            <Search aria-hidden="true" />
            Search
          </Button>
          <Button asChild variant="outline" className="h-11 px-4">
            <Link href={clearHref as Route}>
              <RotateCcw aria-hidden="true" />
              Clear
            </Link>
          </Button>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <label htmlFor="doctor-specialization" className={labelClass}>
          Specialization
          <Input
            id="doctor-specialization"
            name="specialization"
            defaultValue={query.specialization ?? ""}
            maxLength={120}
            className="h-10 rounded-lg text-sm"
          />
        </label>
        <label htmlFor="doctor-hospital" className={labelClass}>
          Hospital
          <Input
            id="doctor-hospital"
            name="hospital"
            defaultValue={query.hospital ?? ""}
            maxLength={160}
            className="h-10 rounded-lg text-sm"
          />
        </label>
        <label htmlFor="doctor-created-from" className={labelClass}>
          Created from
          <Input
            id="doctor-created-from"
            type="date"
            name="createdFrom"
            defaultValue={query.createdFrom?.slice(0, 10)}
            className="h-10 rounded-lg text-sm"
          />
        </label>
        <label htmlFor="doctor-created-to" className={labelClass}>
          Created to
          <Input
            id="doctor-created-to"
            type="date"
            name="createdTo"
            defaultValue={query.createdTo?.slice(0, 10)}
            className="h-10 rounded-lg text-sm"
          />
        </label>
        <label htmlFor="doctor-sort" className={labelClass}>
          Sort by
          <select
            id="doctor-sort"
            name="sortBy"
            defaultValue={query.sortBy ?? "createdAt"}
            className={selectClass}
          >
            <option value="createdAt">Created date</option>
            <option value="name">Name</option>
            <option value="specialization">Specialization</option>
            <option value="hospital">Hospital</option>
          </select>
        </label>
        <label htmlFor="doctor-order" className={labelClass}>
          Direction
          <select
            id="doctor-order"
            name="sortOrder"
            defaultValue={query.sortOrder ?? "desc"}
            className={selectClass}
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </label>
      </div>
    </form>
  );
}

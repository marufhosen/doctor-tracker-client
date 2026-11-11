import type { Route } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ParsedDoctorListQuery } from "@/lib/api/query";

export function DoctorFilters({ query }: { query: ParsedDoctorListQuery }) {
  const clearParams = new URLSearchParams();
  if (query.search) clearParams.set("search", query.search);
  const clearHref = clearParams.size ? `/doctors?${clearParams}` : "/doctors";

  return (
    <details className="rounded-xl border bg-card">
      <summary className="min-h-11 cursor-pointer px-4 py-3 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        Filters and sorting
      </summary>
      <form method="get" className="grid gap-4 border-t p-4 sm:grid-cols-2 xl:grid-cols-4">
        {query.search && <input type="hidden" name="search" value={query.search} />}
        <label htmlFor="doctor-specialization" className="grid gap-1 text-sm font-medium">
          Specialization
          <Input
            id="doctor-specialization"
            name="specialization"
            defaultValue={query.specialization}
            maxLength={120}
          />
        </label>
        <label htmlFor="doctor-hospital" className="grid gap-1 text-sm font-medium">
          Hospital
          <Input
            id="doctor-hospital"
            name="hospital"
            defaultValue={query.hospital}
            maxLength={160}
          />
        </label>
        <label htmlFor="doctor-created-from" className="grid gap-1 text-sm font-medium">
          Created from
          <Input
            id="doctor-created-from"
            type="date"
            name="createdFrom"
            defaultValue={query.createdFrom?.slice(0, 10)}
          />
        </label>
        <label htmlFor="doctor-created-to" className="grid gap-1 text-sm font-medium">
          Created to
          <Input
            id="doctor-created-to"
            type="date"
            name="createdTo"
            defaultValue={query.createdTo?.slice(0, 10)}
          />
        </label>
        <label className="grid gap-1 text-sm font-medium">
          Sort by
          <select
            name="sortBy"
            defaultValue={query.sortBy ?? "createdAt"}
            className="h-control rounded-lg border bg-background px-3 text-sm"
          >
            <option value="createdAt">Created date</option>
            <option value="name">Name</option>
            <option value="specialization">Specialization</option>
            <option value="hospital">Hospital</option>
          </select>
        </label>
        <label className="grid gap-1 text-sm font-medium">
          Direction
          <select
            name="sortOrder"
            defaultValue={query.sortOrder ?? "desc"}
            className="h-control rounded-lg border bg-background px-3 text-sm"
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </label>
        <div className="flex items-end gap-2 sm:col-span-2">
          <Button type="submit" className="h-control px-4">
            Apply filters
          </Button>
          <Button asChild type="button" variant="outline" className="h-control px-4">
            <Link href={clearHref as Route}>Clear filters</Link>
          </Button>
        </div>
      </form>
    </details>
  );
}

import type { Route } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ParsedPatientListQuery } from "@/lib/api/query";
import type { Doctor } from "@/lib/api/schemas/doctor";

export function PatientFilters({
  query,
  doctors,
}: {
  query: ParsedPatientListQuery;
  doctors: Doctor[];
}) {
  const clear = query.search ? `/patients?search=${encodeURIComponent(query.search)}` : "/patients";
  return (
    <details className="rounded-xl border bg-card">
      <summary className="min-h-11 cursor-pointer px-4 py-3 text-sm font-semibold">
        Filters and sorting
      </summary>
      <form method="get" className="grid gap-4 border-t p-4 sm:grid-cols-2 xl:grid-cols-4">
        {query.search && <input type="hidden" name="search" value={query.search} />}
        <label htmlFor="patient-condition" className="grid gap-1 text-sm font-medium">
          Condition
          <Input
            id="patient-condition"
            name="condition"
            defaultValue={query.condition}
            maxLength={200}
          />
        </label>
        <label htmlFor="patient-doctor" className="grid gap-1 text-sm font-medium">
          Doctor
          <select
            id="patient-doctor"
            name="doctorId"
            defaultValue={query.doctorId ?? ""}
            className="h-control rounded-lg border bg-background px-3 text-sm"
          >
            <option value="">All doctors</option>
            {doctors.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.name}
              </option>
            ))}
          </select>
        </label>
        <label htmlFor="patient-created-from" className="grid gap-1 text-sm font-medium">
          Created from
          <Input
            id="patient-created-from"
            type="date"
            name="createdFrom"
            defaultValue={query.createdFrom?.slice(0, 10)}
          />
        </label>
        <label htmlFor="patient-created-to" className="grid gap-1 text-sm font-medium">
          Created to
          <Input
            id="patient-created-to"
            type="date"
            name="createdTo"
            defaultValue={query.createdTo?.slice(0, 10)}
          />
        </label>
        <label htmlFor="patient-sort" className="grid gap-1 text-sm font-medium">
          Sort by
          <select
            id="patient-sort"
            name="sortBy"
            defaultValue={query.sortBy ?? "createdAt"}
            className="h-control rounded-lg border bg-background px-3 text-sm"
          >
            <option value="createdAt">Created date</option>
            <option value="name">Name</option>
            <option value="condition">Condition</option>
            <option value="age">Age</option>
          </select>
        </label>
        <label htmlFor="patient-order" className="grid gap-1 text-sm font-medium">
          Direction
          <select
            id="patient-order"
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
            <Link href={clear as Route}>Clear filters</Link>
          </Button>
        </div>
      </form>
    </details>
  );
}

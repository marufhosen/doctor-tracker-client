import { RotateCcw, Search } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ParsedPatientListQuery } from "@/lib/api/query";
import type { Doctor } from "@/lib/api/schemas/doctor";

const selectClass = "h-10 w-full min-w-0 rounded-lg border bg-card px-3 text-sm";
const labelClass = "grid min-w-0 gap-1 text-xs font-medium text-muted-foreground";

export function PatientToolbar({
  query,
  doctors,
}: {
  query: ParsedPatientListQuery;
  doctors: Doctor[];
}) {
  const clear = query.search ? `/patients?search=${encodeURIComponent(query.search)}` : "/patients";

  return (
    <form method="get" className="mt-4 space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative min-w-0 flex-1">
          <label htmlFor="patient-search" className="sr-only">
            Search patients
          </label>
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            id="patient-search"
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
            <Link href={clear as Route}>
              <RotateCcw aria-hidden="true" />
              Clear
            </Link>
          </Button>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <label htmlFor="patient-condition" className={labelClass}>
          Condition
          <Input
            id="patient-condition"
            name="condition"
            defaultValue={query.condition ?? ""}
            maxLength={200}
            className="h-10 rounded-lg text-sm"
          />
        </label>
        <label htmlFor="patient-doctor" className={labelClass}>
          Doctor
          <select
            id="patient-doctor"
            name="doctorId"
            defaultValue={query.doctorId ?? ""}
            className={selectClass}
          >
            <option value="">All doctors</option>
            {doctors.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.name}
              </option>
            ))}
          </select>
        </label>
        <label htmlFor="patient-created-from" className={labelClass}>
          Created from
          <Input
            id="patient-created-from"
            type="date"
            name="createdFrom"
            defaultValue={query.createdFrom?.slice(0, 10)}
            className="h-10 rounded-lg text-sm"
          />
        </label>
        <label htmlFor="patient-created-to" className={labelClass}>
          Created to
          <Input
            id="patient-created-to"
            type="date"
            name="createdTo"
            defaultValue={query.createdTo?.slice(0, 10)}
            className="h-10 rounded-lg text-sm"
          />
        </label>
        <label htmlFor="patient-sort" className={labelClass}>
          Sort by
          <select
            id="patient-sort"
            name="sortBy"
            defaultValue={query.sortBy ?? "createdAt"}
            className={selectClass}
          >
            <option value="createdAt">Created date</option>
            <option value="name">Name</option>
            <option value="condition">Condition</option>
            <option value="age">Age</option>
          </select>
        </label>
        <label htmlFor="patient-order" className={labelClass}>
          Direction
          <select
            id="patient-order"
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

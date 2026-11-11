import { ChevronDown, RotateCcw, Search, SlidersHorizontal } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";

import { FilterForm } from "@/components/filter-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ParsedPatientListQuery } from "@/lib/api/query";
import type { Doctor } from "@/lib/api/schemas/doctor";

const labelClass = "grid min-w-0 gap-0.5 text-[10px] font-medium text-muted-foreground";

export function PatientToolbar({
  query,
  doctors,
}: {
  query: ParsedPatientListQuery;
  doctors: Doctor[];
}) {
  const activeFilterCount = [
    query.condition,
    query.doctorId,
    query.createdFrom,
    query.createdTo,
    query.sortBy && query.sortBy !== "createdAt" ? query.sortBy : undefined,
    query.sortOrder && query.sortOrder !== "desc" ? query.sortOrder : undefined,
  ].filter(Boolean).length;

  return (
    <FilterForm className="mt-3 overflow-hidden rounded-[10px] border bg-card shadow-card">
      <div className="flex flex-col gap-2 p-2 sm:flex-row">
        <div className="relative min-w-0 flex-1">
          <label htmlFor="patient-search" className="sr-only">
            Search patients
          </label>
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            key={query.search ?? "empty-search"}
            id="patient-search"
            name="search"
            type="search"
            defaultValue={query.search ?? ""}
            placeholder="Search by name, email, or phone…"
            maxLength={100}
            className="h-9 pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Button type="submit" className="h-9 px-3">
            <Search aria-hidden="true" />
            Search
          </Button>
          <Button asChild variant="outline" className="h-9 px-3">
            <Link href={"/patients" as Route}>
              <RotateCcw aria-hidden="true" />
              Clear all
            </Link>
          </Button>
        </div>
      </div>
      <details className="group border-t" open={activeFilterCount > 0 || undefined}>
        <summary className="flex cursor-pointer list-none items-center gap-2 px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted/60 [&::-webkit-details-marker]:hidden">
          <SlidersHorizontal aria-hidden="true" className="size-3.5 text-primary" />
          Filters
          {activeFilterCount > 0 && (
            <span className="rounded-full bg-secondary px-1.5 py-0.5 text-[10px] font-semibold text-primary">
              {activeFilterCount}
            </span>
          )}
          <ChevronDown
            aria-hidden="true"
            className="ml-auto size-3.5 text-muted-foreground transition-transform group-open:rotate-180"
          />
        </summary>
        <div className="grid gap-2 border-t bg-muted/20 px-3 py-2.5 sm:grid-cols-2 lg:grid-cols-6">
          <label htmlFor="patient-condition" className={labelClass}>
            Condition
            <Input
              id="patient-condition"
              name="condition"
              defaultValue={query.condition ?? ""}
              maxLength={200}
              className="h-8 text-xs"
            />
          </label>
          <label htmlFor="patient-doctor" className={labelClass}>
            Doctor
            <Select name="doctorId" defaultValue={query.doctorId ?? "__empty__"}>
              <SelectTrigger id="patient-doctor" className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__empty__">All doctors</SelectItem>
                {doctors.map((doctor) => (
                  <SelectItem key={doctor.id} value={doctor.id}>
                    {doctor.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>
          <label htmlFor="patient-created-from" className={labelClass}>
            Created from
            <Input
              id="patient-created-from"
              type="date"
              name="createdFrom"
              defaultValue={query.createdFrom?.slice(0, 10)}
              className="h-8 text-xs"
            />
          </label>
          <label htmlFor="patient-created-to" className={labelClass}>
            Created to
            <Input
              id="patient-created-to"
              type="date"
              name="createdTo"
              defaultValue={query.createdTo?.slice(0, 10)}
              className="h-8 text-xs"
            />
          </label>
          <label htmlFor="patient-sort" className={labelClass}>
            Sort by
            <Select name="sortBy" defaultValue={query.sortBy ?? "createdAt"}>
              <SelectTrigger id="patient-sort" className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">Created date</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="condition">Condition</SelectItem>
                <SelectItem value="age">Age</SelectItem>
              </SelectContent>
            </Select>
          </label>
          <label htmlFor="patient-order" className={labelClass}>
            Direction
            <Select name="sortOrder" defaultValue={query.sortOrder ?? "desc"}>
              <SelectTrigger id="patient-order" className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Descending</SelectItem>
                <SelectItem value="asc">Ascending</SelectItem>
              </SelectContent>
            </Select>
          </label>
        </div>
        <div className="flex justify-end border-t bg-muted/20 px-3 py-2">
          <Button type="submit" size="sm">
            Apply filters
          </Button>
        </div>
      </details>
    </FilterForm>
  );
}

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
import type { ParsedDoctorListQuery } from "@/lib/api/query";

const labelClass = "grid min-w-0 gap-0.5 text-[10px] font-medium text-muted-foreground";

export function DoctorToolbar({ query }: { query: ParsedDoctorListQuery }) {
  const activeFilterCount = [
    query.specialization,
    query.hospital,
    query.createdFrom,
    query.createdTo,
    query.sortBy && query.sortBy !== "createdAt" ? query.sortBy : undefined,
    query.sortOrder && query.sortOrder !== "desc" ? query.sortOrder : undefined,
  ].filter(Boolean).length;

  return (
    <FilterForm className="mt-3 overflow-hidden rounded-[10px] border bg-card shadow-card">
      <div className="flex flex-col gap-2 p-2 sm:flex-row">
        <div className="relative min-w-0 flex-1">
          <label htmlFor="doctor-search" className="sr-only">
            Search doctors
          </label>
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            key={query.search ?? "empty-search"}
            id="doctor-search"
            name="search"
            type="search"
            defaultValue={query.search ?? ""}
            placeholder="Search by name, specialization, hospital, email, or phone…"
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
            <Link href={"/doctors" as Route}>
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
          <label htmlFor="doctor-specialization" className={labelClass}>
            Specialization
            <Input
              id="doctor-specialization"
              name="specialization"
              defaultValue={query.specialization ?? ""}
              maxLength={120}
              className="h-8 text-xs"
            />
          </label>
          <label htmlFor="doctor-hospital" className={labelClass}>
            Hospital
            <Input
              id="doctor-hospital"
              name="hospital"
              defaultValue={query.hospital ?? ""}
              maxLength={160}
              className="h-8 text-xs"
            />
          </label>
          <label htmlFor="doctor-created-from" className={labelClass}>
            Created from
            <Input
              id="doctor-created-from"
              type="date"
              name="createdFrom"
              defaultValue={query.createdFrom?.slice(0, 10)}
              className="h-8 text-xs"
            />
          </label>
          <label htmlFor="doctor-created-to" className={labelClass}>
            Created to
            <Input
              id="doctor-created-to"
              type="date"
              name="createdTo"
              defaultValue={query.createdTo?.slice(0, 10)}
              className="h-8 text-xs"
            />
          </label>
          <label htmlFor="doctor-sort" className={labelClass}>
            Sort by
            <Select name="sortBy" defaultValue={query.sortBy ?? "createdAt"}>
              <SelectTrigger id="doctor-sort" className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">Created date</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="specialization">Specialization</SelectItem>
                <SelectItem value="hospital">Hospital</SelectItem>
              </SelectContent>
            </Select>
          </label>
          <label htmlFor="doctor-order" className={labelClass}>
            Direction
            <Select name="sortOrder" defaultValue={query.sortOrder ?? "desc"}>
              <SelectTrigger id="doctor-order" className="h-8 text-xs">
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

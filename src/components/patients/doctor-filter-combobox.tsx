"use client";

import { Check, ChevronsUpDown, Search } from "lucide-react";
import { Popover as PopoverPrimitive } from "radix-ui";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type DoctorOption = { id: string; name: string };

export function filterDoctorOptions(doctors: DoctorOption[], search: string) {
  const query = search.trim().toLocaleLowerCase();
  return query
    ? doctors.filter((doctor) => doctor.name.toLocaleLowerCase().includes(query))
    : doctors;
}

export function DoctorFilterCombobox({
  doctors,
  initialValue,
}: {
  doctors: DoctorOption[];
  initialValue?: string | undefined;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [value, setValue] = useState(initialValue ?? "");
  const selectedDoctor = doctors.find((doctor) => doctor.id === value);
  const filteredDoctors = useMemo(() => filterDoctorOptions(doctors, search), [doctors, search]);

  function selectDoctor(doctorId: string) {
    setValue(doctorId);
    setOpen(false);
    setSearch("");
  }

  return (
    <PopoverPrimitive.Root
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) setSearch("");
      }}
    >
      <input type="hidden" name="doctorId" value={value} />
      <PopoverPrimitive.Trigger asChild>
        <Button
          id="patient-doctor"
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-controls="patient-doctor-options"
          className="h-8 w-full justify-between rounded-md bg-card px-2.5 text-xs font-normal"
        >
          <span className="truncate">{selectedDoctor?.name ?? "All doctors"}</span>
          <ChevronsUpDown aria-hidden="true" className="size-3.5 shrink-0 text-muted-foreground" />
        </Button>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align="start"
          sideOffset={4}
          className="z-50 w-[var(--radix-popover-trigger-width)] rounded-md border bg-popover p-1 text-popover-foreground shadow-md outline-none data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
        >
          <div className="relative mb-1">
            <label htmlFor="patient-doctor-search" className="sr-only">
              Search doctors
            </label>
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              id="patient-doctor-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search doctors…"
              autoComplete="off"
              className="h-8 pl-8 text-xs"
              autoFocus
            />
          </div>
          <div
            id="patient-doctor-options"
            role="listbox"
            aria-label="Doctors"
            className="scrollbar-custom max-h-56 overflow-y-auto"
          >
            {!search.trim() || "all doctors".includes(search.trim().toLocaleLowerCase()) ? (
              <OptionButton selected={!value} onSelect={() => selectDoctor("")}>
                All doctors
              </OptionButton>
            ) : null}
            {filteredDoctors.map((doctor) => (
              <OptionButton
                key={doctor.id}
                selected={doctor.id === value}
                onSelect={() => selectDoctor(doctor.id)}
              >
                {doctor.name}
              </OptionButton>
            ))}
            {filteredDoctors.length === 0 &&
            !"all doctors".includes(search.trim().toLocaleLowerCase()) ? (
              <p className="px-2 py-3 text-center text-xs text-muted-foreground">
                No doctors found.
              </p>
            ) : null}
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}

function OptionButton({
  selected,
  onSelect,
  children,
}: {
  selected: boolean;
  onSelect: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      role="option"
      aria-selected={selected}
      onClick={onSelect}
      className="relative flex w-full items-center rounded-sm py-1.5 pl-2 pr-7 text-left text-xs outline-none hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground"
    >
      <span className="truncate">{children}</span>
      <Check
        aria-hidden="true"
        className={cn("absolute right-2 size-3.5", selected ? "opacity-100" : "opacity-0")}
      />
    </button>
  );
}

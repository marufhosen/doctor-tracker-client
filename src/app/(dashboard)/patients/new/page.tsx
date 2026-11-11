import { Stethoscope, UserPlus } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-navigation";
import { Button } from "@/components/ui/button";
import { getDoctorList } from "@/lib/doctors/doctor.service.server";

export const instant = false;

export default async function NewPatientDoctorPage() {
  const { doctors } = await getDoctorList({
    page: 1,
    limit: 100,
    sortBy: "name",
    sortOrder: "asc",
  });
  return (
    <>
      <PageHeader
        kind="form"
        title="Create patient"
        description="Choose the doctor who will own this patient record."
        breadcrumbs={[{ label: "Patients", href: "/patients" }, { label: "Create patient" }]}
      />
      {doctors.length === 0 ? (
        <section className="rounded-2xl border bg-card p-8 text-center shadow-card">
          <Stethoscope aria-hidden="true" className="mx-auto size-9 text-muted-foreground" />
          <h2 className="mt-4 text-lg">Create a doctor first</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Every patient must be assigned to exactly one doctor.
          </p>
          <Button asChild className="mt-5">
            <Link href="/doctors/new">Add doctor</Link>
          </Button>
        </section>
      ) : (
        <section aria-labelledby="select-doctor-heading">
          <h2 id="select-doctor-heading" className="text-lg">
            Select a doctor
          </h2>
          <ul className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {doctors.map((doctor) => (
              <li
                key={doctor.id}
                className="flex flex-col rounded-2xl border bg-card p-5 shadow-card"
              >
                <div className="flex items-start gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-secondary text-primary">
                    <Stethoscope aria-hidden="true" className="size-4" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="truncate font-semibold">{doctor.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{doctor.specialization}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{doctor.hospital}</p>
                  </div>
                </div>
                <Button asChild className="mt-5 w-full">
                  <Link href={`/doctors/${doctor.id}/patients/new` as Route}>
                    <UserPlus aria-hidden="true" />
                    Assign new patient
                  </Link>
                </Button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}

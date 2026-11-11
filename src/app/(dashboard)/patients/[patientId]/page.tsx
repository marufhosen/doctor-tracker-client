import {
  Activity,
  ArrowUpRight,
  Building2,
  Cake,
  CalendarDays,
  Mail,
  MapPin,
  Phone,
  UserRound,
} from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { PageHeader } from "@/components/layout/page-navigation";
import { PatientDeleteControl } from "@/components/patients/patient-delete-control";
import { PatientEditControl } from "@/components/patients/patient-edit-control";
import { Button } from "@/components/ui/button";
import { ApiClientError } from "@/lib/api/errors";
import type { Patient } from "@/lib/api/schemas/patient";
import { getDoctorDetail } from "@/lib/doctors/doctor.service.server";
import { getPatientDetail } from "@/lib/patients/patient.service.server";

export const instant = false;

const dateFormatter = new Intl.DateTimeFormat("en", {
  dateStyle: "medium",
  timeZone: "UTC",
});

const optional = (value: string | number | undefined) => value ?? "Not provided";

const initials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export default async function PatientDetailPage({ params }: PageProps<"/patients/[patientId]">) {
  const { patientId } = await params;
  let patient: Patient;
  try {
    patient = await getPatientDetail(patientId);
  } catch (error) {
    if (error instanceof ApiClientError && error.kind !== "not_found") throw error;
    notFound();
  }

  const doctor = await getDoctorDetail(patient.doctorId);
  const patientReference = `PT-${patient.id.slice(-8).toUpperCase()}`;
  const gender = patient.gender
    ? patient.gender.charAt(0) + patient.gender.slice(1).toLowerCase()
    : undefined;

  return (
    <>
      <PageHeader
        kind="detail"
        title={patient.name}
        description={`${patientReference} · Added ${dateFormatter.format(new Date(patient.createdAt))}`}
        actions={
          <>
            <PatientEditControl patient={patient} />
            <PatientDeleteControl
              patientId={patient.id}
              patientName={patient.name}
              redirectTo="/patients"
            />
          </>
        }
      />

      <div className="grid gap-3 lg:grid-cols-[minmax(0,1.65fr)_minmax(17rem,0.75fr)]">
        <div className="space-y-3">
          <section
            aria-labelledby="care-heading"
            className="rounded-[10px] border bg-card shadow-card"
          >
            <div className="border-b px-4 py-3">
              <div>
                <h2 id="care-heading" className="text-base">
                  Care overview
                </h2>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Current condition and patient demographics.
                </p>
              </div>
            </div>
            <dl className="grid sm:grid-cols-3 sm:divide-x">
              <DetailItem
                icon={<Activity />}
                label="Condition"
                value={patient.condition}
                prominent
              />
              <DetailItem icon={<Cake />} label="Age" value={optional(patient.age)} />
              <DetailItem icon={<UserRound />} label="Gender" value={optional(gender)} />
            </dl>
          </section>

          <section
            aria-labelledby="contact-heading"
            className="rounded-[10px] border bg-card shadow-card"
          >
            <div className="border-b px-4 py-3">
              <h2 id="contact-heading" className="text-base">
                Contact information
              </h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Patient contact details and primary address.
              </p>
            </div>
            <dl className="grid sm:grid-cols-2">
              <DetailItem
                icon={<Mail />}
                label="Email address"
                value={optional(patient.email)}
                href={patient.email ? `mailto:${patient.email}` : undefined}
              />
              <DetailItem
                icon={<Phone />}
                label="Phone number"
                value={optional(patient.phone)}
                href={patient.phone ? `tel:${patient.phone}` : undefined}
              />
              <DetailItem
                icon={<MapPin />}
                label="Address"
                value={optional(patient.address)}
                className="border-t sm:col-span-2"
              />
            </dl>
          </section>

          <section
            aria-labelledby="record-heading"
            className="rounded-[10px] border bg-card shadow-card"
          >
            <div className="border-b px-4 py-3">
              <h2 id="record-heading" className="text-base">
                Record information
              </h2>
            </div>
            <dl className="grid sm:grid-cols-2 sm:divide-x">
              <DetailItem
                icon={<CalendarDays />}
                label="Created"
                value={dateFormatter.format(new Date(patient.createdAt))}
              />
              <DetailItem
                icon={<CalendarDays />}
                label="Last updated"
                value={dateFormatter.format(new Date(patient.updatedAt))}
              />
            </dl>
          </section>
        </div>

        <aside
          aria-labelledby="doctor-heading"
          className="h-fit rounded-[10px] border bg-card p-4 shadow-card lg:sticky lg:top-3"
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Care assignment
          </p>
          <div className="mt-3 flex items-center gap-3">
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-secondary text-sm font-semibold text-primary">
              {initials(doctor.name)}
            </span>
            <div className="min-w-0">
              <h2 id="doctor-heading" className="truncate text-base">
                {doctor.name}
              </h2>
              <p className="truncate text-xs text-muted-foreground">{doctor.specialization}</p>
            </div>
          </div>
          <dl className="mt-4 space-y-3 border-y py-4">
            <DoctorDetail icon={<Building2 />} label="Hospital" value={doctor.hospital} />
            <DoctorDetail
              icon={<Mail />}
              label="Email"
              value={doctor.email}
              href={`mailto:${doctor.email}`}
            />
            <DoctorDetail
              icon={<Phone />}
              label="Phone"
              value={doctor.phone}
              href={`tel:${doctor.phone}`}
            />
          </dl>
          <Button asChild variant="outline" className="mt-4 w-full justify-between">
            <Link href={`/doctors/${doctor.id}` as Route}>
              View doctor profile
              <ArrowUpRight aria-hidden="true" />
            </Link>
          </Button>
        </aside>
      </div>
    </>
  );
}

function DetailItem({
  icon,
  label,
  value,
  href,
  prominent = false,
  className = "",
}: {
  icon: ReactNode;
  label: string;
  value: string | number;
  href?: string | undefined;
  prominent?: boolean;
  className?: string;
}) {
  return (
    <div className={`flex min-w-0 gap-3 px-4 py-3 ${className}`}>
      <span className="mt-0.5 text-primary [&>svg]:size-4" aria-hidden="true">
        {icon}
      </span>
      <div className="min-w-0">
        <dt className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </dt>
        <dd
          className={`mt-1 break-words text-sm ${prominent ? "font-semibold text-primary" : "font-medium"}`}
        >
          {href ? (
            <a href={href} className="hover:text-primary hover:underline">
              {value}
            </a>
          ) : (
            value
          )}
        </dd>
      </div>
    </div>
  );
}

function DoctorDetail({
  icon,
  label,
  value,
  href,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
  return (
    <div className="flex min-w-0 gap-2.5">
      <span className="mt-0.5 text-muted-foreground [&>svg]:size-3.5" aria-hidden="true">
        {icon}
      </span>
      <div className="min-w-0">
        <dt className="text-[10px] text-muted-foreground">{label}</dt>
        <dd className="truncate text-xs font-medium">
          {href ? (
            <a href={href} className="hover:text-primary hover:underline">
              {value}
            </a>
          ) : (
            value
          )}
        </dd>
      </div>
    </div>
  );
}

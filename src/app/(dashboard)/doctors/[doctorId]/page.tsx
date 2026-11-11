import { Building2, CalendarDays, Mail, Phone, Stethoscope, UserPlus } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { DoctorPatients } from "@/components/doctors/doctor-patients";
import { PageHeader } from "@/components/layout/page-navigation";
import { Button } from "@/components/ui/button";
import { ApiClientError } from "@/lib/api/errors";
import type { Doctor } from "@/lib/api/schemas/doctor";
import { getDoctorDetail, getDoctorPatients } from "@/lib/doctors/doctor.service.server";
import { parseDoctorPatientQuery } from "@/lib/doctors/doctor-patient-query";

export const instant = false;

export default async function DoctorDetailPage({
  params,
  searchParams,
}: PageProps<"/doctors/[doctorId]">) {
  const { doctorId } = await params;
  const patientQuery = parseDoctorPatientQuery(await searchParams);
  let doctor: Doctor;
  let patientResult: Awaited<ReturnType<typeof getDoctorPatients>>;
  try {
    [doctor, patientResult] = await Promise.all([
      getDoctorDetail(doctorId),
      getDoctorPatients(doctorId, patientQuery),
    ]);
  } catch (error) {
    if (error instanceof ApiClientError && error.kind !== "not_found") throw error;
    notFound();
  }

  const details = [
    { label: "Specialization", value: doctor.specialization, icon: Stethoscope },
    { label: "Hospital", value: doctor.hospital, icon: Building2 },
    { label: "Email", value: doctor.email, icon: Mail, href: `mailto:${doctor.email}` },
    { label: "Phone", value: doctor.phone, icon: Phone, href: `tel:${doctor.phone}` },
    {
      label: "Created",
      value: new Intl.DateTimeFormat("en", { dateStyle: "long", timeZone: "UTC" }).format(
        new Date(doctor.createdAt),
      ),
      icon: CalendarDays,
    },
  ];

  return (
    <>
      <PageHeader
        kind="detail"
        title={doctor.name}
        description="Doctor profile and patient assignments."
        breadcrumbs={[{ label: "Doctors", href: "/doctors" }, { label: doctor.name }]}
        actions={
          <Button asChild>
            <Link href={`/doctors/${doctor.id}/patients/new` as Route}>
              <UserPlus aria-hidden="true" />
              Create and assign patient
            </Link>
          </Button>
        }
      />
      <section
        aria-labelledby="profile-heading"
        className="rounded-2xl border bg-card p-5 shadow-card sm:p-6"
      >
        <h2 id="profile-heading" className="text-lg">
          Profile
        </h2>
        <dl className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {details.map(({ label, value, icon: Icon, href }) => (
            <div key={label} className="flex gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-secondary text-primary">
                <Icon aria-hidden="true" className="size-4" />
              </span>
              <div className="min-w-0">
                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {label}
                </dt>
                <dd className="mt-1 break-words font-medium">
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
          ))}
        </dl>
      </section>
      <DoctorPatients
        doctorId={doctor.id}
        patients={patientResult.patients}
        meta={patientResult.meta}
      />
    </>
  );
}

import { CalendarDays, Mail, MapPin, Phone, Stethoscope, UserRound } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/layout/page-navigation";
import { PatientDeleteControl } from "@/components/patients/patient-delete-control";
import { PatientEditControl } from "@/components/patients/patient-edit-control";
import { Button } from "@/components/ui/button";
import { ApiClientError } from "@/lib/api/errors";
import type { Patient } from "@/lib/api/schemas/patient";
import { getDoctorDetail } from "@/lib/doctors/doctor.service.server";
import { getPatientDetail } from "@/lib/patients/patient.service.server";

export const instant = false;

const optional = (value: string | number | undefined) => value ?? "Not provided";

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
  const details = [
    { label: "Condition", value: patient.condition, icon: Stethoscope },
    { label: "Age", value: optional(patient.age), icon: UserRound },
    { label: "Gender", value: optional(patient.gender), icon: UserRound },
    {
      label: "Email",
      value: optional(patient.email),
      icon: Mail,
      href: patient.email ? `mailto:${patient.email}` : undefined,
    },
    {
      label: "Phone",
      value: optional(patient.phone),
      icon: Phone,
      href: patient.phone ? `tel:${patient.phone}` : undefined,
    },
    { label: "Address", value: optional(patient.address), icon: MapPin },
    {
      label: "Created",
      value: new Intl.DateTimeFormat("en", { dateStyle: "long", timeZone: "UTC" }).format(
        new Date(patient.createdAt),
      ),
      icon: CalendarDays,
    },
  ];
  return (
    <>
      <PageHeader
        kind="detail"
        title={patient.name}
        description="Patient record and assigned doctor."
        breadcrumbs={[{ label: "Patients", href: "/patients" }, { label: patient.name }]}
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
      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <section
          aria-labelledby="patient-heading"
          className="rounded-2xl border bg-card p-4 shadow-card sm:p-5"
        >
          <h2 id="patient-heading" className="text-lg">
            Patient details
          </h2>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2">
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
        <aside
          aria-labelledby="doctor-heading"
          className="rounded-2xl border bg-card p-4 shadow-card sm:p-5"
        >
          <h2 id="doctor-heading" className="text-lg">
            Assigned doctor
          </h2>
          <p className="mt-4 font-semibold">{doctor.name}</p>
          <p className="mt-1 text-sm text-muted-foreground">{doctor.specialization}</p>
          <Button asChild variant="outline" className="mt-4">
            <Link href={`/doctors/${doctor.id}` as Route}>View doctor</Link>
          </Button>
        </aside>
      </div>
    </>
  );
}

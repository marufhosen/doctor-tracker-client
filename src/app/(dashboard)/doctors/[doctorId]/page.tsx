import { notFound } from "next/navigation";

import { DoctorPatients } from "@/components/doctors/doctor-patients";
import { PageHeader } from "@/components/layout/page-navigation";
import { CreatePatientDialog } from "@/components/patients/create-patient-dialog";
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

  const initials = doctor.name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      <PageHeader
        kind="detail"
        title={doctor.name}
        description="Doctors / Patient list"
        breadcrumbs={[{ label: "Doctors", href: "/doctors" }, { label: doctor.name }]}
        actions={
          <CreatePatientDialog
            doctorId={doctor.id}
            doctorName={doctor.name}
            triggerLabel="Add patient"
          />
        }
      />
      <section
        aria-labelledby="profile-heading"
        className="rounded-[10px] border bg-card p-4 shadow-card sm:p-5"
      >
        <h2 id="profile-heading" className="sr-only">
          Doctor profile
        </h2>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <span className="grid size-14 shrink-0 place-items-center rounded-full bg-secondary text-lg font-semibold text-primary">
            {initials}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-lg font-semibold">
              {doctor.specialization} · {doctor.hospital}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              <a href={`mailto:${doctor.email}`} className="hover:text-primary">
                {doctor.email}
              </a>
              <span aria-hidden="true"> · </span>
              <a href={`tel:${doctor.phone}`} className="hover:text-primary">
                {doctor.phone}
              </a>
            </p>
          </div>
          <p className="text-lg font-semibold text-primary">{patientResult.meta.total} patients</p>
        </div>
      </section>
      <DoctorPatients
        doctorId={doctor.id}
        patients={patientResult.patients}
        meta={patientResult.meta}
      />
    </>
  );
}

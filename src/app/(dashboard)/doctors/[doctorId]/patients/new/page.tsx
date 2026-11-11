import type { Route } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/page-navigation";
import { PatientForm } from "@/components/patients/patient-form";
import { getDoctorDetail } from "@/lib/doctors/doctor.service.server";

export default async function NewPatientPage({
  params,
}: PageProps<"/doctors/[doctorId]/patients/new">) {
  const { doctorId } = await params;
  const doctor = await getDoctorDetail(doctorId).catch(() => notFound());
  return (
    <>
      <PageHeader
        kind="form"
        title="Add patient"
        description={`Create a patient under ${doctor.name}.`}
        breadcrumbs={[
          { label: "Doctors", href: "/doctors" },
          { label: doctor.name, href: `/doctors/${doctor.id}` as Route },
          { label: "Add patient" },
        ]}
      />
      <PatientForm doctorId={doctor.id} />
    </>
  );
}

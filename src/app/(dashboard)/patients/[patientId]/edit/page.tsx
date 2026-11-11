import type { Route } from "next";
import { notFound } from "next/navigation";
import { updatePatientAction } from "@/actions/patient.actions";
import { PageHeader } from "@/components/layout/page-navigation";
import { PatientEditForm } from "@/components/patients/patient-edit-form";
import { ApiClientError } from "@/lib/api/errors";
import type { Patient } from "@/lib/api/schemas/patient";
import { getPatientDetail } from "@/lib/patients/patient.service.server";

export default async function EditPatientPage({ params }: PageProps<"/patients/[patientId]/edit">) {
  const { patientId } = await params;
  let patient: Patient;
  try {
    patient = await getPatientDetail(patientId);
  } catch (error) {
    if (error instanceof ApiClientError && error.kind !== "not_found") throw error;
    notFound();
  }
  return (
    <>
      <PageHeader
        kind="form"
        title={`Edit ${patient.name}`}
        description="Update patient details. Doctor assignment cannot be changed here."
        breadcrumbs={[
          { label: "Patients", href: "/patients" },
          { label: patient.name, href: `/patients/${patient.id}` as Route },
          { label: "Edit" },
        ]}
      />
      <section className="rounded-2xl border bg-card p-5 shadow-card sm:p-6">
        <PatientEditForm patient={patient} updateAction={updatePatientAction} />
      </section>
    </>
  );
}

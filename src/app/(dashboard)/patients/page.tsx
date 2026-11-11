import { PageHeader } from "@/components/layout/page-navigation";
import { CreatePatientDialog } from "@/components/patients/create-patient-dialog";
import { PatientDeleteControl } from "@/components/patients/patient-delete-control";
import { PatientEditControl } from "@/components/patients/patient-edit-control";
import { PatientPagination } from "@/components/patients/patient-pagination";
import { PatientToolbar } from "@/components/patients/patient-toolbar";
import { PatientsList } from "@/components/patients/patients-list";
import { getDoctorList } from "@/lib/doctors/doctor.service.server";
import { getPatientList } from "@/lib/patients/patient.service.server";
import { parsePatientListQuery } from "@/lib/patients/patient-query";

export const instant = false;

export default async function PatientsPage({ searchParams }: PageProps<"/patients">) {
  const query = parsePatientListQuery(await searchParams);
  const [{ patients, meta }, { doctors }] = await Promise.all([
    getPatientList(query),
    getDoctorList({ page: 1, limit: 100, sortBy: "name", sortOrder: "asc" }),
  ]);

  return (
    <section aria-labelledby="patients-heading">
      <PageHeader
        title="Patients"
        description={`${meta.total.toLocaleString()} ${meta.total === 1 ? "patient" : "patients"} total`}
        actions={<CreatePatientDialog doctors={doctors.map(({ id, name }) => ({ id, name }))} />}
      />
      <h2 id="patients-heading" className="sr-only">
        Patients
      </h2>
      <PatientToolbar query={query} doctors={doctors} />
      <div className="mt-3 overflow-hidden rounded-[10px] border bg-card shadow-card">
        <PatientsList
          patients={patients}
          doctors={doctors}
          renderEdit={(patient) => <PatientEditControl patient={patient} compact />}
          renderDelete={(patient) => (
            <PatientDeleteControl
              key={patient.id}
              patientId={patient.id}
              patientName={patient.name}
              compact
            />
          )}
        />
        <PatientPagination meta={meta} query={query} />
      </div>
    </section>
  );
}

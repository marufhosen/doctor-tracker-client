import { PatientSearch } from "@/components/patients/patient-search";
import { PatientsList } from "@/components/patients/patients-list";
import { getPatientList } from "@/lib/patients/patient.service.server";
import { parsePatientListQuery } from "@/lib/patients/patient-query";

export default async function PatientsPage({ searchParams }: PageProps<"/patients">) {
  const query = parsePatientListQuery(await searchParams);
  const { patients, meta } = await getPatientList(query);

  return (
    <section aria-labelledby="patients-heading">
      <h2 id="patients-heading" className="text-2xl">
        Patient directory
      </h2>
      <p className="mt-2 text-muted-foreground">
        {meta.total.toLocaleString()} {meta.total === 1 ? "patient" : "patients"}
      </p>
      <div className="mt-6">
        <PatientSearch value={query.search} />
      </div>
      <div className="mt-6">
        <PatientsList patients={patients} />
      </div>
    </section>
  );
}

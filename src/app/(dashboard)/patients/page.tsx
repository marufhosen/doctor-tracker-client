import { PatientFilters } from "@/components/patients/patient-filters";
import { PatientSearch } from "@/components/patients/patient-search";
import { PatientsList } from "@/components/patients/patients-list";
import { getDoctorList } from "@/lib/doctors/doctor.service.server";
import { getPatientList } from "@/lib/patients/patient.service.server";
import { parsePatientListQuery } from "@/lib/patients/patient-query";

export default async function PatientsPage({ searchParams }: PageProps<"/patients">) {
  const query = parsePatientListQuery(await searchParams);
  const [{ patients, meta }, { doctors }] = await Promise.all([
    getPatientList(query),
    getDoctorList({ page: 1, limit: 100, sortBy: "name", sortOrder: "asc" }),
  ]);

  return (
    <section aria-labelledby="patients-heading">
      <h2 id="patients-heading" className="text-2xl">
        Patient directory
      </h2>
      <p className="mt-2 text-muted-foreground">
        {meta.total.toLocaleString()} {meta.total === 1 ? "patient" : "patients"}
      </p>
      <div className="mt-6">
        <PatientSearch
          value={query.search}
          preservedQuery={{
            doctorId: query.doctorId,
            condition: query.condition,
            createdFrom: query.createdFrom?.slice(0, 10),
            createdTo: query.createdTo?.slice(0, 10),
            sortBy: query.sortBy,
            sortOrder: query.sortOrder,
          }}
        />
      </div>
      <div className="mt-4">
        <PatientFilters query={query} doctors={doctors} />
      </div>
      <div className="mt-6">
        <PatientsList patients={patients} />
      </div>
    </section>
  );
}

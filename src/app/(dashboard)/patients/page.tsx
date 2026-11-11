import { PatientFilters } from "@/components/patients/patient-filters";
import { PatientPagination } from "@/components/patients/patient-pagination";
import { PatientSearch } from "@/components/patients/patient-search";
import { PatientsList } from "@/components/patients/patients-list";
import { Button } from "@/components/ui/button";
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
        title="Patient directory"
        description={`${meta.total.toLocaleString()} ${meta.total === 1 ? "patient" : "patients"}`}
        actions={
          <Button asChild>
            <Link href="/patients/new">
              <Plus aria-hidden="true" />
              Create patient
            </Link>
          </Button>
        }
      />
      <h2 id="patients-heading" className="sr-only">
        Patients
      </h2>
      <div className="mt-6 rounded-[10px] border bg-card p-5">
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
      <div className="mt-6">
        <PatientPagination meta={meta} query={query} />
      </div>
    </section>
  );
}

import { Plus } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-navigation";

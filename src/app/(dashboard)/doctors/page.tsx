import { Plus } from "lucide-react";
import Link from "next/link";
import { DoctorFilters } from "@/components/doctors/doctor-filters";
import { DoctorPagination } from "@/components/doctors/doctor-pagination";
import { DoctorSearch } from "@/components/doctors/doctor-search";
import { DoctorsList } from "@/components/doctors/doctors-list";
import { PageHeader } from "@/components/layout/page-navigation";
import { Button } from "@/components/ui/button";
import { getDoctorList } from "@/lib/doctors/doctor.service.server";
import { parseDoctorListQuery } from "@/lib/doctors/doctor-query";

export default async function DoctorsPage({ searchParams }: PageProps<"/doctors">) {
  const query = parseDoctorListQuery(await searchParams);
  const { doctors, meta } = await getDoctorList(query);

  return (
    <section aria-labelledby="doctors-heading">
      <PageHeader
        title="Doctor directory"
        description={`${meta.total.toLocaleString()} ${meta.total === 1 ? "doctor" : "doctors"}`}
        actions={
          <Button asChild>
            <Link href="/doctors/new">
              <Plus aria-hidden="true" />
              Add doctor
            </Link>
          </Button>
        }
      />
      <h2 id="doctors-heading" className="sr-only">
        Doctors
      </h2>
      <div className="mt-6">
        <DoctorSearch
          value={query.search}
          preservedQuery={{
            specialization: query.specialization,
            hospital: query.hospital,
            createdFrom: query.createdFrom?.slice(0, 10),
            createdTo: query.createdTo?.slice(0, 10),
            sortBy: query.sortBy,
            sortOrder: query.sortOrder,
          }}
        />
      </div>
      <div className="mt-4">
        <DoctorFilters query={query} />
      </div>
      <div className="mt-6">
        <DoctorsList doctors={doctors} />
      </div>
      <div className="mt-6">
        <DoctorPagination meta={meta} query={query} />
      </div>
    </section>
  );
}

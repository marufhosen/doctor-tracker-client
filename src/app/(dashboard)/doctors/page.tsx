import { CreateDoctorDialog } from "@/components/doctors/create-doctor-dialog";
import { DoctorPagination } from "@/components/doctors/doctor-pagination";
import { DoctorToolbar } from "@/components/doctors/doctor-toolbar";
import { DoctorsList } from "@/components/doctors/doctors-list";
import { PageHeader } from "@/components/layout/page-navigation";
import { getDoctorList } from "@/lib/doctors/doctor.service.server";
import { parseDoctorListQuery } from "@/lib/doctors/doctor-query";

export const instant = false;

export default async function DoctorsPage({ searchParams }: PageProps<"/doctors">) {
  const query = parseDoctorListQuery(await searchParams);
  const { doctors, meta } = await getDoctorList(query);

  return (
    <section aria-labelledby="doctors-heading">
      <PageHeader
        title="Doctors"
        description={`${meta.total.toLocaleString()} ${meta.total === 1 ? "doctor" : "doctors"} total`}
        actions={<CreateDoctorDialog />}
      />
      <h2 id="doctors-heading" className="sr-only">
        Doctors
      </h2>
      <DoctorToolbar query={query} />
      <div className="mt-3 overflow-hidden rounded-[10px] border bg-card shadow-card">
        <DoctorsList doctors={doctors} />
        <DoctorPagination meta={meta} query={query} />
      </div>
    </section>
  );
}

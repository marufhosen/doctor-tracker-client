import { DoctorSearch } from "@/components/doctors/doctor-search";
import { DoctorsList } from "@/components/doctors/doctors-list";
import { getDoctorList } from "@/lib/doctors/doctor.service.server";
import { parseDoctorListQuery } from "@/lib/doctors/doctor-query";

export default async function DoctorsPage({ searchParams }: PageProps<"/doctors">) {
  const query = parseDoctorListQuery(await searchParams);
  const { doctors, meta } = await getDoctorList(query);

  return (
    <section aria-labelledby="doctors-heading">
      <h2 id="doctors-heading" className="text-2xl">
        Doctor directory
      </h2>
      <p className="mt-2 text-muted-foreground">
        {meta.total.toLocaleString()} {meta.total === 1 ? "doctor" : "doctors"}
      </p>
      <div className="mt-6">
        <DoctorSearch value={query.search} />
      </div>
      <div className="mt-6">
        <DoctorsList doctors={doctors} />
      </div>
    </section>
  );
}

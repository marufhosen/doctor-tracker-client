import { DoctorForm } from "@/components/doctors/doctor-form";
import { PageHeader } from "@/components/layout/page-navigation";

export default function NewDoctorPage() {
  return (
    <>
      <PageHeader
        kind="form"
        title="Add doctor"
        description="Create a doctor record using the supported clinical and contact fields."
        breadcrumbs={[{ label: "Doctors", href: "/doctors" }, { label: "Add doctor" }]}
      />
      <DoctorForm />
    </>
  );
}

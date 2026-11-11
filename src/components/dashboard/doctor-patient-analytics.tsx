import dynamic from "next/dynamic";
import type { DoctorPatientCount } from "@/lib/api/schemas/dashboard";

const DoctorPatientChart = dynamic(() =>
  import("@/components/dashboard/doctor-patient-chart.client").then(
    (module) => module.DoctorPatientChart,
  ),
);

export function DoctorPatientAnalytics({ doctors }: { doctors: DoctorPatientCount[] }) {
  return (
    <section
      aria-labelledby="doctor-patients-heading"
      className="h-full rounded-[10px] border bg-card shadow-card"
    >
      <div className="px-5 pt-6 sm:px-6">
        <h2 id="doctor-patients-heading" className="text-lg">
          Patients by doctor
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">Doctors by assigned patient count.</p>
      </div>
      <div className="p-4 sm:p-6">
        {doctors.length === 0 ? (
          <div className="grid min-h-48 place-items-center text-center text-sm text-muted-foreground">
            No doctors are available for patient assignment analytics yet.
          </div>
        ) : (
          <>
            <DoctorPatientChart data={doctors} />
            <DoctorAnalyticsTable doctors={doctors} />
          </>
        )}
      </div>
    </section>
  );
}

export function DoctorAnalyticsTable({ doctors }: { doctors: DoctorPatientCount[] }) {
  return (
    <details className="mt-4 rounded-lg border bg-muted/35">
      <summary className="min-h-11 cursor-pointer px-4 py-3 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        View chart data
      </summary>
      <div className="overflow-x-auto border-t">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">Patient count for every doctor</caption>
          <thead>
            <tr className="text-muted-foreground">
              <th scope="col" className="px-4 py-2 font-medium">
                Doctor
              </th>
              <th scope="col" className="px-4 py-2 text-right font-medium">
                Patients
              </th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doctor) => (
              <tr key={doctor.doctorId} className="border-t">
                <th scope="row" className="px-4 py-2 font-medium">
                  {doctor.doctorName}
                </th>
                <td className="px-4 py-2 text-right tabular-nums">{doctor.patientCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}

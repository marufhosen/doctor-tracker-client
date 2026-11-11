import type { DoctorPatientCount } from "@/lib/api/schemas/dashboard";

const workloadBands = [
  { label: "No patients", matches: (count: number) => count === 0 },
  { label: "1–5 patients", matches: (count: number) => count >= 1 && count <= 5 },
  { label: "6–10 patients", matches: (count: number) => count >= 6 && count <= 10 },
  { label: "11–20 patients", matches: (count: number) => count >= 11 && count <= 20 },
  { label: "21+ patients", matches: (count: number) => count >= 21 },
] as const;

export function DoctorPatientAnalytics({ doctors }: { doctors: DoctorPatientCount[] }) {
  const totalPatients = doctors.reduce((total, doctor) => total + doctor.patientCount, 0);
  const activeDoctors = doctors.filter((doctor) => doctor.patientCount > 0).length;
  const averagePatients = doctors.length > 0 ? totalPatients / doctors.length : 0;
  const activePercentage = doctors.length > 0 ? (activeDoctors / doctors.length) * 100 : 0;
  const distribution = workloadBands.map((band) => ({
    label: band.label,
    doctorCount: doctors.filter((doctor) => band.matches(doctor.patientCount)).length,
  }));
  const largestBand = Math.max(1, ...distribution.map((band) => band.doctorCount));

  return (
    <section
      aria-labelledby="doctor-patients-heading"
      className="h-full rounded-[10px] border bg-card shadow-card"
    >
      <div className="px-4 pt-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 id="doctor-patients-heading" className="text-base">
              Doctor workload
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Doctors grouped by assigned patient load.
            </p>
          </div>
          {doctors.length > 0 && (
            <span className="rounded-md bg-secondary px-2 py-1 text-[10px] font-medium text-primary">
              {doctors.length.toLocaleString()} doctors
            </span>
          )}
        </div>
      </div>
      <div className="p-4">
        {doctors.length === 0 ? (
          <div className="grid min-h-40 place-items-center text-center text-sm text-muted-foreground">
            No doctors are available for patient assignment analytics yet.
          </div>
        ) : (
          <>
            <dl className="mb-4 grid grid-cols-3 divide-x rounded-md border bg-muted/20 py-2">
              <div className="px-2 text-center">
                <dt className="text-[10px] text-muted-foreground">Patients</dt>
                <dd className="mt-0.5 text-sm font-semibold tabular-nums">
                  {totalPatients.toLocaleString()}
                </dd>
              </div>
              <div className="px-2 text-center">
                <dt className="text-[10px] text-muted-foreground">Average load</dt>
                <dd className="mt-0.5 text-sm font-semibold tabular-nums">
                  {averagePatients.toFixed(1)}
                </dd>
              </div>
              <div className="px-2 text-center">
                <dt className="text-[10px] text-muted-foreground">Active</dt>
                <dd className="mt-0.5 text-sm font-semibold tabular-nums">
                  {activePercentage.toFixed(0)}%
                </dd>
              </div>
            </dl>
            <ul className="space-y-3" aria-label="Doctor workload distribution">
              {distribution.map((band) => {
                const percentage = (band.doctorCount / doctors.length) * 100;
                return (
                  <li
                    key={band.label}
                    className="grid grid-cols-[6.5rem_1fr_2.75rem] items-center gap-2"
                  >
                    <span className="text-[11px] text-muted-foreground">{band.label}</span>
                    <span className="h-2 overflow-hidden rounded-full bg-secondary">
                      <span
                        className="block h-full rounded-full bg-primary"
                        style={{ width: `${(band.doctorCount / largestBand) * 100}%` }}
                      />
                    </span>
                    <span
                      className="text-right text-[11px] font-medium tabular-nums"
                      title={`${percentage.toFixed(1)}% of doctors`}
                    >
                      {band.doctorCount.toLocaleString()}
                    </span>
                  </li>
                );
              })}
            </ul>
            <p className="mt-4 border-t pt-3 text-[10px] text-muted-foreground">
              Bar length compares the number of doctors in each workload band.
            </p>
          </>
        )}
      </div>
    </section>
  );
}

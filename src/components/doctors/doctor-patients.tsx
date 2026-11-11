import type { PaginationMeta } from "@/lib/api/schemas/common";
import type { Patient } from "@/lib/api/schemas/patient";

export function DoctorPatients({ patients, meta }: { patients: Patient[]; meta: PaginationMeta }) {
  return (
    <section
      aria-labelledby="patients-heading"
      className="mt-6 rounded-2xl border bg-card p-5 shadow-card sm:p-6"
    >
      <div className="flex items-baseline justify-between gap-4">
        <h2 id="patients-heading" className="text-lg">
          Patients
        </h2>
        <p className="text-sm text-muted-foreground">{meta.total} total</p>
      </div>
      {patients.length === 0 ? (
        <p className="mt-6 rounded-lg bg-muted p-6 text-center text-sm text-muted-foreground">
          No patients match this doctor view.
        </p>
      ) : (
        <ul className="mt-4 divide-y">
          {patients.map((patient) => (
            <li
              key={patient.id}
              className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <span className="font-medium">{patient.name}</span>
              <span className="text-sm text-muted-foreground">{patient.condition}</span>
            </li>
          ))}
        </ul>
      )}
      {meta.totalPages > 0 && (
        <p className="mt-4 text-sm text-muted-foreground">
          Page {meta.page} of {meta.totalPages}
        </p>
      )}
    </section>
  );
}

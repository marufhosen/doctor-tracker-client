import type { Route } from "next";
import Link from "next/link";

import { RemovePatientButton } from "@/components/doctors/remove-patient-button";
import type { PaginationMeta } from "@/lib/api/schemas/common";
import type { Patient } from "@/lib/api/schemas/patient";

export function DoctorPatients({
  doctorId,
  patients,
  meta,
}: {
  doctorId: string;
  patients: Patient[];
  meta: PaginationMeta;
}) {
  return (
    <section
      aria-labelledby="patients-heading"
      className="mt-4 overflow-hidden rounded-[10px] border bg-card shadow-card"
    >
      <div className="flex items-baseline gap-3 px-4 py-3">
        <h2 id="patients-heading" className="text-base">
          Assigned patients
        </h2>
        <p className="text-sm text-muted-foreground">{meta.total} patients</p>
      </div>
      {patients.length === 0 ? (
        <p className="border-t bg-muted/40 p-8 text-center text-sm text-muted-foreground">
          No patients match this doctor view.
        </p>
      ) : (
        <>
          <div className="hidden md:block">
            <table className="w-full border-collapse text-left text-sm">
              <caption className="sr-only">Patients assigned to this doctor</caption>
              <thead className="border-y bg-muted/60 text-xs text-muted-foreground">
                <tr>
                  <th scope="col" className="px-4 py-2.5 font-medium">
                    Patient ID
                  </th>
                  <th scope="col" className="px-4 py-2.5 font-medium">
                    Patient name
                  </th>
                  <th scope="col" className="px-4 py-2.5 font-medium">
                    Condition
                  </th>
                  <th scope="col" className="px-4 py-2.5 font-medium">
                    Contact
                  </th>
                  <th scope="col" className="px-4 py-2.5">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {patients.map((patient) => (
                  <tr key={patient.id} className="transition-colors hover:bg-muted/30">
                    <td className="px-4 py-2.5 text-muted-foreground">
                      PT-{patient.id.slice(-6).toUpperCase()}
                    </td>
                    <td className="px-4 py-2.5 font-medium">
                      <Link
                        href={`/patients/${patient.id}` as Route}
                        className="hover:text-primary"
                      >
                        {patient.name}
                      </Link>
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground">{patient.condition}</td>
                    <td className="px-4 py-2.5 text-muted-foreground">
                      {patient.email ?? patient.phone ?? "—"}
                    </td>
                    <td className="px-4 py-2.5">
                      <RemovePatientButton
                        doctorId={doctorId}
                        patientId={patient.id}
                        patientName={patient.name}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ul className="divide-y md:hidden">
            {patients.map((patient) => (
              <li key={patient.id} className="grid gap-2 px-4 py-3">
                <Link
                  href={`/patients/${patient.id}` as Route}
                  className="font-medium hover:text-primary"
                >
                  {patient.name}
                </Link>
                <span className="text-sm text-muted-foreground">{patient.condition}</span>
                <RemovePatientButton
                  doctorId={doctorId}
                  patientId={patient.id}
                  patientName={patient.name}
                />
              </li>
            ))}
          </ul>
        </>
      )}
      {meta.totalPages > 0 && (
        <p className="border-t px-4 py-3 text-sm text-muted-foreground">
          Page {meta.page} of {meta.totalPages}
        </p>
      )}
    </section>
  );
}

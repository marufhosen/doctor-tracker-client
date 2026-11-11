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
      className="mt-6 overflow-hidden rounded-[10px] border bg-card shadow-card"
    >
      <div className="flex items-baseline gap-4 px-5 py-5">
        <h2 id="patients-heading" className="text-lg">
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
              <thead className="bg-muted text-xs font-medium text-muted-foreground">
                <tr>
                  <th className="px-5 py-2">Patient ID</th>
                  <th className="px-5 py-2">Patient name</th>
                  <th className="px-5 py-2">Condition</th>
                  <th className="px-5 py-2">Contact</th>
                  <th className="px-5 py-2">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {patients.map((patient) => (
                  <tr key={patient.id}>
                    <td className="px-5 py-4 text-muted-foreground">
                      PT-{patient.id.slice(-6).toUpperCase()}
                    </td>
                    <td className="px-5 py-4 font-medium">
                      <Link
                        href={`/patients/${patient.id}` as Route}
                        className="hover:text-primary"
                      >
                        {patient.name}
                      </Link>
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">{patient.condition}</td>
                    <td className="px-5 py-4 text-muted-foreground">
                      {patient.email ?? patient.phone ?? "—"}
                    </td>
                    <td className="px-5 py-4">
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
              <li key={patient.id} className="grid gap-2 px-5 py-4">
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
        <p className="border-t px-5 py-4 text-sm text-muted-foreground">
          Page {meta.page} of {meta.totalPages}
        </p>
      )}
    </section>
  );
}

import { Eye, UserRound } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import type { Patient } from "@/lib/api/schemas/patient";

type DoctorOption = { id: string; name: string };

const href = (id: string) => `/patients/${id}` as Route;
const optional = (value: string | number | undefined) => value ?? "Not provided";
const patientCode = (id: string) => `PT-${id.slice(-6).toUpperCase()}`;

function RowActions({
  patient,
  renderEdit,
  renderDelete,
}: {
  patient: Patient;
  renderEdit?: ((patient: Patient) => ReactNode) | undefined;
  renderDelete?: ((patient: Patient) => ReactNode) | undefined;
}) {
  return (
    <div className="flex items-center justify-end gap-1">
      <Button
        asChild
        variant="ghost"
        size="icon-lg"
        className="text-muted-foreground hover:text-primary"
      >
        <Link href={href(patient.id)} aria-label={`View ${patient.name}`}>
          <Eye aria-hidden="true" className="size-4" />
        </Link>
      </Button>
      {renderEdit?.(patient)}
      {renderDelete?.(patient)}
    </div>
  );
}

function Contact({ patient }: { patient: Patient }) {
  const contact = patient.email ?? patient.phone;
  if (!contact) return <span>Not provided</span>;
  return (
    <>
      {patient.email ? (
        <a href={`mailto:${patient.email}`} className="block break-all hover:text-primary">
          {patient.email}
        </a>
      ) : null}
      {patient.phone ? (
        <a href={`tel:${patient.phone}`} className="mt-0.5 block hover:text-primary">
          {patient.phone}
        </a>
      ) : null}
    </>
  );
}

export function PatientsList({
  patients,
  doctors = [],
  renderEdit,
  renderDelete,
}: {
  patients: Patient[];
  doctors?: DoctorOption[] | undefined;
  renderEdit?: ((patient: Patient) => ReactNode) | undefined;
  renderDelete?: ((patient: Patient) => ReactNode) | undefined;
}) {
  const doctorNames = new Map(doctors.map((doctor) => [doctor.id, doctor.name]));

  if (patients.length === 0) {
    return (
      <div className="px-5 py-10 text-center">
        <UserRound aria-hidden="true" className="mx-auto size-8 text-muted-foreground" />
        <h3 className="mt-4 text-lg">No patients found</h3>
        <p className="mt-1 text-sm text-muted-foreground">No patient records match this view.</p>
      </div>
    );
  }

  return (
    <>
      <div className="hidden md:block">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">Patient directory</caption>
          <thead className="border-b bg-muted/60 text-xs text-muted-foreground">
            <tr>
              <th scope="col" className="px-4 py-2.5 font-medium">
                Patient
              </th>
              <th scope="col" className="px-4 py-2.5 font-medium">
                Condition
              </th>
              <th scope="col" className="px-4 py-2.5 font-medium">
                Age
              </th>
              <th scope="col" className="px-4 py-2.5 font-medium">
                Doctor
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
                <th scope="row" className="px-4 py-2.5 text-left font-medium">
                  <Link
                    href={href(patient.id)}
                    className="rounded-sm hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {patient.name}
                  </Link>
                  <span className="mt-0.5 block text-xs font-normal text-muted-foreground">
                    {patientCode(patient.id)}
                  </span>
                </th>
                <td className="px-4 py-2.5 text-muted-foreground">{patient.condition}</td>
                <td className="px-4 py-2.5 text-muted-foreground">{optional(patient.age)}</td>
                <td className="px-4 py-2.5 text-muted-foreground">
                  {doctorNames.get(patient.doctorId) ?? "Not provided"}
                </td>
                <td className="px-4 py-2.5 text-muted-foreground">
                  <Contact patient={patient} />
                </td>
                <td className="px-4 py-2.5">
                  <RowActions
                    patient={patient}
                    renderEdit={renderEdit}
                    renderDelete={renderDelete}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="divide-y md:hidden">
        {patients.map((patient) => (
          <li key={patient.id} className="px-4 py-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <Link
                  href={href(patient.id)}
                  className="rounded-sm font-medium hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {patient.name}
                </Link>
                <p className="mt-0.5 text-xs text-muted-foreground">{patientCode(patient.id)}</p>
              </div>
              <div className="shrink-0">
                <RowActions patient={patient} renderEdit={renderEdit} renderDelete={renderDelete} />
              </div>
            </div>
            <dl className="mt-2.5 grid gap-1.5 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Condition</dt>
                <dd className="text-right">{patient.condition}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Age</dt>
                <dd>{optional(patient.age)}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Doctor</dt>
                <dd className="text-right">
                  {doctorNames.get(patient.doctorId) ?? "Not provided"}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Contact</dt>
                <dd className="min-w-0 break-all text-right">
                  <Contact patient={patient} />
                </dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>
    </>
  );
}

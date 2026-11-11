import { ArrowRight, Mail, Phone, UserRound } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";

import type { Patient } from "@/lib/api/schemas/patient";

const href = (id: string) => `/patients/${id}` as Route;
const optional = (value: string | number | undefined) => value ?? "Not provided";

export function PatientsList({ patients }: { patients: Patient[] }) {
  if (patients.length === 0) {
    return (
      <div className="rounded-2xl border bg-card px-6 py-12 text-center shadow-card">
        <UserRound aria-hidden="true" className="mx-auto size-8 text-muted-foreground" />
        <h3 className="mt-4 text-lg">No patients found</h3>
        <p className="mt-1 text-sm text-muted-foreground">No patient records match this view.</p>
      </div>
    );
  }
  return (
    <>
      <div className="hidden overflow-hidden rounded-2xl border bg-card shadow-card md:block">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">Patient directory</caption>
          <thead className="border-b bg-muted/45 text-muted-foreground">
            <tr>
              <th scope="col" className="px-5 py-3 font-medium">
                Patient
              </th>
              <th scope="col" className="px-5 py-3 font-medium">
                Condition
              </th>
              <th scope="col" className="px-5 py-3 font-medium">
                Age
              </th>
              <th scope="col" className="px-5 py-3 font-medium">
                Contact
              </th>
              <th scope="col" className="px-5 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient.id} className="border-b last:border-0 hover:bg-muted/25">
                <th scope="row" className="px-5 py-4 font-semibold">
                  {patient.name}
                </th>
                <td className="px-5 py-4">{patient.condition}</td>
                <td className="px-5 py-4">{optional(patient.age)}</td>
                <td className="px-5 py-4">
                  <span className="block">{optional(patient.email)}</span>
                  <span className="mt-1 block text-muted-foreground">
                    {optional(patient.phone)}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <Link
                    href={href(patient.id)}
                    aria-label={`View ${patient.name}`}
                    className="inline-grid size-10 place-items-center rounded-lg text-primary hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <ArrowRight aria-hidden="true" className="size-4" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="grid gap-4 md:hidden">
        {patients.map((patient) => (
          <li key={patient.id} className="rounded-2xl border bg-card p-5 shadow-card">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold">{patient.name}</h3>
                <p className="mt-1 text-sm text-primary">{patient.condition}</p>
              </div>
              <Link
                href={href(patient.id)}
                aria-label={`View ${patient.name}`}
                className="grid size-11 place-items-center rounded-lg bg-secondary text-primary"
              >
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </div>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Age</dt>
                <dd>{optional(patient.age)}</dd>
              </div>
              <div className="flex gap-2">
                <Mail aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <dt className="sr-only">Email</dt>
                <dd className="break-all">{optional(patient.email)}</dd>
              </div>
              <div className="flex gap-2">
                <Phone
                  aria-hidden="true"
                  className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                />
                <dt className="sr-only">Phone</dt>
                <dd>{optional(patient.phone)}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>
    </>
  );
}

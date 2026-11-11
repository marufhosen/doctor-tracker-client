import { Building2, Mail, Phone, Stethoscope } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";

import type { Doctor } from "@/lib/api/schemas/doctor";

const detailHref = (id: string) => `/doctors/${id}` as Route;

export function DoctorsList({ doctors }: { doctors: Doctor[] }) {
  if (doctors.length === 0) {
    return (
      <div className="rounded-2xl border bg-card px-6 py-12 text-center shadow-card">
        <Stethoscope aria-hidden="true" className="mx-auto size-8 text-muted-foreground" />
        <h3 className="mt-4 text-lg">No doctors found</h3>
        <p className="mt-1 text-sm text-muted-foreground">No doctor records match this view.</p>
      </div>
    );
  }

  return (
    <>
      <div className="hidden overflow-hidden rounded-[10px] border bg-card shadow-card md:block">
        <div className="px-5 py-5">
          <h3 className="text-base">All doctors</h3>
        </div>
        <table className="w-full text-left text-sm">
          <caption className="sr-only">Doctor directory</caption>
          <thead className="border-b bg-muted/70 text-xs text-muted-foreground">
            <tr>
              <th scope="col" className="px-5 py-3 font-medium">
                Doctor
              </th>
              <th scope="col" className="px-5 py-3 font-medium">
                Specialization
              </th>
              <th scope="col" className="px-5 py-3 font-medium">
                Hospital
              </th>
              <th scope="col" className="px-5 py-3 font-medium">
                Phone
              </th>
              <th scope="col" className="px-5 py-3 font-medium">
                Email
              </th>
              <th scope="col" className="px-5 py-3">
                <span className="sr-only">Details</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doctor) => (
              <tr key={doctor.id} className="border-b last:border-b-0 hover:bg-muted/25">
                <th scope="row" className="px-5 py-4 font-semibold">
                  {doctor.name}
                </th>
                <td className="px-5 py-4">{doctor.specialization}</td>
                <td className="px-5 py-4">{doctor.hospital}</td>
                <td className="px-5 py-4 text-muted-foreground">
                  <a className="hover:text-primary" href={`tel:${doctor.phone}`}>
                    {doctor.phone}
                  </a>
                </td>
                <td className="px-5 py-4 text-muted-foreground">
                  <a className="hover:text-primary" href={`mailto:${doctor.email}`}>
                    {doctor.email}
                  </a>
                </td>
                <td className="px-5 py-4 text-right">
                  <Link
                    href={detailHref(doctor.id)}
                    aria-label={`View ${doctor.name}`}
                    className="inline-flex min-h-10 items-center rounded-lg px-2 text-xs font-medium text-primary hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    View patients&nbsp;→
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="grid gap-4 md:hidden">
        {doctors.map((doctor) => (
          <li key={doctor.id} className="rounded-[10px] border bg-card p-5 shadow-card">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold">{doctor.name}</h3>
                <p className="mt-1 text-sm text-primary">{doctor.specialization}</p>
              </div>
              <Link
                href={detailHref(doctor.id)}
                aria-label={`View ${doctor.name}`}
                className="inline-flex min-h-10 items-center rounded-lg bg-secondary px-3 text-xs font-medium text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                View&nbsp;→
              </Link>
            </div>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex gap-2">
                <Building2
                  aria-hidden="true"
                  className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                />
                <dt className="sr-only">Hospital</dt>
                <dd>{doctor.hospital}</dd>
              </div>
              <div className="flex gap-2">
                <Mail aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <dt className="sr-only">Email</dt>
                <dd className="min-w-0 break-all">
                  <a href={`mailto:${doctor.email}`}>{doctor.email}</a>
                </dd>
              </div>
              <div className="flex gap-2">
                <Phone
                  aria-hidden="true"
                  className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                />
                <dt className="sr-only">Phone</dt>
                <dd>
                  <a href={`tel:${doctor.phone}`}>{doctor.phone}</a>
                </dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>
    </>
  );
}

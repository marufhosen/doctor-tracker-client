import { Eye, Stethoscope } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import type { Doctor } from "@/lib/api/schemas/doctor";

const detailHref = (id: string) => `/doctors/${id}` as Route;

export function DoctorsList({ doctors }: { doctors: Doctor[] }) {
  if (doctors.length === 0) {
    return (
      <div className="px-5 py-10 text-center">
        <Stethoscope aria-hidden="true" className="mx-auto size-8 text-muted-foreground" />
        <h3 className="mt-4 text-lg">No doctors found</h3>
        <p className="mt-1 text-sm text-muted-foreground">No doctor records match this view.</p>
      </div>
    );
  }

  return (
    <>
      <div className="hidden md:block">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">Doctor directory</caption>
          <thead className="border-b bg-muted/60 text-xs text-muted-foreground">
            <tr>
              <th scope="col" className="px-4 py-2.5 font-medium">
                Doctor
              </th>
              <th scope="col" className="px-4 py-2.5 font-medium">
                Specialization
              </th>
              <th scope="col" className="px-4 py-2.5 font-medium">
                Hospital
              </th>
              <th scope="col" className="px-4 py-2.5 font-medium">
                Phone
              </th>
              <th scope="col" className="px-4 py-2.5">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {doctors.map((doctor) => (
              <tr key={doctor.id} className="transition-colors hover:bg-muted/30">
                <th scope="row" className="px-4 py-2.5 text-left font-medium">
                  <Link
                    href={detailHref(doctor.id)}
                    className="rounded-sm hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {doctor.name}
                  </Link>
                  <span className="mt-0.5 block text-xs font-normal text-muted-foreground">
                    {doctor.email}
                  </span>
                </th>
                <td className="px-4 py-2.5">{doctor.specialization}</td>
                <td className="px-4 py-2.5 text-muted-foreground">{doctor.hospital}</td>
                <td className="px-4 py-2.5 text-muted-foreground">
                  <a href={`tel:${doctor.phone}`} className="hover:text-primary">
                    {doctor.phone}
                  </a>
                </td>
                <td className="px-4 py-2.5">
                  <div className="flex justify-end">
                    <Button
                      asChild
                      variant="ghost"
                      size="icon-lg"
                      className="text-muted-foreground hover:text-primary"
                    >
                      <Link href={detailHref(doctor.id)} aria-label={`View ${doctor.name}`}>
                        <Eye aria-hidden="true" className="size-4" />
                      </Link>
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="divide-y md:hidden">
        {doctors.map((doctor) => (
          <li key={doctor.id} className="flex items-start justify-between gap-3 px-4 py-3">
            <div className="min-w-0">
              <Link
                href={detailHref(doctor.id)}
                className="rounded-sm font-medium hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {doctor.name}
              </Link>
              <p className="mt-0.5 text-xs text-primary">{doctor.specialization}</p>
              <p className="mt-2 text-sm text-muted-foreground">{doctor.hospital}</p>
              <p className="mt-1 break-all text-sm text-muted-foreground">{doctor.email}</p>
            </div>
            <Button
              asChild
              variant="ghost"
              size="icon-lg"
              className="shrink-0 text-muted-foreground hover:text-primary"
            >
              <Link href={detailHref(doctor.id)} aria-label={`View ${doctor.name}`}>
                <Eye aria-hidden="true" className="size-4" />
              </Link>
            </Button>
          </li>
        ))}
      </ul>
    </>
  );
}

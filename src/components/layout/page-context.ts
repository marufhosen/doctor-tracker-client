import type { Route } from "next";

type PageContext = {
  eyebrow: string;
  title: string;
  parent?: { label: string; href: Route };
};

export function getPageContext(pathname: string): PageContext {
  if (pathname === "/dashboard") return { eyebrow: "Overview", title: "Dashboard" };

  if (pathname === "/doctors") return { eyebrow: "Clinical team", title: "Doctors" };
  if (pathname.startsWith("/doctors/")) {
    return {
      eyebrow: "Clinical team",
      title: "Doctor details",
      parent: { label: "Doctors", href: "/doctors" },
    };
  }

  if (pathname === "/patients") return { eyebrow: "Care records", title: "Patients" };
  if (pathname.startsWith("/patients/")) {
    return {
      eyebrow: "Care records",
      title: "Patient details",
      parent: { label: "Patients", href: "/patients" },
    };
  }

  return { eyebrow: "Administration", title: "Doctor Tracker" };
}

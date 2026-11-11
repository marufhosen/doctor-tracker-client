import { LayoutDashboard, Stethoscope, Users } from "lucide-react";
import type { Route } from "next";

export const primaryNavigation = [
  { href: "/dashboard" as Route, label: "Dashboard", icon: LayoutDashboard },
  { href: "/doctors" as Route, label: "Doctors", icon: Stethoscope },
  { href: "/patients" as Route, label: "Patients", icon: Users },
] as const;

export function isNavigationItemActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

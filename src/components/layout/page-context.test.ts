import { expect, test } from "bun:test";

import { getPageContext } from "@/components/layout/page-context";

test("provides page context for list, detail, and unknown routes", () => {
  expect(getPageContext("/dashboard")).toEqual({ eyebrow: "Overview", title: "Dashboard" });
  expect(getPageContext("/doctors/507f1f77bcf86cd799439011")).toEqual({
    eyebrow: "Clinical team",
    title: "Doctor details",
    parent: { label: "Doctors", href: "/doctors" },
  });
  expect(getPageContext("/patients/507f1f77bcf86cd799439012")).toEqual({
    eyebrow: "Care records",
    title: "Patient details",
    parent: { label: "Patients", href: "/patients" },
  });
  expect(getPageContext("/unknown")).toEqual({
    eyebrow: "Administration",
    title: "Doctor Tracker",
  });
});

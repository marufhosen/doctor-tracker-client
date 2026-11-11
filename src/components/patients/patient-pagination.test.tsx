import { expect, test } from "bun:test";
import { render, screen } from "@testing-library/react";
import { PatientPagination } from "@/components/patients/patient-pagination";

test("retains patient filters and respects pagination boundaries", () => {
  render(
    <PatientPagination
      meta={{ page: 2, limit: 10, total: 30, totalPages: 3 }}
      query={{ page: 2, limit: 10, search: "Rahim", condition: "Recovery" }}
    />,
  );
  expect(screen.getByRole("link", { name: /previous/i }).getAttribute("href")).toBe(
    "/patients?search=Rahim&condition=Recovery",
  );
  expect(screen.getByRole("link", { name: /next/i }).getAttribute("href")).toBe(
    "/patients?search=Rahim&condition=Recovery&page=3",
  );
});

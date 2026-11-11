import { expect, test } from "bun:test";
import { render, screen } from "@testing-library/react";

import { DoctorPagination } from "@/components/doctors/doctor-pagination";

test("preserves filters in bounded previous and next links", () => {
  render(
    <DoctorPagination
      meta={{ page: 2, limit: 10, total: 30, totalPages: 3 }}
      query={{ page: 2, limit: 10, search: "Samira", specialization: "Cardiology" }}
    />,
  );
  expect(screen.getByRole("link", { name: /previous/i }).getAttribute("href")).toBe(
    "/doctors?search=Samira&specialization=Cardiology",
  );
  expect(screen.getByRole("link", { name: /next/i }).getAttribute("href")).toBe(
    "/doctors?search=Samira&specialization=Cardiology&page=3",
  );
});

test("handles empty and final-page boundaries without invalid links", () => {
  const { rerender } = render(
    <DoctorPagination
      meta={{ page: 1, limit: 10, total: 0, totalPages: 0 }}
      query={{ page: 1, limit: 10 }}
    />,
  );
  expect(screen.queryByRole("navigation")).toBeNull();
  expect(screen.getByText("No pages to display.").isConnected).toBe(true);

  rerender(
    <DoctorPagination
      meta={{ page: 2, limit: 10, total: 20, totalPages: 2 }}
      query={{ page: 2, limit: 10 }}
    />,
  );
  expect(screen.queryByRole("link", { name: /next/i })).toBeNull();
  expect(screen.getByText(/page/i).textContent).toContain("2");
});

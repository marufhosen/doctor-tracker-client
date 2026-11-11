import { expect, test } from "bun:test";
import { render, screen } from "@testing-library/react";

import {
  DashboardSectionError,
  DashboardSectionSkeleton,
} from "@/components/dashboard/dashboard-feedback";

test("renders safe section-level loading and retry feedback", () => {
  const { rerender } = render(<DashboardSectionSkeleton label="Loading dashboard trends" />);
  expect(
    screen.getByRole("region", { name: "Loading dashboard trends" }).getAttribute("aria-busy"),
  ).toBe("true");

  rerender(<DashboardSectionError title="Trends unavailable" />);
  expect(screen.getByRole("alert").textContent).not.toContain("Error:");
  expect(screen.getByRole("link", { name: "Try again" }).getAttribute("href")).toBe("/dashboard");
});

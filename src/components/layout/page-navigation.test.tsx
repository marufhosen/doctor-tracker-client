import { expect, test } from "bun:test";
import { render, screen } from "@testing-library/react";

import { PageHeader } from "@/components/layout/page-navigation";

test("renders semantic breadcrumbs and responsive page actions", () => {
  render(
    <PageHeader
      kind="detail"
      title="Doctor profile"
      description="Clinical and assignment details."
      breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Doctor profile" }]}
      actions={<button type="button">Edit doctor</button>}
    />,
  );

  expect(screen.getByRole("heading", { level: 1, name: "Doctor profile" }).isConnected).toBe(true);
  expect(screen.getByRole("navigation", { name: "Breadcrumb" }).isConnected).toBe(true);
  expect(screen.getByRole("link", { name: "Dashboard" }).getAttribute("href")).toBe("/dashboard");
  expect(
    screen.getByText("Doctor profile", { selector: "span" }).getAttribute("aria-current"),
  ).toBe("page");
  expect(screen.getByRole("button", { name: "Edit doctor" }).isConnected).toBe(true);
});

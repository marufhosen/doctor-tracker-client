import { expect, test } from "bun:test";
import { render, screen } from "@testing-library/react";

import { ApplicationShell } from "@/components/layout/application-shell";

test("provides semantic navigation, header, content, and skip-link landmarks", () => {
  render(
    <ApplicationShell
      navigation={<nav aria-label="Primary">Navigation</nav>}
      topbar={<h1>Dashboard</h1>}
    >
      <p>Dashboard content</p>
    </ApplicationShell>,
  );

  const main = screen.getByRole("main");
  expect(screen.getByRole("complementary", { name: "Application navigation" }).isConnected).toBe(
    true,
  );
  expect(screen.getByRole("navigation", { name: "Primary" }).isConnected).toBe(true);
  expect(screen.getByRole("banner").isConnected).toBe(true);
  expect(screen.getByRole("link", { name: "Skip to main content" }).getAttribute("href")).toBe(
    "#main-content",
  );
  expect(main.id).toBe("main-content");
  expect(main.textContent).toContain("Dashboard content");
});

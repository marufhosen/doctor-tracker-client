import { expect, test } from "bun:test";

import { getInitials } from "@/components/layout/profile-menu.core";

test("creates safe compact initials from a display name", () => {
  expect(getInitials("Maruf Ahmed")).toBe("MA");
  expect(getInitials("  Administrator  ")).toBe("A");
  expect(getInitials("   ")).toBe("A");
});

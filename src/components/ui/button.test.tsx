import { expect, mock, test } from "bun:test";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Button } from "@/components/ui/button";

test("renders an accessible button that supports keyboard activation", async () => {
  const user = userEvent.setup();
  const handleClick = mock(() => undefined);

  render(<Button onClick={handleClick}>Create doctor</Button>);

  const button = screen.getByRole("button", { name: "Create doctor" });

  expect(button.tagName).toBe("BUTTON");
  button.focus();
  await user.keyboard("{Enter}");
  expect(handleClick).toHaveBeenCalledTimes(1);
});

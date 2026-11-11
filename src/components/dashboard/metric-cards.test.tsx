import { expect, test } from "bun:test";
import { render, screen } from "@testing-library/react";

import { MetricCards } from "@/components/dashboard/metric-cards";

test("renders real zero totals as data", () => {
  render(<MetricCards summary={{ totalDoctors: 0, totalPatients: 0 }} />);

  expect(screen.getByText("Total doctors").isConnected).toBe(true);
  expect(screen.getByText("Total patients").isConnected).toBe(true);
  expect(screen.getAllByRole("definition").map((node) => node.textContent)).toEqual(["0", "0"]);
});

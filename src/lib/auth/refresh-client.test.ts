import { expect, mock, test } from "bun:test";

import { requestCoordinatedRefresh } from "@/lib/auth/refresh-client";

test("coalesces simultaneous refresh attempts into one rotation", async () => {
  let release: (() => void) | undefined;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  const action = mock(async () => {
    await gate;
    return { success: true };
  });

  const first = requestCoordinatedRefresh(action);
  const second = requestCoordinatedRefresh(action);
  expect(first).toBe(second);
  release?.();
  expect(await Promise.all([first, second])).toEqual([{ success: true }, { success: true }]);
  expect(action).toHaveBeenCalledTimes(1);
});

test("allows a new refresh after the active attempt settles", async () => {
  const action = mock(async () => ({ success: true }));
  await requestCoordinatedRefresh(action);
  await requestCoordinatedRefresh(action);
  expect(action).toHaveBeenCalledTimes(2);
});

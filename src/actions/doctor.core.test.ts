import { expect, test } from "bun:test";

import { performCreateDoctor } from "@/actions/doctor.core";
import { ApiClientError } from "@/lib/api/errors";

const input = {
  name: "Dr. Samira Khan",
  specialization: "Cardiology",
  hospital: "City Hospital",
  phone: "+880 1712-345678",
  email: "samira@example.com",
};
const admin = {
  status: "authenticated" as const,
  user: {
    id: "507f1f77bcf86cd799439011",
    name: "Admin",
    email: "admin@example.com",
    role: "ADMIN" as const,
  },
};

test("validates input and ADMIN authorization before creating", async () => {
  let calls = 0;
  const create = async () => {
    calls += 1;
    throw new Error("not reached");
  };
  expect((await performCreateDoctor({ ...input, email: "bad" }, admin, create)).success).toBe(
    false,
  );
  expect((await performCreateDoctor(input, { status: "unauthenticated" }, create)).success).toBe(
    false,
  );
  expect(calls).toBe(0);
});

test("returns the identifier and safe backend field failures", async () => {
  const doctor = {
    ...input,
    id: "507f1f77bcf86cd799439012",
    createdAt: "2026-11-01T00:00:00.000Z",
    updatedAt: "2026-11-01T00:00:00.000Z",
  };
  await expect(performCreateDoctor(input, admin, async () => doctor)).resolves.toEqual({
    success: true,
    doctorId: doctor.id,
  });
  const failure = new ApiClientError("validation", "Please review the highlighted fields.", {
    fieldErrors: { email: ["Email already exists"] },
  });
  await expect(
    performCreateDoctor(input, admin, async () => Promise.reject(failure)),
  ).resolves.toEqual({
    success: false,
    message: "Please review the highlighted fields.",
    fieldErrors: { email: "Email already exists" },
  });
});

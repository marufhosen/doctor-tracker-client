"use client";

import { useFormik } from "formik";
import { ArrowRight, Eye, EyeOff, LoaderCircle } from "lucide-react";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { loginAction } from "@/actions/auth.actions";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type LoginInput, loginInputSchema } from "@/lib/api/schemas/auth";

export function LoginForm({ returnTo }: { returnTo: string }) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string>();
  const formik = useFormik<LoginInput>({
    initialValues: { email: "", password: "", rememberMe: false },
    validate: (values) => {
      const result = loginInputSchema.safeParse(values);
      return result.success
        ? {}
        : Object.fromEntries(
            result.error.issues.map((issue) => [String(issue.path[0] ?? "form"), issue.message]),
          );
    },
    onSubmit: async (values, helpers) => {
      setFormError(undefined);
      const result = await loginAction(values);
      if (!result.success) {
        setFormError(result.error.message);
        for (const [field, messages] of Object.entries(result.error.fieldErrors ?? {})) {
          if (["email", "password", "rememberMe"].includes(field) && messages[0])
            helpers.setFieldError(field, messages[0]);
        }
        return;
      }
      router.replace(returnTo as Route);
      router.refresh();
    },
  });

  return (
    <form className="space-y-4" onSubmit={formik.handleSubmit} noValidate>
      {formError ? (
        <div
          role="alert"
          aria-live="assertive"
          className="rounded-lg border border-destructive/25 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {formError}
        </div>
      ) : null}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          placeholder="admin@example.com"
          className="h-11 rounded-lg"
          value={formik.values.email}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          aria-invalid={Boolean(formik.touched.email && formik.errors.email)}
          aria-describedby={formik.touched.email && formik.errors.email ? "email-error" : undefined}
        />
        {formik.touched.email && formik.errors.email ? (
          <p id="email-error" className="text-sm text-destructive">
            {formik.errors.email}
          </p>
        ) : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="••••••••"
            className="h-11 rounded-lg pr-11"
            value={formik.values.password}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            aria-invalid={Boolean(formik.touched.password && formik.errors.password)}
            aria-describedby={
              formik.touched.password && formik.errors.password ? "password-error" : undefined
            }
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 grid w-11 place-items-center rounded-r-lg text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            onClick={() => setShowPassword((value) => !value)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff aria-hidden="true" className="size-4" />
            ) : (
              <Eye aria-hidden="true" className="size-4" />
            )}
          </button>
        </div>
        {formik.touched.password && formik.errors.password ? (
          <p id="password-error" className="text-sm text-destructive">
            {formik.errors.password}
          </p>
        ) : null}
      </div>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Checkbox
            id="rememberMe"
            name="rememberMe"
            checked={formik.values.rememberMe}
            onCheckedChange={(checked) => formik.setFieldValue("rememberMe", checked === true)}
            onBlur={formik.handleBlur}
          />
          <Label htmlFor="rememberMe" className="text-sm font-normal text-muted-foreground">
            Keep me signed in
          </Label>
        </div>
        <span className="text-xs text-muted-foreground">Administrators only</span>
      </div>
      <Button type="submit" className="h-11 w-full rounded-lg" disabled={formik.isSubmitting}>
        {formik.isSubmitting ? <LoaderCircle aria-hidden="true" className="animate-spin" /> : null}
        {formik.isSubmitting ? "Signing in…" : "Sign In"}
        {!formik.isSubmitting && <ArrowRight aria-hidden="true" />}
      </Button>
    </form>
  );
}

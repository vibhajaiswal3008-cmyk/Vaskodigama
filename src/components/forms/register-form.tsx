"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterValues } from "@/lib/validation";
import { Input, Select, Label, FieldError } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { countries } from "@/lib/data";
import { useToast } from "@/components/shared/toast";

const useCases = [
  "Find buyers",
  "Find suppliers",
  "Market research",
  "Procurement",
  "Competitor tracking",
];

/** Demonstration registration. No account is created — routes into the app. */
export function RegisterForm() {
  const router = useRouter();
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({ resolver: zodResolver(registerSchema) });

  async function onSubmit() {
    await new Promise((r) => setTimeout(r, 300));
    toast({ title: "Account created (demo)", description: "No real account is created.", tone: "success" });
    router.push("/dashboard");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <Field id="fullName" label="Full name" error={errors.fullName?.message}>
        <Input id="fullName" aria-invalid={!!errors.fullName} {...register("fullName")} />
      </Field>
      <Field id="workEmail" label="Work email" error={errors.workEmail?.message}>
        <Input id="workEmail" type="email" aria-invalid={!!errors.workEmail} {...register("workEmail")} />
      </Field>
      <Field id="company" label="Company" error={errors.company?.message}>
        <Input id="company" aria-invalid={!!errors.company} {...register("company")} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="password" label="Password" error={errors.password?.message}>
          <Input id="password" type="password" aria-invalid={!!errors.password} {...register("password")} />
        </Field>
        <Field id="confirmPassword" label="Confirm password" error={errors.confirmPassword?.message}>
          <Input id="confirmPassword" type="password" aria-invalid={!!errors.confirmPassword} {...register("confirmPassword")} />
        </Field>
      </div>
      <Field id="useCase" label="Primary use case" error={errors.useCase?.message}>
        <Select id="useCase" defaultValue="" aria-invalid={!!errors.useCase} {...register("useCase")}>
          <option value="" disabled>
            Select…
          </option>
          {useCases.map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </Select>
      </Field>
      <Field id="country" label="Country" error={errors.country?.message}>
        <Select id="country" defaultValue="" aria-invalid={!!errors.country} {...register("country")}>
          <option value="" disabled>
            Select…
          </option>
          {countries.map((c) => (
            <option key={c.code} value={c.code}>
              {c.name}
            </option>
          ))}
        </Select>
      </Field>
      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Creating…" : "Create demo account"}
      </Button>
    </form>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label htmlFor={id} required className="mb-1 block">
        {label}
      </Label>
      {children}
      <FieldError id={`${id}-error`} message={error} />
    </div>
  );
}

"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2 } from "lucide-react";
import { demoRequestSchema, type DemoRequestValues } from "@/lib/validation";
import { Input, Textarea, Select, Label, FieldError } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/misc";
import { Button } from "@/components/ui/button";
import { countries } from "@/lib/data";
import { useToast } from "@/components/shared/toast";

const objectives = [
  "Find buyers for my product",
  "Discover reliable suppliers",
  "Enter a new market",
  "Analyse a competitor",
  "Compare trade prices",
  "Track market changes",
];

export function DemoRequestForm() {
  const { toast } = useToast();
  const [submitted, setSubmitted] = React.useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<DemoRequestValues>({
    resolver: zodResolver(demoRequestSchema),
  });

  async function onSubmit() {
    // Demo only — no email is sent. Show a success state.
    await new Promise((r) => setTimeout(r, 400));
    setSubmitted(true);
    toast({ title: "Request received (demo)", description: "No email is actually sent in this build.", tone: "success" });
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-success/30 bg-success-soft p-6 text-center">
        <CheckCircle2 className="mx-auto size-8 text-success" aria-hidden />
        <h2 className="mt-3 text-lg font-semibold text-navy">Thanks — we’ve got it</h2>
        <p className="mt-1 text-sm text-muted-strong">
          This is a demonstration form, so no message was actually sent. In a
          live build this would reach our team.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-4 sm:grid-cols-2">
      <Field label="Full name" id="fullName" required error={errors.fullName?.message}>
        <Input id="fullName" aria-invalid={!!errors.fullName} {...register("fullName")} />
      </Field>
      <Field label="Work email" id="workEmail" required error={errors.workEmail?.message}>
        <Input id="workEmail" type="email" aria-invalid={!!errors.workEmail} {...register("workEmail")} />
      </Field>
      <Field label="Company" id="company" required error={errors.company?.message}>
        <Input id="company" aria-invalid={!!errors.company} {...register("company")} />
      </Field>
      <Field label="Role" id="role" required error={errors.role?.message}>
        <Input id="role" aria-invalid={!!errors.role} {...register("role")} />
      </Field>
      <Field label="Country" id="country" required error={errors.country?.message}>
        <Select id="country" aria-invalid={!!errors.country} defaultValue="" {...register("country")}>
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
      <Field label="Main objective" id="objective" required error={errors.objective?.message}>
        <Select id="objective" aria-invalid={!!errors.objective} defaultValue="" {...register("objective")}>
          <option value="" disabled>
            Select…
          </option>
          {objectives.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Product (optional)" id="product">
        <Input id="product" {...register("product")} />
      </Field>
      <Field label="HS code (optional)" id="hsCode">
        <Input id="hsCode" placeholder="e.g. 0409" {...register("hsCode")} />
      </Field>
      <div className="sm:col-span-2">
        <Field label="Message (optional)" id="message">
          <Textarea id="message" {...register("message")} />
        </Field>
      </div>
      <div className="sm:col-span-2">
        <Checkbox
          id="consent"
          aria-invalid={!!errors.consent}
          {...register("consent")}
          label="I agree to be contacted about my request."
        />
        <FieldError id="consent-error" message={errors.consent?.message} />
      </div>
      <div className="sm:col-span-2">
        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isSubmitting ? "Sending…" : "Request a demo"}
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  id,
  required,
  error,
  children,
}: {
  label: string;
  id: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label htmlFor={id} required={required} className="mb-1 block">
        {label}
      </Label>
      {children}
      <FieldError id={`${id}-error`} message={error} />
    </div>
  );
}

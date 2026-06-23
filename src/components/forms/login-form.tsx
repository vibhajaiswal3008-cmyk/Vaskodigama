"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginValues } from "@/lib/validation";
import { Input, Label, FieldError } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/misc";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/shared/toast";

/** Demonstration login. No real authentication — routes into the demo app. */
export function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  async function onSubmit() {
    await new Promise((r) => setTimeout(r, 300));
    toast({ title: "Signed in (demo)", description: "No real account is used.", tone: "success" });
    router.push("/dashboard");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div>
        <Label htmlFor="email" required className="mb-1 block">
          Email
        </Label>
        <Input id="email" type="email" aria-invalid={!!errors.email} {...register("email")} />
        <FieldError id="email-error" message={errors.email?.message} />
      </div>
      <div>
        <Label htmlFor="password" required className="mb-1 block">
          Password
        </Label>
        <Input id="password" type="password" aria-invalid={!!errors.password} {...register("password")} />
        <FieldError id="password-error" message={errors.password?.message} />
      </div>
      <Checkbox id="remember" {...register("remember")} label="Remember me" />
      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}

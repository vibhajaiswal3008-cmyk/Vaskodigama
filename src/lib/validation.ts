import { z } from "zod";

/**
 * Shared Zod schemas. NOTE: submitting any of these forms does NOT send an
 * email or create an account in this build — the handlers show a success state
 * only. Wire to a backend before claiming otherwise.
 */

export const demoRequestSchema = z.object({
  fullName: z.string().min(2, "Please enter your full name."),
  workEmail: z.string().email("Enter a valid work email."),
  company: z.string().min(2, "Please enter your company."),
  role: z.string().min(2, "Please enter your role."),
  country: z.string().min(1, "Please select a country."),
  objective: z.string().min(1, "Please choose a main objective."),
  product: z.string().optional(),
  hsCode: z.string().optional(),
  message: z.string().max(1000, "Message is too long.").optional(),
  consent: z.literal(true, {
    error: "Please confirm you agree to be contacted.",
  }),
});
export type DemoRequestValues = z.infer<typeof demoRequestSchema>;

export const registerSchema = z
  .object({
    fullName: z.string().min(2, "Please enter your full name."),
    workEmail: z.string().email("Enter a valid work email."),
    company: z.string().min(2, "Please enter your company."),
    password: z.string().min(8, "Use at least 8 characters."),
    confirmPassword: z.string(),
    useCase: z.string().min(1, "Please choose a primary use case."),
    country: z.string().min(1, "Please select a country."),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords don’t match.",
    path: ["confirmPassword"],
  });
export type RegisterValues = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email."),
  password: z.string().min(1, "Enter your password."),
  remember: z.boolean().optional(),
});
export type LoginValues = z.infer<typeof loginSchema>;

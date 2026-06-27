import { z } from "zod";

/**
 * Unified login schema for both platform admins and institution admins.
 * The system automatically determines the role based on the email.
 */
export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

import { z } from "zod";

/**
 * Schema for the Platform Admin (super-admin) login form.
 */
export const superAdminLoginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

/**
 * Schema for the Institution Admin (tenant-admin) login form.
 */
export const institutionAdminLoginSchema = z.object({
  institutionSubdomain: z
    .string()
    .trim()
    .min(1, "Institution subdomain is required")
    .refine(
      (value) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value),
      "Use lowercase letters, numbers, and hyphens only (e.g. eldoret-polytechnic)",
    ),
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type SuperAdminLoginFormValues = z.infer<typeof superAdminLoginSchema>;
export type InstitutionAdminLoginFormValues = z.infer<
  typeof institutionAdminLoginSchema
>;

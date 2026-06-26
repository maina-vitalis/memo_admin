import { z } from "zod";

const subdomainSlugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const shortcodeRegex = /^[A-Z0-9]{2,10}$/;

export const provisionTenantSchema = z.object({
  institutionName: z
    .string()
    .trim()
    .min(2, "Institution name must be at least 2 characters"),
  shortcode: z
    .string()
    .trim()
    .transform((value) => value.toUpperCase())
    .pipe(
      z
        .string()
        .regex(shortcodeRegex, "Use 2–10 uppercase letters or numbers"),
    ),
  subdomainSlug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(
      subdomainSlugRegex,
      "Use lowercase letters, numbers, and hyphens only",
    ),
  seatQuota: z
    .number({ invalid_type_error: "Seat quota is required" })
    .int("Seat quota must be a whole number")
    .min(1, "At least 1 seat is required")
    .max(100_000, "Seat quota cannot exceed 100,000"),
  initialStatus: z.enum(["trial", "active", "pending"]),
  subscriptionDays: z
    .number({ invalid_type_error: "Subscription days are required" })
    .int("Subscription days must be a whole number")
    .min(1, "Subscription must be at least 1 day")
    .max(1_095, "Subscription cannot exceed 3 years"),
  adminEmail: z.string().trim().email("Enter a valid admin email"),
  adminFullName: z
    .string()
    .trim()
    .min(2, "Admin name must be at least 2 characters"),
  provisioningNotes: z.string().trim().optional(),
});

export type ProvisionTenantFormValues = z.infer<typeof provisionTenantSchema>;

export const defaultProvisionTenantValues: ProvisionTenantFormValues = {
  institutionName: "",
  shortcode: "",
  subdomainSlug: "",
  seatQuota: 100,
  initialStatus: "trial",
  subscriptionDays: 30,
  adminEmail: "",
  adminFullName: "",
  provisioningNotes: "",
};

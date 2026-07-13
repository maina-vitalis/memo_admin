import { z } from "zod";

export const institutionProfileSchema = z.object({
  name: z.string().trim().min(1, "Institution name is required").max(255),
  contactEmail: z.string().trim().email("Enter a valid email address"),
  logoUrl: z
    .string()
    .trim()
    .url("Enter a valid URL")
    .optional()
    .or(z.literal("")),
  timezone: z.string().trim().min(1, "Timezone is required").max(64),
});

export type InstitutionProfileFormValues = z.infer<typeof institutionProfileSchema>;

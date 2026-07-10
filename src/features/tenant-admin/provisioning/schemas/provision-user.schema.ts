import { z } from "zod";

export const provisionUserSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, "First name must be at least 2 characters")
    .max(100, "First name is too long"),
  lastName: z
    .string()
    .trim()
    .min(2, "Last name must be at least 2 characters")
    .max(100, "Last name is too long"),
  email: z.string().trim().email("Enter a valid email address"),
  admissionNumber: z
    .string()
    .trim()
    .min(1, "Admission number is required")
    .max(50, "Admission number is too long"),
  departmentId: z.string().uuid().optional(),
  phoneNumber: z.string().trim().max(20, "Phone number is too long").optional(),
});

export type ProvisionUserFormValues = z.infer<typeof provisionUserSchema>;

export const defaultProvisionUserValues: ProvisionUserFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  admissionNumber: "",
  departmentId: undefined,
  phoneNumber: "",
};

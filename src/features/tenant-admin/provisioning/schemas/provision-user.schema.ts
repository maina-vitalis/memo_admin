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
  role: z.string().min(1, "Select a role"),
  departmentId: z.string().uuid().optional(),
  staffNumber: z.string().trim().max(50, "Staff number is too long").optional(),
  admissionNumber: z.string().trim().max(50, "Admission number is too long").optional(),
  phoneNumber: z.string().trim().max(20, "Phone number is too long").optional(),
});

export type ProvisionUserFormValues = z.infer<typeof provisionUserSchema>;

export const defaultProvisionUserValues: ProvisionUserFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  role: "",
  departmentId: undefined,
  staffNumber: "",
  admissionNumber: "",
  phoneNumber: "",
};

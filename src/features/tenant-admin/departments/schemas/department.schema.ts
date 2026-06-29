import { z } from "zod";

export const createDepartmentSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Department name must be at least 2 characters")
    .max(150, "Department name must be at most 150 characters"),
  code: z
    .string()
    .trim()
    .max(20, "Code must be at most 20 characters")
    .optional(),
  headUserId: z.string().uuid().optional(),
});

export type CreateDepartmentFormValues = z.infer<typeof createDepartmentSchema>;

export const updateDepartmentSchema = createDepartmentSchema.partial().extend({
  name: z
    .string()
    .trim()
    .min(2, "Department name must be at least 2 characters")
    .max(150, "Department name must be at most 150 characters")
    .optional(),
});

export type UpdateDepartmentFormValues = z.infer<typeof updateDepartmentSchema>;

export const defaultCreateDepartmentValues: CreateDepartmentFormValues = {
  name: "",
  code: "",
};

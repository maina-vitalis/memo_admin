import { z } from "zod";

export const directoryToolbarSchema = z.object({
  search: z.string(),
  role: z.string(),
  status: z.enum(["all", "active", "inactive"]),
});

export type DirectoryToolbarValues = z.infer<typeof directoryToolbarSchema>;

export const directoryFiltersSchema = directoryToolbarSchema.extend({
  page: z.number().int().min(1),
  pageSize: z.number().int().min(1).max(100),
});

export type DirectoryFilters = z.infer<typeof directoryFiltersSchema>;

export const defaultDirectoryFilters: DirectoryFilters = {
  search: "",
  role: "all",
  status: "all",
  page: 1,
  pageSize: 10,
};

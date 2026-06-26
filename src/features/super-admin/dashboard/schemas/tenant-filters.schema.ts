import { z } from "zod";

export const tenantToolbarSchema = z.object({
  search: z.string(),
  status: z.enum(["all", "active", "pending", "suspended", "trial"]),
});

export type TenantToolbarValues = z.infer<typeof tenantToolbarSchema>;

export const tenantFiltersSchema = tenantToolbarSchema.extend({
  page: z.number().int().min(1),
  pageSize: z.number().int().min(1).max(100),
});

export type TenantFilters = z.infer<typeof tenantFiltersSchema>;

export const defaultTenantFilters: TenantFilters = {
  search: "",
  status: "all",
  page: 1,
  pageSize: 10,
};

"use client";

import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { ProvisionTenantFormValues } from "@/features/super-admin/provisioning/schemas/provision-tenant.schema";
import { FormField } from "@/features/super-admin/provisioning/components/form-field";
import { Input } from "@/components/ui/input";

type ProvisionInstitutionFieldsProps = {
  register: UseFormRegister<ProvisionTenantFormValues>;
  errors: FieldErrors<ProvisionTenantFormValues>;
};

export function ProvisionInstitutionFields({
  register,
  errors,
}: ProvisionInstitutionFieldsProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <FormField
        label="Institution name"
        description="Official name as it will appear in the directory."
        error={errors.institutionName}
        htmlFor="institutionName"
      >
        <Input
          id="institutionName"
          placeholder="e.g. Kabete National Polytechnic"
          aria-invalid={!!errors.institutionName}
          {...register("institutionName")}
        />
      </FormField>

      <FormField
        label="Shortcode"
        description="Unique identifier used internally (2–10 characters)."
        error={errors.shortcode}
        htmlFor="shortcode"
      >
        <Input
          id="shortcode"
          placeholder="e.g. KNP"
          className="uppercase"
          aria-invalid={!!errors.shortcode}
          {...register("shortcode")}
        />
      </FormField>

      <FormField
        label="Institution domain"
        description="Full domain with extension (.ac.ke, .com, .edu, etc.). Admins use this when signing in."
        error={errors.subdomainSlug}
        htmlFor="subdomainSlug"
      >
        <Input
          id="subdomainSlug"
          placeholder="e.g. eldoretpolytechnic.ac.ke"
          aria-invalid={!!errors.subdomainSlug}
          {...register("subdomainSlug")}
        />
      </FormField>

      <FormField
        label="Seat quota"
        description="Maximum number of student seats for this institution."
        error={errors.seatQuota}
        htmlFor="seatQuota"
      >
        <Input
          id="seatQuota"
          type="number"
          min={1}
          aria-invalid={!!errors.seatQuota}
          {...register("seatQuota", { valueAsNumber: true })}
        />
      </FormField>
    </div>
  );
}

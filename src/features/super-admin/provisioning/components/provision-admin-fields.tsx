"use client";

import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { ProvisionTenantFormValues } from "@/features/super-admin/provisioning/schemas/provision-tenant.schema";
import { FormField } from "@/features/super-admin/provisioning/components/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type ProvisionAdminFieldsProps = {
  register: UseFormRegister<ProvisionTenantFormValues>;
  errors: FieldErrors<ProvisionTenantFormValues>;
};

export function ProvisionAdminFields({
  register,
  errors,
}: ProvisionAdminFieldsProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <FormField
        label="Admin full name"
        description="Primary administrator for this institution."
        error={errors.adminFullName}
        htmlFor="adminFullName"
      >
        <Input
          id="adminFullName"
          placeholder="e.g. Jane Doe"
          aria-invalid={!!errors.adminFullName}
          {...register("adminFullName")}
        />
      </FormField>

      <FormField
        label="Admin email"
        description="Invitation and setup instructions will be sent here."
        error={errors.adminEmail}
        htmlFor="adminEmail"
      >
        <Input
          id="adminEmail"
          type="email"
          placeholder="admin@institution.ac.ke"
          aria-invalid={!!errors.adminEmail}
          {...register("adminEmail")}
        />
      </FormField>

      <div className="sm:col-span-2">
        <FormField
          label="Provisioning notes"
          description="Optional internal notes for this manual provisioning."
          error={errors.provisioningNotes}
          htmlFor="provisioningNotes"
        >
          <Textarea
            id="provisioningNotes"
            rows={4}
            placeholder="Add context for this provisioning request..."
            aria-invalid={!!errors.provisioningNotes}
            {...register("provisioningNotes")}
          />
        </FormField>
      </div>
    </div>
  );
}

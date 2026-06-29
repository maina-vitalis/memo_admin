"use client";

import type { Control, FieldErrors, UseFormRegister } from "react-hook-form";
import { Controller } from "react-hook-form";
import type { ProvisionTenantFormValues } from "@/features/super-admin/provisioning/schemas/provision-tenant.schema";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ProvisionSubscriptionFieldsProps = {
  control: Control<ProvisionTenantFormValues>;
  register: UseFormRegister<ProvisionTenantFormValues>;
  errors: FieldErrors<ProvisionTenantFormValues>;
};

export function ProvisionSubscriptionFields({
  control,
  register,
  errors,
}: ProvisionSubscriptionFieldsProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <FormField
        label="Initial status"
        description="Starting lifecycle state for the new tenant."
        error={errors.initialStatus}
      >
        <Controller
          control={control}
          name="initialStatus"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-full" aria-invalid={!!errors.initialStatus}>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="trial">Trial</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </FormField>

      <FormField
        label="Subscription days"
        description="Number of days added to the initial subscription."
        error={errors.subscriptionDays}
        htmlFor="subscriptionDays"
      >
        <Input
          id="subscriptionDays"
          type="number"
          min={1}
          aria-invalid={!!errors.subscriptionDays}
          {...register("subscriptionDays", { valueAsNumber: true })}
        />
      </FormField>
    </div>
  );
}

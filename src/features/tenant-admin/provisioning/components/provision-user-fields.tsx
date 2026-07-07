"use client";

import type { Control, FieldErrors, UseFormRegister } from "react-hook-form";
import { Controller } from "react-hook-form";
import type { ProvisionUserFormValues } from "@/features/tenant-admin/provisioning/schemas/provision-user.schema";
import type { AssignableRole } from "@/features/tenant-admin/provisioning/api/get-roles";
import type { Department } from "@/features/tenant-admin/provisioning/api/get-departments";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ProvisionUserFieldsProps = {
  control: Control<ProvisionUserFormValues>;
  register: UseFormRegister<ProvisionUserFormValues>;
  errors: FieldErrors<ProvisionUserFormValues>;
  roles: AssignableRole[];
  departments: Department[];
};

function formatRoleLabel(role: string): string {
  return role
    .split("_")
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(" ");
}

export function ProvisionUserFields({
  control,
  register,
  errors,
  roles,
  departments,
}: ProvisionUserFieldsProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <FormField
        label="First name"
        error={errors.firstName}
        htmlFor="firstName"
      >
        <Input
          id="firstName"
          placeholder="e.g. John"
          aria-invalid={!!errors.firstName}
          {...register("firstName")}
        />
      </FormField>

      <FormField
        label="Last name"
        error={errors.lastName}
        htmlFor="lastName"
      >
        <Input
          id="lastName"
          placeholder="e.g. Doe"
          aria-invalid={!!errors.lastName}
          {...register("lastName")}
        />
      </FormField>

      <div className="sm:col-span-2">
        <FormField
          label="Email address"
          description="The school code and a temporary password will be sent to this address."
          error={errors.email}
          htmlFor="email"
        >
          <Input
            id="email"
            type="email"
            placeholder="user@institution.ac.ke"
            aria-invalid={!!errors.email}
            {...register("email")}
          />
        </FormField>
      </div>

      <FormField
        label="Role"
        description="Determines permissions and access level."
        error={errors.role}
      >
        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value || ""}>
              <SelectTrigger
                id="role"
                aria-invalid={!!errors.role}
                className="w-full"
              >
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {roles.length === 0 ? (
                  <div className="px-2 py-6 text-center text-sm text-muted-foreground">
                    No assignable roles for your account.
                  </div>
                ) : (
                  roles.map((item) => (
                    <SelectItem key={item.role} value={item.role}>
                      {formatRoleLabel(item.role)}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          )}
        />
      </FormField>

      <FormField
        label="Department"
        description="Optional. Used for organization and reporting."
        error={errors.departmentId}
      >
        <Controller
          name="departmentId"
          control={control}
          render={({ field }) => (
            <Select
              onValueChange={field.onChange}
              value={field.value || ""}
            >
              <SelectTrigger id="departmentId" className="w-full">
                <SelectValue placeholder="Select a department" />
              </SelectTrigger>
              <SelectContent>
                {departments.length === 0 ? (
                  <div className="px-2 py-6 text-center text-sm text-muted-foreground">
                    No departments available
                  </div>
                ) : (
                  departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.code ? `${dept.name} (${dept.code})` : dept.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          )}
        />
      </FormField>

      <FormField
        label="Staff number"
        description="Optional. For staff users — used as their login identifier."
        error={errors.staffNumber}
        htmlFor="staffNumber"
      >
        <Input
          id="staffNumber"
          placeholder="e.g. STF-001"
          {...register("staffNumber")}
        />
      </FormField>

      <FormField
        label="Admission number"
        description="Optional. For student users — used as their login identifier."
        error={errors.admissionNumber}
        htmlFor="admissionNumber"
      >
        <Input
          id="admissionNumber"
          placeholder="e.g. ADM-2024-001"
          {...register("admissionNumber")}
        />
      </FormField>

      <FormField
        label="Phone number"
        description="Optional contact number."
        error={errors.phoneNumber}
        htmlFor="phoneNumber"
      >
        <Input
          id="phoneNumber"
          type="tel"
          placeholder="e.g. +254712345678"
          {...register("phoneNumber")}
        />
      </FormField>
    </div>
  );
}
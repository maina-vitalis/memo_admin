"use client";

import type { Control, FieldErrors, UseFormRegister } from "react-hook-form";
import { Controller } from "react-hook-form";
import type { ProvisionUserFormValues } from "@/features/tenant-admin/provisioning/schemas/provision-user.schema";
import type { Role } from "@/features/tenant-admin/provisioning/api/get-roles";
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
  roles: Role[];
  departments: Department[];
};

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
          description="Login credentials will be sent to this email."
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
        error={errors.roleId}
      >
        <Controller
          name="roleId"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value || ""}>
              <SelectTrigger
                id="roleId"
                aria-invalid={!!errors.roleId}
                className="w-full"
              >
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {roles.length === 0 ? (
                  <div className="px-2 py-6 text-center text-sm text-muted-foreground">
                    No roles available. Create roles first.
                  </div>
                ) : (
                  roles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
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
        description="Optional internal identifier."
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

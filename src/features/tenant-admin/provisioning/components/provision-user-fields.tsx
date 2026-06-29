"use client";

import type { Control, FieldErrors, UseFormRegister } from "react-hook-form";
import { Controller } from "react-hook-form";
import type { ProvisionUserFormValues } from "@/features/tenant-admin/provisioning/schemas/provision-user.schema";
import type { Role } from "@/features/tenant-admin/provisioning/api/get-roles";
import type { Department } from "@/features/tenant-admin/provisioning/api/get-departments";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
      <div className="space-y-2">
        <Label htmlFor="firstName">
          First name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="firstName"
          placeholder="e.g. John"
          aria-invalid={!!errors.firstName}
          {...register("firstName")}
        />
        {errors.firstName && (
          <p className="text-sm text-destructive">{errors.firstName.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="lastName">
          Last name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="lastName"
          placeholder="e.g. Doe"
          aria-invalid={!!errors.lastName}
          {...register("lastName")}
        />
        {errors.lastName && (
          <p className="text-sm text-destructive">{errors.lastName.message}</p>
        )}
      </div>

      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="email">
          Email address <span className="text-destructive">*</span>
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="user@institution.ac.ke"
          aria-invalid={!!errors.email}
          {...register("email")}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
        <p className="text-sm text-muted-foreground">
          Login credentials will be sent to this email.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="roleId">
          Role <span className="text-destructive">*</span>
        </Label>
        <Controller
          name="roleId"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
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
        {errors.roleId && (
          <p className="text-sm text-destructive">{errors.roleId.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="departmentId">Department (optional)</Label>
        <Controller
          name="departmentId"
          control={control}
          render={({ field }) => (
            <Select
              onValueChange={field.onChange}
              value={field.value || undefined}
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
                      {dept.name} ({dept.code})
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="staffNumber">Staff number (optional)</Label>
        <Input
          id="staffNumber"
          placeholder="e.g. STF-001"
          {...register("staffNumber")}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phoneNumber">Phone number (optional)</Label>
        <Input
          id="phoneNumber"
          type="tel"
          placeholder="e.g. +254712345678"
          {...register("phoneNumber")}
        />
      </div>
    </div>
  );
}

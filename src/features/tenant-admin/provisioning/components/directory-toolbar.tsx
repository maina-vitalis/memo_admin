"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SearchIcon } from "lucide-react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  directoryToolbarSchema,
  type DirectoryFilters,
  type DirectoryToolbarValues,
} from "@/features/tenant-admin/provisioning/schemas/directory-filters.schema";
import {
  ASSIGNABLE_ROLES,
  formatRoleLabel,
} from "@/features/tenant-admin/provisioning/utils/role-label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type DirectoryToolbarProps = {
  filters: DirectoryFilters;
  onFiltersChange: (filters: DirectoryFilters) => void;
};

export function DirectoryToolbar({
  filters,
  onFiltersChange,
}: DirectoryToolbarProps) {
  const { control, register, watch, setValue } = useForm<DirectoryToolbarValues>({
    resolver: zodResolver(directoryToolbarSchema),
    defaultValues: {
      search: filters.search,
      role: filters.role,
      status: filters.status,
    },
  });

  const searchValue = watch("search");

  useEffect(() => {
    setValue("search", filters.search);
    setValue("role", filters.role);
    setValue("status", filters.status);
  }, [filters.search, filters.role, filters.status, setValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchValue !== filters.search) {
        onFiltersChange({
          ...filters,
          search: searchValue,
          page: 1,
        });
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchValue, filters, onFiltersChange]);

  function handleRoleChange(role: string) {
    setValue("role", role);
    onFiltersChange({ ...filters, role, page: 1 });
  }

  function handleStatusChange(status: DirectoryFilters["status"]) {
    setValue("status", status);
    onFiltersChange({ ...filters, status, page: 1 });
  }

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
      <div className="relative w-full lg:max-w-xs">
        <SearchIcon className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          {...register("search")}
          placeholder="Search by name, email, or admission number..."
          className="pl-9"
        />
      </div>

      <Controller
        control={control}
        name="role"
        render={({ field }) => (
          <Select value={field.value} onValueChange={handleRoleChange}>
            <SelectTrigger className="w-full lg:w-[200px]">
              <SelectValue placeholder="All roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All roles</SelectItem>
              {ASSIGNABLE_ROLES.map((role) => (
                <SelectItem key={role} value={role}>
                  {formatRoleLabel(role)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />

      <Controller
        control={control}
        name="status"
        render={({ field }) => (
          <Select
            value={field.value}
            onValueChange={(value) =>
              handleStatusChange(value as DirectoryFilters["status"])
            }
          >
            <SelectTrigger className="w-full lg:w-[160px]">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        )}
      />
    </div>
  );
}

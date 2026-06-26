"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon, SearchIcon } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  tenantToolbarSchema,
  type TenantFilters,
  type TenantToolbarValues,
} from "@/features/super-admin/dashboard/schemas/tenant-filters.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type TenantDirectoryToolbarProps = {
  filters: TenantFilters;
  onFiltersChange: (filters: TenantFilters) => void;
};

export function TenantDirectoryToolbar({
  filters,
  onFiltersChange,
}: TenantDirectoryToolbarProps) {
  const { control, register, watch, setValue } = useForm<TenantToolbarValues>({
      resolver: zodResolver(tenantToolbarSchema),
      defaultValues: {
        search: filters.search,
        status: filters.status,
      },
    });

  const searchValue = watch("search");

  useEffect(() => {
    setValue("search", filters.search);
    setValue("status", filters.status);
  }, [filters.search, filters.status, setValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const nextSearch = watch("search");
      if (nextSearch !== filters.search) {
        onFiltersChange({
          ...filters,
          search: nextSearch,
          page: 1,
        });
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchValue, filters, onFiltersChange]);

  function handleStatusChange(status: TenantFilters["status"]) {
    setValue("status", status);
    onFiltersChange({ ...filters, status, page: 1 });
  }

  return (
    <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row sm:items-center">
        <div className="relative w-full sm:w-[240px]">
          <SearchIcon className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            {...register("search")}
            placeholder="Search institutions..."
            className="pl-9"
          />
        </div>

        <Controller
          control={control}
          name="status"
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={(value) =>
                handleStatusChange(value as TenantFilters["status"])
              }
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="trial">Trial</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <Button asChild className="shrink-0">
        <Link href="/super-admin/institutions/new">
          <PlusIcon data-icon="inline-start" />
          Provision New TVET
        </Link>
      </Button>
    </div>
  );
}

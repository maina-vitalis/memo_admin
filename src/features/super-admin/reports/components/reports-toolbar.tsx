"use client";

import { DownloadIcon, SearchIcon } from "lucide-react";
import type { TenantStatus } from "@/features/super-admin/dashboard/types/tenant";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type ReportFilters = {
  search: string;
  status: TenantStatus | "all";
  plan: "trial" | "basic" | "pro" | "all";
};

type ReportsToolbarProps = {
  filters: ReportFilters;
  onFiltersChange: (filters: ReportFilters) => void;
  onExport: () => void;
  exportDisabled?: boolean;
};

export function ReportsToolbar({
  filters,
  onFiltersChange,
  onExport,
  exportDisabled,
}: ReportsToolbarProps) {
  return (
    <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row sm:items-center">
        <div className="relative w-full sm:w-[240px]">
          <SearchIcon className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={filters.search}
            onChange={(event) =>
              onFiltersChange({ ...filters, search: event.target.value })
            }
            placeholder="Search institutions..."
            className="pl-9"
          />
        </div>

        <Select
          value={filters.status}
          onValueChange={(value) =>
            onFiltersChange({ ...filters, status: value as ReportFilters["status"] })
          }
        >
          <SelectTrigger className="w-full sm:w-[160px]">
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

        <Select
          value={filters.plan}
          onValueChange={(value) =>
            onFiltersChange({ ...filters, plan: value as ReportFilters["plan"] })
          }
        >
          <SelectTrigger className="w-full sm:w-[140px]">
            <SelectValue placeholder="All Plans" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Plans</SelectItem>
            <SelectItem value="trial">Trial</SelectItem>
            <SelectItem value="basic">Basic</SelectItem>
            <SelectItem value="pro">Pro</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        onClick={onExport}
        disabled={exportDisabled}
        variant="outline"
        className="shrink-0"
      >
        <DownloadIcon data-icon="inline-start" />
        Export to Excel
      </Button>
    </div>
  );
}

"use client";

import { useMemo } from "react";
import {
  getPaginationRowModel,
  type PaginationState,
} from "@tanstack/react-table";
import type { User } from "@/features/tenant-admin/provisioning/api/get-users";
import { getUsersColumns } from "@/features/tenant-admin/provisioning/components/users-columns";
import type { DirectoryFilters } from "@/features/tenant-admin/provisioning/schemas/directory-filters.schema";
import { DataTable } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";

type DirectoryTableProps = {
  users: User[];
  filters: DirectoryFilters;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
};

function filterUsers(users: User[], filters: DirectoryFilters): User[] {
  const query = filters.search.trim().toLowerCase();

  return users.filter((user) => {
    if (query) {
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      const matchesSearch =
        fullName.includes(query) ||
        user.email.toLowerCase().includes(query) ||
        (user.staffNumber?.toLowerCase().includes(query) ?? false) ||
        (user.admissionNumber?.toLowerCase().includes(query) ?? false);

      if (!matchesSearch) return false;
    }

    if (
      filters.role !== "all" &&
      user.role?.toUpperCase() !== filters.role.toUpperCase()
    ) {
      return false;
    }

    if (filters.status === "active" && !user.isActive) return false;
    if (filters.status === "inactive" && user.isActive) return false;

    return true;
  });
}

export function DirectoryTable({
  users,
  filters,
  isLoading,
  onPageChange,
}: DirectoryTableProps) {
  const filteredUsers = useMemo(
    () => filterUsers(users, filters),
    [users, filters],
  );

  const columns = useMemo(() => getUsersColumns(), []);

  const total = filteredUsers.length;
  const totalPages = Math.max(1, Math.ceil(total / filters.pageSize));
  const currentPage = Math.min(filters.page, totalPages);
  const start = total === 0 ? 0 : (currentPage - 1) * filters.pageSize + 1;
  const end = Math.min(currentPage * filters.pageSize, total);

  const pagination: PaginationState = {
    pageIndex: currentPage - 1,
    pageSize: filters.pageSize,
  };

  if (!isLoading && users.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-muted/50 p-12 text-center">
        <p className="text-sm text-muted-foreground">
          No users found. Start by provisioning your first user.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
      <DataTable
        columns={columns}
        data={filteredUsers}
        isLoading={isLoading}
        emptyMessage="No users match your filters."
        containerClassName="rounded-none border-0 shadow-none"
        tableOptions={{
          getPaginationRowModel: getPaginationRowModel(),
          state: { pagination },
          autoResetPageIndex: false,
        }}
      />

      <DataTablePagination
        page={currentPage}
        pageSize={filters.pageSize}
        total={total}
        start={start}
        end={end}
        onPageChange={onPageChange}
      />
    </div>
  );
}

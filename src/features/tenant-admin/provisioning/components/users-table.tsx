"use client";

import type { User } from "@/features/tenant-admin/provisioning/api/get-users";
import { usersColumns } from "@/features/tenant-admin/provisioning/components/users-columns";
import { DataTable } from "@/components/data-table/data-table";

interface UsersTableProps {
  users: User[];
}

export function UsersTable({ users }: UsersTableProps) {
  if (users.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-muted/50 p-12 text-center">
        <p className="text-sm text-muted-foreground">
          No users found. Start by provisioning your first user.
        </p>
      </div>
    );
  }

  return (
    <DataTable
      columns={usersColumns}
      data={users}
      emptyMessage="No users found. Start by provisioning your first user."
    />
  );
}

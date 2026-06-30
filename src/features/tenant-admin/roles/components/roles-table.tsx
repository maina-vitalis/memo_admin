"use client";

import { useMemo } from "react";
import { ShieldIcon } from "lucide-react";
import type { RoleWithDetails } from "@/features/tenant-admin/roles/api/get-roles";
import type { UserInRole } from "@/features/tenant-admin/roles/api/get-users";
import {
  rolesColumns,
  type RoleRow,
} from "@/features/tenant-admin/roles/components/roles-columns";
import { DataTable } from "@/components/data-table/data-table";

interface RolesTableProps {
  roles: RoleWithDetails[];
  users: UserInRole[];
}

export function RolesTable({ roles, users }: RolesTableProps) {
  const tableData = useMemo<RoleRow[]>(() => {
    const userCountsByRole = new Map<string, number>();
    users.forEach((user) => {
      userCountsByRole.set(
        user.roleId,
        (userCountsByRole.get(user.roleId) || 0) + 1,
      );
    });

    return [...roles]
      .sort((a, b) => a.hierarchyLevel - b.hierarchyLevel)
      .map((role) => ({
        ...role,
        userCount: userCountsByRole.get(role.id) || 0,
      }));
  }, [roles, users]);

  if (roles.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-muted/50 p-12 text-center">
        <ShieldIcon className="mx-auto h-8 w-8 text-muted-foreground" />
        <p className="mt-3 text-sm font-medium text-foreground">No roles yet</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Roles define permissions and access levels for users in your
          institution.
        </p>
      </div>
    );
  }

  return <DataTable columns={rolesColumns} data={tableData} />;
}

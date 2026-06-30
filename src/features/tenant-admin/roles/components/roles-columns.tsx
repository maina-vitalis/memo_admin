"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { UsersIcon } from "lucide-react";
import type { RoleWithDetails } from "@/features/tenant-admin/roles/api/get-roles";
import { EditRoleDialog } from "@/features/tenant-admin/roles/components/edit-role-dialog";
import { DeleteRoleDialog } from "@/features/tenant-admin/roles/components/delete-role-dialog";

export type RoleRow = RoleWithDetails & {
  userCount: number;
};

export const rolesColumns: ColumnDef<RoleRow>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <span className="font-medium">{row.original.name}</span>
    ),
  },
  {
    accessorKey: "hierarchyLevel",
    header: "Hierarchy Level",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original.hierarchyLevel}
      </span>
    ),
  },
  {
    accessorKey: "userCount",
    header: "Users",
    cell: ({ row }) => (
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <UsersIcon className="h-4 w-4" />
        <span>{row.original.userCount}</span>
      </div>
    ),
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) =>
      row.original.isActive ? (
        <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
          Active
        </span>
      ) : (
        <span className="inline-flex items-center rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/20">
          Inactive
        </span>
      ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex items-center justify-end gap-1">
        <EditRoleDialog role={row.original} />
        <DeleteRoleDialog
          role={row.original}
          userCount={row.original.userCount}
        />
      </div>
    ),
  },
];

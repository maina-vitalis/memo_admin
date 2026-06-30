"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { UsersIcon } from "lucide-react";
import type { Department } from "@/features/tenant-admin/departments/api/get-departments";
import { EditDepartmentDialog } from "@/features/tenant-admin/departments/components/edit-department-dialog";
import { DeleteDepartmentDialog } from "@/features/tenant-admin/departments/components/delete-department-dialog";

export type DepartmentRow = Department & {
  memberCount: number;
  headName: string;
};

export const departmentsColumns: ColumnDef<DepartmentRow>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <span className="font-medium">{row.original.name}</span>
    ),
  },
  {
    accessorKey: "code",
    header: "Code",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original.code || "—"}
      </span>
    ),
  },
  {
    accessorKey: "headName",
    header: "Head",
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.original.headName}</span>
    ),
  },
  {
    accessorKey: "memberCount",
    header: "Members",
    cell: ({ row }) => (
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <UsersIcon className="h-4 w-4" />
        <span>{row.original.memberCount}</span>
      </div>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex items-center justify-end gap-1">
        <EditDepartmentDialog department={row.original} />
        <DeleteDepartmentDialog
          department={row.original}
          memberCount={row.original.memberCount}
        />
      </div>
    ),
  },
];

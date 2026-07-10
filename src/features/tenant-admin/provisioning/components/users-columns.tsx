"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { formatDistanceToNow } from "date-fns";
import type { User } from "@/features/tenant-admin/provisioning/api/get-users";
import { UserRoleSelect } from "@/features/tenant-admin/provisioning/components/user-role-select";
import { EditUserDialog } from "@/features/tenant-admin/roles/components/edit-user-dialog";
import type { UserInRole } from "@/features/tenant-admin/roles/api/get-users";

function toUserInRole(user: User): UserInRole {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role ?? "",
    departmentId: user.departmentId,
    admissionNumber: user.admissionNumber,
    phoneNumber: user.phoneNumber,
    isActive: user.isActive,
    mustChangePassword: user.mustChangePassword,
    lastLoginAt: user.lastLoginAt,
    createdAt: user.createdAt,
  };
}

export function getUsersColumns(): ColumnDef<User>[] {
  return [
    {
      id: "name",
      header: "Name",
      cell: ({ row }) => (
        <span className="font-medium">
          {row.original.firstName} {row.original.lastName}
        </span>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <span className="text-muted-foreground">{row.original.email}</span>
      ),
    },
    {
      id: "role",
      header: "Role",
      cell: ({ row }) => <UserRoleSelect user={row.original} />,
    },
    {
      accessorKey: "admissionNumber",
      header: "Admission Number",
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {row.original.admissionNumber || "—"}
        </span>
      ),
    },
    {
      accessorKey: "phoneNumber",
      header: "Phone",
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {row.original.phoneNumber || "—"}
        </span>
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) => (
        <div className="flex flex-wrap items-center gap-2">
          {row.original.isActive ? (
            <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
              Active
            </span>
          ) : (
            <span className="inline-flex items-center rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/20">
              Inactive
            </span>
          )}
          {row.original.mustChangePassword && (
            <span className="inline-flex items-center rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-700 ring-1 ring-inset ring-yellow-600/20">
              Must change password
            </span>
          )}
        </div>
      ),
    },
    {
      accessorKey: "lastLoginAt",
      header: "Last Login",
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {row.original.lastLoginAt
            ? formatDistanceToNow(new Date(row.original.lastLoginAt), {
                addSuffix: true,
              })
            : "Never"}
        </span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Joined",
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {formatDistanceToNow(new Date(row.original.createdAt), {
            addSuffix: true,
          })}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center justify-end">
          <EditUserDialog user={toUserInRole(row.original)} />
        </div>
      ),
    },
  ];
}

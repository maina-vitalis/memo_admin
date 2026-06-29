"use client";

import { useMemo } from "react";
import { Building2Icon, UsersIcon } from "lucide-react";
import type { Department } from "@/features/tenant-admin/departments/api/get-departments";
import type { UserInRole } from "@/features/tenant-admin/roles/api/get-users";
import { EditDepartmentDialog } from "@/features/tenant-admin/departments/components/edit-department-dialog";
import { DeleteDepartmentDialog } from "@/features/tenant-admin/departments/components/delete-department-dialog";

interface DepartmentsTableProps {
  departments: Department[];
  users: UserInRole[];
}

function formatHeadName(
  headUserId: string | null,
  users: UserInRole[],
): string {
  if (!headUserId) return "—";
  const head = users.find((user) => user.id === headUserId);
  if (!head) return "—";
  return `${head.firstName} ${head.lastName}`;
}

export function DepartmentsTable({ departments, users }: DepartmentsTableProps) {
  const memberCounts = useMemo(() => {
    const counts = new Map<string, number>();
    users.forEach((user) => {
      if (user.departmentId) {
        counts.set(
          user.departmentId,
          (counts.get(user.departmentId) || 0) + 1,
        );
      }
    });
    return counts;
  }, [users]);

  if (departments.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-muted/50 p-12 text-center">
        <Building2Icon className="mx-auto h-8 w-8 text-muted-foreground" />
        <p className="mt-3 text-sm font-medium text-foreground">
          No departments yet
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Create your first academic unit to organize users and memos.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border bg-card">
      <table className="w-full text-sm">
        <thead className="border-b bg-muted/50">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">
              Name
            </th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">
              Code
            </th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">
              Head
            </th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">
              Members
            </th>
            <th className="px-4 py-3 text-right font-medium text-muted-foreground">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {departments.map((department) => {
            const memberCount = memberCounts.get(department.id) || 0;

            return (
              <tr
                key={department.id}
                className="transition-colors hover:bg-muted/50"
              >
                <td className="px-4 py-3 font-medium">{department.name}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {department.code || "—"}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {formatHeadName(department.headUserId, users)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <UsersIcon className="h-4 w-4" />
                    <span>{memberCount}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <EditDepartmentDialog department={department} />
                    <DeleteDepartmentDialog
                      department={department}
                      memberCount={memberCount}
                    />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

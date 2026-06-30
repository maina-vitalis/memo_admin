"use client";

import { useMemo } from "react";
import { Building2Icon } from "lucide-react";
import type { Department } from "@/features/tenant-admin/departments/api/get-departments";
import type { UserInRole } from "@/features/tenant-admin/roles/api/get-users";
import {
  departmentsColumns,
  type DepartmentRow,
} from "@/features/tenant-admin/departments/components/departments-columns";
import { DataTable } from "@/components/data-table/data-table";

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
  const tableData = useMemo<DepartmentRow[]>(() => {
    const memberCounts = new Map<string, number>();
    users.forEach((user) => {
      if (user.departmentId) {
        memberCounts.set(
          user.departmentId,
          (memberCounts.get(user.departmentId) || 0) + 1,
        );
      }
    });

    return departments.map((department) => ({
      ...department,
      memberCount: memberCounts.get(department.id) || 0,
      headName: formatHeadName(department.headUserId, users),
    }));
  }, [departments, users]);

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

  return <DataTable columns={departmentsColumns} data={tableData} />;
}

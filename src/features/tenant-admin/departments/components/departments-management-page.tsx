"use client";

import { useDepartments } from "@/features/tenant-admin/departments/api/use-departments";
import { useInstitutionUsers } from "@/features/tenant-admin/roles/api/use-users";
import { CreateDepartmentDialog } from "@/features/tenant-admin/departments/components/create-department-dialog";
import { DepartmentsTable } from "@/features/tenant-admin/departments/components/departments-table";
import { Spinner } from "@/components/ui/spinner";

export function DepartmentsManagementPage() {
  const { data: departments, isLoading: departmentsLoading } =
    useDepartments();
  const { data: users, isLoading: usersLoading } = useInstitutionUsers();

  const isLoading = departmentsLoading || usersLoading;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Departments
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage academic units in your institution.
          </p>
        </div>

        <CreateDepartmentDialog />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Spinner />
          <span className="ml-2 text-sm text-muted-foreground">
            Loading departments...
          </span>
        </div>
      ) : (
        <DepartmentsTable
          departments={departments ?? []}
          users={users ?? []}
        />
      )}
    </div>
  );
}

"use client";

import { PageHeader } from "@/components/page-header";
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
      <PageHeader
        title="Departments"
        description="Manage academic units in your institution."
        action={<CreateDepartmentDialog />}
      />

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

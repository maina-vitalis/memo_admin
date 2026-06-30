"use client";

import { useInstitutionRoles } from "@/features/tenant-admin/roles/api/use-roles";
import { useInstitutionUsers } from "@/features/tenant-admin/roles/api/use-users";
import { RolesTable } from "@/features/tenant-admin/roles/components/roles-table";
import { Spinner } from "@/components/ui/spinner";

export function RolesManagementPage() {
  const { data: roles, isLoading: rolesLoading } = useInstitutionRoles();
  const { data: users, isLoading: usersLoading } = useInstitutionUsers();

  const isLoading = rolesLoading || usersLoading;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          Roles & Permissions
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage roles and hierarchy levels for your institution.
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Spinner />
          <span className="ml-2 text-sm text-muted-foreground">
            Loading roles...
          </span>
        </div>
      ) : (
        <RolesTable roles={roles ?? []} users={users ?? []} />
      )}
    </div>
  );
}

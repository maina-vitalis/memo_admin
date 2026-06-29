"use client";

import { useState, useMemo } from "react";
import { useInstitutionRoles } from "@/features/tenant-admin/roles/api/use-roles";
import { useInstitutionUsers } from "@/features/tenant-admin/roles/api/use-users";
import { RolesTable } from "@/features/tenant-admin/roles/components/roles-table";
import { Spinner } from "@/components/ui/spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { FilterIcon } from "lucide-react";

export function RolesManagementPage() {
  const { data: roles, isLoading: rolesLoading } = useInstitutionRoles();
  const { data: users, isLoading: usersLoading } = useInstitutionUsers();
  const [selectedRoleId, setSelectedRoleId] = useState<string>("all");

  const isLoading = rolesLoading || usersLoading;

  // Filter roles and users based on selection
  const { filteredRoles, filteredUsers } = useMemo(() => {
    if (selectedRoleId === "all") {
      return {
        filteredRoles: roles || [],
        filteredUsers: users || [],
      };
    }

    return {
      filteredRoles: roles?.filter((role) => role.id === selectedRoleId) || [],
      filteredUsers: users?.filter((user) => user.roleId === selectedRoleId) || [],
    };
  }, [roles, users, selectedRoleId]);

  // Count users per role
  const userCountsByRole = useMemo(() => {
    const counts = new Map<string, number>();
    users?.forEach((user) => {
      counts.set(user.roleId, (counts.get(user.roleId) || 0) + 1);
    });
    return counts;
  }, [users]);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Roles & Permissions
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            View roles and users assigned to each role in your institution.
          </p>
        </div>

        {/* Filter Dropdown */}
        {!isLoading && roles && roles.length > 0 && (
          <div className="w-64 space-y-2">
            <Label htmlFor="role-filter" className="flex items-center gap-2">
              <FilterIcon className="h-4 w-4" />
              Filter by Role
            </Label>
            <Select value={selectedRoleId} onValueChange={setSelectedRoleId}>
              <SelectTrigger id="role-filter" className="w-full">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  All Roles ({users?.length || 0} total users)
                </SelectItem>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={role.id}>
                    {role.name} ({userCountsByRole.get(role.id) || 0} users)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Spinner />
          <span className="ml-2 text-sm text-muted-foreground">
            Loading roles and users...
          </span>
        </div>
      ) : (
        <RolesTable roles={filteredRoles} users={filteredUsers} />
      )}
    </div>
  );
}

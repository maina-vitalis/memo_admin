"use client";

import type { RoleWithDetails } from "@/features/tenant-admin/roles/api/get-roles";
import type { UserInRole } from "@/features/tenant-admin/roles/api/get-users";
import { EditUserDialog } from "@/features/tenant-admin/roles/components/edit-user-dialog";
import { DeleteUserDialog } from "@/features/tenant-admin/roles/components/delete-user-dialog";
import { UsersIcon } from "lucide-react";
import { useMemo } from "react";

interface RolesTableProps {
  roles: RoleWithDetails[];
  users: UserInRole[];
}

export function RolesTable({ roles, users }: RolesTableProps) {
  // Group users by role
  const usersByRole = useMemo(() => {
    const grouped = new Map<string, UserInRole[]>();
    
    roles.forEach((role) => {
      grouped.set(role.id, []);
    });
    
    users.forEach((user) => {
      const roleUsers = grouped.get(user.roleId);
      if (roleUsers) {
        roleUsers.push(user);
      }
    });
    
    return grouped;
  }, [roles, users]);

  if (roles.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-muted/50 p-12 text-center">
        <p className="text-sm text-muted-foreground">
          No roles found. Create roles to manage permissions.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {roles.map((role) => {
        const roleUsers = usersByRole.get(role.id) || [];
        
        return (
          <div key={role.id} className="rounded-lg border bg-card">
            <div className="border-b bg-muted/50 px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{role.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Hierarchy Level: {role.hierarchyLevel}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <UsersIcon className="h-4 w-4" />
                  <span>{roleUsers.length} {roleUsers.length === 1 ? 'user' : 'users'}</span>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              {roleUsers.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No users assigned to this role yet.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b">
                      <tr>
                        <th className="px-3 py-2 text-left font-medium text-muted-foreground">Name</th>
                        <th className="px-3 py-2 text-left font-medium text-muted-foreground">Email</th>
                        <th className="px-3 py-2 text-left font-medium text-muted-foreground">Staff Number</th>
                        <th className="px-3 py-2 text-left font-medium text-muted-foreground">Status</th>
                        <th className="px-3 py-2 text-right font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {roleUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-muted/50 transition-colors">
                          <td className="px-3 py-3">
                            <div className="font-medium">
                              {user.firstName} {user.lastName}
                            </div>
                          </td>
                          <td className="px-3 py-3 text-muted-foreground">
                            {user.email}
                          </td>
                          <td className="px-3 py-3 text-muted-foreground">
                            {user.staffNumber || "—"}
                          </td>
                          <td className="px-3 py-3">
                            <div className="flex items-center gap-2">
                              {user.isActive ? (
                                <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                  Active
                                </span>
                              ) : (
                                <span className="inline-flex items-center rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/20">
                                  Inactive
                                </span>
                              )}
                              {user.mustChangePassword && (
                                <span className="inline-flex items-center rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-700 ring-1 ring-inset ring-yellow-600/20">
                                  Pending
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-3 py-3">
                            <div className="flex items-center justify-end gap-1">
                              <EditUserDialog user={user} />
                              <DeleteUserDialog user={user} />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

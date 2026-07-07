"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { User } from "@/features/tenant-admin/provisioning/api/get-users";
import {
  ASSIGNABLE_ROLES,
  formatRoleLabel,
} from "@/features/tenant-admin/provisioning/utils/role-label";
import { useUpdateUser } from "@/features/tenant-admin/roles/api/use-update-user";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";

type UserRoleSelectProps = {
  user: User;
};

export function UserRoleSelect({ user }: UserRoleSelectProps) {
  const updateUserMutation = useUpdateUser();
  const [optimisticValue, setOptimisticValue] = useState<string | null>(null);
  const value = optimisticValue ?? user.role ?? "";

  async function handleRoleChange(nextRole: string) {
    setOptimisticValue(nextRole);

    try {
      await updateUserMutation.mutateAsync({
        userId: user.id,
        data: { role: nextRole },
      });

      toast.success(`Role updated for ${user.firstName} ${user.lastName}`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update role";
      toast.error(message);
    } finally {
      setOptimisticValue(null);
    }
  }

  return (
    <div className="relative min-w-[180px]">
      <Select
        value={value}
        onValueChange={handleRoleChange}
        disabled={updateUserMutation.isPending}
      >
        <SelectTrigger className="h-8 w-full">
          <SelectValue placeholder="Select role" />
        </SelectTrigger>
        <SelectContent>
          {ASSIGNABLE_ROLES.map((role) => (
            <SelectItem key={role} value={role}>
              {formatRoleLabel(role)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {updateUserMutation.isPending && (
        <Spinner className="absolute top-1/2 right-8 size-4 -translate-y-1/2" />
      )}
    </div>
  );
}

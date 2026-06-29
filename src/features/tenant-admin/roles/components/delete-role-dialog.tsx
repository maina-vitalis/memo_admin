"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useDeleteRole } from "@/features/tenant-admin/roles/api/use-delete-role";
import type { RoleWithDetails } from "@/features/tenant-admin/roles/api/get-roles";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Trash2Icon } from "lucide-react";

interface DeleteRoleDialogProps {
  role: RoleWithDetails;
  userCount: number;
}

export function DeleteRoleDialog({ role, userCount }: DeleteRoleDialogProps) {
  const [open, setOpen] = useState(false);
  const deleteRoleMutation = useDeleteRole();

  async function handleDelete() {
    try {
      await deleteRoleMutation.mutateAsync(role.id);
      toast.success(`Role "${role.name}" has been deleted`);
      setOpen(false);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete role";
      toast.error(message);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Trash2Icon className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Role "{role.name}"?</AlertDialogTitle>
          <AlertDialogDescription>
            {userCount > 0 ? (
              <>
                This role currently has <strong>{userCount} user(s)</strong>{" "}
                assigned to it. Deleting this role will affect these users.
                <br />
                <br />
                This action cannot be undone.
              </>
            ) : (
              <>
                This will permanently delete the role. This action cannot be
                undone.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteRoleMutation.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={deleteRoleMutation.isPending}
            className="bg-destructive hover:bg-destructive/90"
          >
            {deleteRoleMutation.isPending ? (
              <>
                <Spinner />
                Deleting...
              </>
            ) : (
              "Delete Role"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

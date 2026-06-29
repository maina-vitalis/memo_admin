"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useDeleteUser } from "@/features/tenant-admin/roles/api/use-delete-user";
import type { UserInRole } from "@/features/tenant-admin/roles/api/get-users";
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

interface DeleteUserDialogProps {
  user: UserInRole;
}

export function DeleteUserDialog({ user }: DeleteUserDialogProps) {
  const [open, setOpen] = useState(false);
  const deleteUserMutation = useDeleteUser();

  async function handleDelete() {
    try {
      await deleteUserMutation.mutateAsync(user.id);
      toast.success(`User "${user.firstName} ${user.lastName}" has been deactivated`);
      setOpen(false);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to deactivate user";
      toast.error(message);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Trash2Icon className="h-4 w-4 text-destructive" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Deactivate {user.firstName} {user.lastName}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This will deactivate the user account. The user will no longer be
            able to log in. This action can be reversed by reactivating the
            account later.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteUserMutation.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={deleteUserMutation.isPending}
            className="bg-destructive hover:bg-destructive/90"
          >
            {deleteUserMutation.isPending ? (
              <>
                <Spinner />
                Deactivating...
              </>
            ) : (
              "Deactivate User"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

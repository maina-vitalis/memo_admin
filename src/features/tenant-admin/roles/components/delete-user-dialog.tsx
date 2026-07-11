"use client";

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
} from "@/components/ui/alert-dialog";
import { Spinner } from "@/components/ui/spinner";

interface DeleteUserDialogProps {
  user: UserInRole;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteUserDialog({ user, open, onOpenChange }: DeleteUserDialogProps) {
  const deleteUserMutation = useDeleteUser();

  async function handleDelete() {
    try {
      await deleteUserMutation.mutateAsync(user.id);
      toast.success(`"${user.firstName} ${user.lastName}" has been deleted`);
      onOpenChange(false);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete user";
      toast.error(message);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Delete {user.firstName} {user.lastName}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This permanently deletes the user account along with every memo
            they sent (and all of those memos&apos; recipient read receipts,
            notifications, and attachments institution-wide), plus their own
            sessions and login tokens. This cannot be undone.
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
                Deleting...
              </>
            ) : (
              "Delete permanently"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

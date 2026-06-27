"use client";

import * as React from "react";
import type { Tenant } from "@/features/super-admin/dashboard/types/tenant";
import { useDeleteTenant } from "@/features/super-admin/dashboard/api/use-tenants";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

type DeleteTenantDialogProps = {
  tenant: Tenant | null;
  isOpen: boolean;
  onClose: () => void;
};

export function DeleteTenantDialog({
  tenant,
  isOpen,
  onClose,
}: DeleteTenantDialogProps) {
  const deleteMutation = useDeleteTenant();

  async function handleConfirm() {
    if (!tenant) return;

    try {
      await deleteMutation.mutateAsync(tenant.id);
      toast.success(`${tenant.name} deleted successfully`);
      onClose();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete institution";
      toast.error(message);
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent size="default">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Institution</AlertDialogTitle>
          <AlertDialogDescription>
            Are you absolutely sure you want to delete <strong>{tenant?.name}</strong>?
            This will permanently delete the institution and all associated data,
            including users, roles, departments, and memos. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={deleteMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? (
              <>
                <Spinner />
                Deleting...
              </>
            ) : (
              "Delete permanently"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Trash2Icon } from "lucide-react";
import { useDeleteDepartment } from "@/features/tenant-admin/departments/api/use-delete-department";
import type { Department } from "@/features/tenant-admin/departments/api/get-departments";
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

interface DeleteDepartmentDialogProps {
  department: Department;
  memberCount: number;
}

export function DeleteDepartmentDialog({
  department,
  memberCount,
}: DeleteDepartmentDialogProps) {
  const [open, setOpen] = useState(false);
  const deleteMutation = useDeleteDepartment();

  async function handleDelete() {
    try {
      await deleteMutation.mutateAsync(department.id);
      toast.success(`Department "${department.name}" has been deactivated`);
      setOpen(false);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete department";
      toast.error(message);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Trash2Icon className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Deactivate &quot;{department.name}&quot;?
          </AlertDialogTitle>
          <AlertDialogDescription>
            {memberCount > 0 ? (
              <>
                This department has <strong>{memberCount} member(s)</strong>{" "}
                assigned. They will keep their assignment, but the department
                will no longer appear in active lists.
              </>
            ) : (
              <>
                This will deactivate the department. It will no longer appear
                in dropdowns or active lists.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteMutation.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={deleteMutation.isPending}
            className="bg-destructive hover:bg-destructive/90"
          >
            {deleteMutation.isPending ? (
              <>
                <Spinner />
                Deactivating...
              </>
            ) : (
              "Deactivate department"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

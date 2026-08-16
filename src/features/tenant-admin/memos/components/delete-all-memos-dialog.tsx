"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Trash2Icon } from "lucide-react";
import { useDeleteAllMemos } from "@/features/tenant-admin/memos/api/use-delete-all-memos";
import { Button } from "@/components/ui/button";
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
import { Spinner } from "@/components/ui/spinner";

type DeleteAllMemosDialogProps = {
  totalMemos: number;
};

export function DeleteAllMemosDialog({ totalMemos }: DeleteAllMemosDialogProps) {
  const [open, setOpen] = useState(false);
  const deleteAllMutation = useDeleteAllMemos();

  async function handleDeleteAll() {
    try {
      await deleteAllMutation.mutateAsync();
      toast.success("All memos have been deleted");
      setOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete memos",
      );
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          size="sm"
          disabled={totalMemos === 0}
        >
          <Trash2Icon />
          Delete All
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete all memos?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete all{" "}
            <span className="font-semibold text-foreground">
              {totalMemos}
            </span>{" "}
            memo{totalMemos !== 1 ? "s" : ""} along with their recipient read
            receipts, notifications, and attachments. This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteAllMutation.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(event) => {
              event.preventDefault();
              handleDeleteAll();
            }}
            disabled={deleteAllMutation.isPending}
            className="bg-destructive hover:bg-destructive/90"
          >
            {deleteAllMutation.isPending ? (
              <>
                <Spinner />
                Deleting...
              </>
            ) : (
              "Delete all permanently"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

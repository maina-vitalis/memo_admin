"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ArchiveIcon, MoreHorizontalIcon, Trash2Icon } from "lucide-react";
import { useArchiveMemo } from "@/features/tenant-admin/memos/api/use-archive-memo";
import { useDeleteMemo } from "@/features/tenant-admin/memos/api/use-delete-memo";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

type MemoRowActionsProps = {
  memoId: string;
  memoTitle: string;
  isArchived: boolean;
};

export function MemoRowActions({
  memoId,
  memoTitle,
  isArchived,
}: MemoRowActionsProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const archiveMutation = useArchiveMemo();
  const deleteMutation = useDeleteMemo();

  async function handleArchive() {
    try {
      await archiveMutation.mutateAsync(memoId);
      toast.success("Memo archived");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to archive memo",
      );
    }
  }

  async function handleDelete() {
    try {
      await deleteMutation.mutateAsync(memoId);
      toast.success(`"${memoTitle}" has been deleted`);
      setConfirmOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete memo",
      );
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm" aria-label="Memo actions">
            <MoreHorizontalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            disabled={isArchived || archiveMutation.isPending}
            onClick={handleArchive}
          >
            <ArchiveIcon />
            {isArchived ? "Archived" : "Archive"}
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onSelect={(event) => {
              event.preventDefault();
              setConfirmOpen(true);
            }}
          >
            <Trash2Icon />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete &quot;{memoTitle}&quot;?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently deletes the memo along with all recipient read
              receipts, notifications, and attachments. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(event) => {
                event.preventDefault();
                handleDelete();
              }}
              disabled={deleteMutation.isPending}
              className="bg-destructive hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? (
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
    </>
  );
}

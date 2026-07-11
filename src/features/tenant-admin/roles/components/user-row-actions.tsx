"use client";

import { useState } from "react";
import { MoreHorizontalIcon, PencilIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditUserDialog } from "@/features/tenant-admin/roles/components/edit-user-dialog";
import { DeleteUserDialog } from "@/features/tenant-admin/roles/components/delete-user-dialog";
import type { UserInRole } from "@/features/tenant-admin/roles/api/get-users";

type UserRowActionsProps = {
  user: UserInRole;
};

export function UserRowActions({ user }: UserRowActionsProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm" aria-label="User actions">
            <MoreHorizontalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onSelect={(event) => {
              event.preventDefault();
              setEditOpen(true);
            }}
          >
            <PencilIcon />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onSelect={(event) => {
              event.preventDefault();
              setDeleteOpen(true);
            }}
          >
            <Trash2Icon />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditUserDialog user={user} open={editOpen} onOpenChange={setEditOpen} />
      <DeleteUserDialog user={user} open={deleteOpen} onOpenChange={setDeleteOpen} />
    </>
  );
}

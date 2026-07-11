"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { memoStatusStyles } from "@/features/tenant-admin/memos/lib/memo-style";
import { MemoRowActions } from "@/features/tenant-admin/memos/components/memo-row-actions";
import type { MemoLedgerRow } from "@/features/tenant-admin/memos/types/memo";

export function createMemoLedgerColumns(
  onView: (id: string) => void,
): ColumnDef<MemoLedgerRow>[] {
  return [
    {
      accessorKey: "title",
      header: "Memo",
      cell: ({ row }) => (
        <div className="whitespace-normal">
          <p className="font-medium text-foreground">{row.original.title}</p>
          <p className="mt-0.5 text-xs text-muted-foreground capitalize">
            {row.original.category}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "department",
      header: "Department",
      cell: ({ row }) => (
        <span className="text-sm text-foreground">
          {row.original.department}
        </span>
      ),
    },
    {
      accessorKey: "sentAt",
      header: "Sent",
      cell: ({ row }) => (
        <span className="text-sm text-foreground">{row.original.sentAt}</span>
      ),
    },
    {
      accessorKey: "recipients",
      header: "Recipients",
      cell: ({ row }) => (
        <span className="text-sm text-foreground">
          {row.original.recipients}
        </span>
      ),
    },
    {
      accessorKey: "readRate",
      header: "Read rate",
      cell: ({ row }) => (
        <span
          className={cn(
            "text-sm font-medium",
            row.original.readRate >= 80 ? "text-primary" : "text-secondary",
          )}
        >
          {row.original.readRate}%
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const config = memoStatusStyles[row.original.status];

        return (
          <Badge
            variant="outline"
            className={cn("rounded px-2 py-0.5 text-[11px] font-medium", config.className)}
          >
            {config.label}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => onView(row.original.id)}
            className="text-sm font-medium text-primary hover:underline"
          >
            View
          </button>
          <MemoRowActions
            memoId={row.original.id}
            memoTitle={row.original.title}
            isArchived={row.original.status === "archived"}
          />
        </div>
      ),
    },
  ];
}

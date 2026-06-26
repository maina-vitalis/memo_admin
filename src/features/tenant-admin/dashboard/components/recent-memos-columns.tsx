"use client";

import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import type { RecentMemo } from "@/features/tenant-admin/dashboard/types/dashboard";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const statusStyles: Record<
  RecentMemo["status"],
  { label: string; className: string }
> = {
  published: {
    label: "Published",
    className: "border-green-200 bg-green-100 text-green-800",
  },
  draft: {
    label: "Draft",
    className: "border-border bg-muted text-muted-foreground",
  },
  scheduled: {
    label: "Scheduled",
    className: "border-blue-200 bg-blue-100 text-blue-800",
  },
};

export const recentMemosColumns: ColumnDef<RecentMemo>[] = [
  {
    accessorKey: "title",
    header: "Memo",
    cell: ({ row }) => (
      <div className="whitespace-normal">
        <p className="font-medium text-foreground">{row.original.title}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {row.original.department}
        </p>
      </div>
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
      const config = statusStyles[row.original.status];

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
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => (
      <Link
        href={`/admin/memos/${row.original.id}`}
        className="text-sm font-medium text-primary hover:underline"
      >
        View
      </Link>
    ),
  },
];

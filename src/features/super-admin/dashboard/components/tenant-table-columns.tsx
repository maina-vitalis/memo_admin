"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { EyeIcon, MoreHorizontalIcon, PencilIcon } from "lucide-react";
import { SeatQuotaCell } from "@/features/super-admin/dashboard/components/seat-quota-cell";
import { TenantStatusBadge } from "@/features/super-admin/dashboard/components/tenant-status-badge";
import type { Tenant } from "@/features/super-admin/dashboard/types/tenant";
import { cn } from "@/lib/utils";

export const tenantTableColumns: ColumnDef<Tenant>[] = [
  {
    accessorKey: "name",
    header: "Institution Name",
    cell: ({ row }) => (
      <div className="whitespace-normal">
        <div className="font-semibold text-foreground">{row.original.name}</div>
        <div className="mt-0.5 text-xs text-muted-foreground">
          {row.original.subdomain}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "shortcode",
    header: "Shortcode",
    cell: ({ row }) => row.original.shortcode,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <TenantStatusBadge status={row.original.status} />,
  },
  {
    id: "seatQuota",
    header: "Seat Quota",
    cell: ({ row }) => (
      <SeatQuotaCell
        seatsActive={row.original.seatsActive}
        seatQuota={row.original.seatQuota}
        status={row.original.status}
      />
    ),
  },
  {
    accessorKey: "usersActive",
    header: "Users Active",
    cell: ({ row }) => row.original.usersActive.toLocaleString(),
  },
  {
    accessorKey: "subscriptionEndsLabel",
    header: "Subscription Ends",
    cell: ({ row }) => (
      <span
        className={cn(
          row.original.subscriptionEndsVariant === "warning" &&
            "font-medium text-secondary",
          row.original.subscriptionEndsVariant === "error" && "text-destructive",
        )}
      >
        {row.original.subscriptionEndsLabel}
      </span>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: () => (
      <div className="flex justify-end gap-1 text-muted-foreground/70 transition-colors group-hover:text-muted-foreground">
        <button
          type="button"
          className="rounded p-1 transition-colors hover:text-primary"
          aria-label="View institution"
        >
          <EyeIcon className="size-5" />
        </button>
        <button
          type="button"
          className="rounded p-1 transition-colors hover:text-primary"
          aria-label="Edit institution"
        >
          <PencilIcon className="size-5" />
        </button>
        <button
          type="button"
          className="rounded p-1 transition-colors hover:text-primary"
          aria-label="More actions"
        >
          <MoreHorizontalIcon className="size-5" />
        </button>
      </div>
    ),
  },
];

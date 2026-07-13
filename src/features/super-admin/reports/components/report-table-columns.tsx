"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { SeatQuotaCell } from "@/features/super-admin/dashboard/components/seat-quota-cell";
import { TenantStatusBadge } from "@/features/super-admin/dashboard/components/tenant-status-badge";
import type { Tenant } from "@/features/super-admin/dashboard/types/tenant";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const PLAN_LABELS: Record<Tenant["plan"], string> = {
  trial: "Trial",
  basic: "Basic",
  pro: "Pro",
};

export const reportTableColumns: ColumnDef<Tenant>[] = [
  {
    accessorKey: "name",
    header: "Institution",
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
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <TenantStatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "plan",
    header: "Plan",
    cell: ({ row }) => (
      <Badge variant="outline">{PLAN_LABELS[row.original.plan]}</Badge>
    ),
  },
  {
    id: "seatQuota",
    header: "Seats",
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
    accessorKey: "contactEmail",
    header: "Contact",
  },
];

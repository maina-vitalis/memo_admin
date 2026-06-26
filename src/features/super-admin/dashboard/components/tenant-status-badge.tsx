import type { TenantStatus } from "@/features/super-admin/dashboard/types/tenant";
import { cn } from "@/lib/utils";

const statusStyles: Record<TenantStatus, { label: string; className: string }> =
  {
    active: {
      label: "Active",
      className: "border-green-200 bg-green-100 text-green-800",
    },
    pending: {
      label: "Pending",
      className: "border-yellow-200 bg-yellow-100 text-yellow-800",
    },
    suspended: {
      label: "Suspended",
      className: "border-red-200 bg-red-100 text-red-900",
    },
    trial: {
      label: "Trial",
      className: "border-blue-200 bg-blue-100 text-blue-800",
    },
  };

type TenantStatusBadgeProps = {
  status: TenantStatus;
};

export function TenantStatusBadge({ status }: TenantStatusBadgeProps) {
  const config = statusStyles[status];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded border px-2 py-0.5 text-[11px] font-medium",
        config.className,
      )}
    >
      {config.label}
    </span>
  );
}

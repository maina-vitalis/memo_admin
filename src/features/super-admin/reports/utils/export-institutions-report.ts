import * as XLSX from "xlsx";
import { format } from "date-fns";
import type { Tenant } from "@/features/super-admin/dashboard/types/tenant";

const REPORT_COLUMNS = [
  "Institution",
  "Shortcode",
  "Subdomain",
  "Status",
  "Plan",
  "Seats Active",
  "Seat Quota",
  "Users Active",
  "Subscription Ends",
  "Contact Email",
] as const;

function toRow(tenant: Tenant): (string | number)[] {
  return [
    tenant.name,
    tenant.shortcode,
    tenant.subdomain,
    tenant.status,
    tenant.plan,
    tenant.seatsActive,
    tenant.seatQuota,
    tenant.usersActive,
    tenant.subscriptionEndsLabel,
    tenant.contactEmail,
  ];
}

/** Builds and downloads an Excel snapshot of the given institution rows. */
export function downloadInstitutionsReport(tenants: Tenant[]): void {
  const rows = [[...REPORT_COLUMNS], ...tenants.map(toRow)];
  const worksheet = XLSX.utils.aoa_to_sheet(rows);

  worksheet["!cols"] = [
    { wch: 28 },
    { wch: 12 },
    { wch: 20 },
    { wch: 12 },
    { wch: 10 },
    { wch: 12 },
    { wch: 12 },
    { wch: 12 },
    { wch: 20 },
    { wch: 28 },
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Institutions");

  XLSX.writeFile(
    workbook,
    `institutions-report-${format(new Date(), "yyyy-MM-dd")}.xlsx`,
  );
}

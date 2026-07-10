import * as XLSX from "xlsx";
import {
  ROSTER_TEMPLATE_COLUMNS,
  ROSTER_TEMPLATE_EXAMPLE_ROW,
  ROSTER_TEMPLATE_FILENAME,
} from "@/features/tenant-admin/provisioning/utils/roster-template-columns";

/**
 * Builds and downloads the Excel template expected by bulk roster upload.
 */
export function downloadRosterTemplate(): void {
  const rows = [
    [...ROSTER_TEMPLATE_COLUMNS],
    ROSTER_TEMPLATE_COLUMNS.map(
      (column) => ROSTER_TEMPLATE_EXAMPLE_ROW[column],
    ),
    ROSTER_TEMPLATE_COLUMNS.map(() => ""),
    ROSTER_TEMPLATE_COLUMNS.map(() => ""),
  ];

  const worksheet = XLSX.utils.aoa_to_sheet(rows);

  worksheet["!cols"] = [
    { wch: 22 },
    { wch: 16 },
    { wch: 16 },
    { wch: 32 },
    { wch: 18 },
    { wch: 24 },
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Roster");

  XLSX.writeFile(workbook, ROSTER_TEMPLATE_FILENAME);
}

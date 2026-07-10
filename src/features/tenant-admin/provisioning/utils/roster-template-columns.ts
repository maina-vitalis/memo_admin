/**
 * Canonical bulk-upload roster columns.
 * Header spellings match memo_backend parse-roster-workbook HEADER_ALIASES.
 */
export const ROSTER_TEMPLATE_COLUMNS = [
  "Admission Number",
  "First Name",
  "Last Name",
  "Email",
  "Phone Number",
  "Department",
] as const;

/** Example row — placeholders only; delete or replace before upload. */
export const ROSTER_TEMPLATE_EXAMPLE_ROW: Record<
  (typeof ROSTER_TEMPLATE_COLUMNS)[number],
  string
> = {
  "Admission Number": "ADM-2024-001",
  "First Name": "Jane",
  "Last Name": "Doe",
  Email: "jane.doe@institution.ac.ke",
  "Phone Number": "+254712345678",
  Department: "Electrical Engineering",
};

export const ROSTER_TEMPLATE_FILENAME = "tvet-memo-bulk-roster-template.xlsx";

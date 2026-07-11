import type { MemoDetail } from "@/features/tenant-admin/memos/types/memo";

export const memoStatusStyles: Record<
  MemoDetail["status"],
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
  archived: {
    label: "Archived",
    className: "border-amber-200 bg-amber-100 text-amber-800",
  },
};

export const memoPriorityStyles: Record<MemoDetail["priority"], string> = {
  low: "border-border bg-muted text-muted-foreground",
  normal: "border-blue-200 bg-blue-100 text-blue-800",
  high: "border-amber-200 bg-amber-100 text-amber-800",
  urgent: "border-red-200 bg-red-100 text-red-800",
};

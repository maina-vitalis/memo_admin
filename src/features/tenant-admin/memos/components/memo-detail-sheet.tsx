"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useMemoDetail } from "@/features/tenant-admin/memos/api/use-memo-detail";
import { MemoAttachmentsList } from "@/features/tenant-admin/memos/components/memo-attachments-list";
import { MemoBodyContent } from "@/features/tenant-admin/memos/components/memo-body-content";
import { MemoDeliveryPanel } from "@/features/tenant-admin/memos/components/memo-delivery-panel";
import {
  memoPriorityStyles,
  memoStatusStyles,
} from "@/features/tenant-admin/memos/lib/memo-style";
import { cn } from "@/lib/utils";

type MemoDetailSheetProps = {
  memoId: string | null;
  onOpenChange: (open: boolean) => void;
};

export function MemoDetailSheet({ memoId, onOpenChange }: MemoDetailSheetProps) {
  const { data, isLoading, isError } = useMemoDetail(memoId);

  return (
    <Sheet open={!!memoId} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{data?.subject ?? "Memo details"}</SheetTitle>
          <SheetDescription>
            {data
              ? `Sent ${data.sentAt} · ${data.department}`
              : "Latest details for this memo"}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-6 overflow-y-auto px-4 pb-6">
          {isLoading && (
            <div className="space-y-3">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-24 w-full" />
            </div>
          )}

          {isError && (
            <p className="text-sm text-destructive">
              Failed to load memo details.
            </p>
          )}

          {data && (
            <>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant="outline"
                  className={cn(
                    "rounded px-2 py-0.5 text-[11px] font-medium",
                    memoStatusStyles[data.status].className,
                  )}
                >
                  {memoStatusStyles[data.status].label}
                </Badge>
                <Badge
                  variant="outline"
                  className={cn(
                    "rounded px-2 py-0.5 text-[11px] font-medium capitalize",
                    memoPriorityStyles[data.priority],
                  )}
                >
                  {data.priority} priority
                </Badge>
                <Badge
                  variant="outline"
                  className="rounded px-2 py-0.5 text-[11px] font-medium capitalize"
                >
                  {data.category}
                </Badge>
              </div>

              <dl className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="text-muted-foreground">Sender</dt>
                  <dd className="mt-0.5 font-medium text-foreground">
                    {data.senderName}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Department</dt>
                  <dd className="mt-0.5 font-medium text-foreground">
                    {data.department}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Sent</dt>
                  <dd className="mt-0.5 font-medium text-foreground">
                    {data.sentAt}
                  </dd>
                </div>
              </dl>

              <div>
                <h4 className="text-sm font-medium text-foreground">
                  Read rate
                </h4>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${data.recipients.readRate}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {data.recipients.read} of {data.recipients.total} recipients
                  read ({data.recipients.readRate}%)
                </p>
              </div>

              <MemoDeliveryPanel
                memoId={data.id}
                status={data.status}
                delivery={data.delivery}
              />

              <div>
                <h4 className="text-sm font-medium text-foreground">
                  Message
                </h4>
                <MemoBodyContent
                  body={data.body}
                  bodyFormat={data.bodyFormat}
                />
              </div>

              <MemoAttachmentsList attachments={data.attachments ?? []} />
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

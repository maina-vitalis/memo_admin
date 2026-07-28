"use client";

import { AlertCircle, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useRetryMemoPush } from "@/features/tenant-admin/memos/api/use-retry-memo-push";
import type { MemoPushDelivery } from "@/features/tenant-admin/memos/types/memo";

type MemoDeliveryPanelProps = {
  memoId: string;
  status: "published" | "draft" | "archived";
  delivery?: {
    push: MemoPushDelivery;
  };
};

export function MemoDeliveryPanel({
  memoId,
  status,
  delivery,
}: MemoDeliveryPanelProps) {
  const retryPush = useRetryMemoPush();

  if (status !== "published" || !delivery?.push) {
    return null;
  }

  const { sent, failed, notAttempted, total, failures } = delivery.push;
  const deliveredRate = total > 0 ? Math.round((sent / total) * 100) : 0;
  const needsRetry = failed > 0 || notAttempted > 0;

  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <h4 className="text-sm font-medium text-foreground">Push delivery</h4>
        {needsRetry && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 text-xs"
            disabled={retryPush.isPending}
            onClick={() => retryPush.mutate(memoId)}
          >
            <RefreshCw
              className={`size-3.5 ${retryPush.isPending ? "animate-spin" : ""}`}
            />
            Retry failed
          </Button>
        )}
      </div>

      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary"
          style={{ width: `${deliveredRate}%` }}
        />
      </div>

      <p className="mt-1 text-xs text-muted-foreground">
        {sent} of {total} recipients received push ({deliveredRate}%)
        {failed > 0 ? ` · ${failed} failed` : ""}
        {notAttempted > 0 ? ` · ${notAttempted} not attempted` : ""}
      </p>

      {retryPush.isError && (
        <p className="mt-2 text-xs text-destructive">
          Could not retry push delivery. Try again shortly.
        </p>
      )}

      {retryPush.isSuccess && (
        <p className="mt-2 text-xs text-primary">
          Push retry queued for {retryPush.data.recipientCount} recipients.
        </p>
      )}

      {failures.length > 0 && (
        <ul className="mt-3 space-y-2">
          {failures.map((failure) => (
            <li
              key={`${failure.name}-${failure.error}`}
              className="flex gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs"
            >
              <AlertCircle className="mt-0.5 size-3.5 shrink-0 text-destructive" />
              <span>
                <span className="font-medium text-foreground">
                  {failure.name}
                </span>
                <span className="text-muted-foreground"> — {failure.error}</span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

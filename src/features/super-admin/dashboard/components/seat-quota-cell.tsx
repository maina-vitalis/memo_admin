import { cn } from "@/lib/utils";

type SeatQuotaCellProps = {
  seatsActive: number;
  seatQuota: number;
  status: "active" | "pending" | "suspended" | "trial";
};

export function SeatQuotaCell({
  seatsActive,
  seatQuota,
  status,
}: SeatQuotaCellProps) {
  const percentage =
    seatQuota > 0
      ? Math.min(100, Math.round((seatsActive / seatQuota) * 100))
      : 0;
  const isAtCapacity = percentage >= 100 && status === "suspended";

  return (
    <div className="w-30">
      <span className="mb-1 block text-xs text-muted-foreground">
        {seatsActive.toLocaleString()} / {seatQuota.toLocaleString()}
      </span>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            "h-full rounded-full transition-all",
            isAtCapacity ? "bg-destructive" : "bg-primary",
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

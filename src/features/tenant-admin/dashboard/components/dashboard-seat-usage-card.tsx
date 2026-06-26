import type { SeatUsage } from "@/features/tenant-admin/dashboard/types/dashboard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type DashboardSeatUsageCardProps = {
  seatUsage: SeatUsage;
};

export function DashboardSeatUsageCard({ seatUsage }: DashboardSeatUsageCardProps) {
  const percentage =
    seatUsage.quota > 0
      ? Math.min(100, Math.round((seatUsage.active / seatUsage.quota) * 100))
      : 0;
  const isNearCapacity = percentage >= 90;

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Seat usage</CardTitle>
        <CardDescription>Active student seats vs allocated quota</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-baseline justify-between">
          <p className="text-2xl font-semibold text-foreground">
            {seatUsage.active.toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground">
            / {seatUsage.quota.toLocaleString()}
          </p>
        </div>
        <Progress
          value={percentage}
          className={cn("h-2", isNearCapacity && "[&>div]:bg-secondary")}
        />
        <p className="text-xs text-muted-foreground">{percentage}% capacity used</p>
      </CardContent>
    </Card>
  );
}

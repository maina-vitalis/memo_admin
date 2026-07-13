import {
  Building2Icon,
  UsersIcon,
  GaugeIcon,
  CalendarClockIcon,
  type LucideIcon,
} from "lucide-react";
import type { AnalyticsSummary } from "@/features/super-admin/analytics/types/analytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type KpiTile = {
  id: string;
  label: string;
  value: string;
  hint: string;
  icon: LucideIcon;
  accent?: "default" | "warning";
};

function AnalyticsKpiCard({ tile }: { tile: KpiTile }) {
  const Icon = tile.icon;

  return (
    <Card size="sm" className="shadow-sm">
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {tile.label}
        </CardTitle>
        <Icon
          className={cn(
            "size-4 text-muted-foreground",
            tile.accent === "warning" && "text-secondary",
          )}
        />
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold text-foreground">{tile.value}</p>
        <p className="mt-1 text-xs text-muted-foreground">{tile.hint}</p>
      </CardContent>
    </Card>
  );
}

export function AnalyticsKpiGrid({ summary }: { summary: AnalyticsSummary }) {
  const tiles: KpiTile[] = [
    {
      id: "institutions",
      label: "Total Institutions",
      value: summary.totalInstitutions.toLocaleString(),
      hint: `${summary.activeInstitutions.toLocaleString()} active on the platform`,
      icon: Building2Icon,
    },
    {
      id: "users",
      label: "Active Users",
      value: summary.totalUsersActive.toLocaleString(),
      hint: "Provisioned across all institutions",
      icon: UsersIcon,
    },
    {
      id: "utilization",
      label: "Avg Seat Utilization",
      value: `${summary.avgUtilization}%`,
      hint: `${summary.totalSeatsActive.toLocaleString()} of ${summary.totalSeatQuota.toLocaleString()} seats filled`,
      icon: GaugeIcon,
    },
    {
      id: "expiring",
      label: "Expiring Soon",
      value: summary.expiringSoonCount.toLocaleString(),
      hint:
        summary.expiredCount > 0
          ? `${summary.expiredCount.toLocaleString()} already expired`
          : "Subscriptions ending within 14 days",
      icon: CalendarClockIcon,
      accent: summary.expiringSoonCount + summary.expiredCount > 0 ? "warning" : "default",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {tiles.map((tile) => (
        <AnalyticsKpiCard key={tile.id} tile={tile} />
      ))}
    </div>
  );
}

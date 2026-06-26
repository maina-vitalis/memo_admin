import type { DashboardKpi } from "@/features/tenant-admin/dashboard/types/dashboard";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type DashboardKpiCardProps = {
  kpi: DashboardKpi;
};

export function DashboardKpiCard({ kpi }: DashboardKpiCardProps) {
  return (
    <Card size="sm" className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {kpi.label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold text-foreground">{kpi.value}</p>
        <p className="mt-1 text-xs text-muted-foreground">{kpi.hint}</p>
      </CardContent>
    </Card>
  );
}

type DashboardKpiGridProps = {
  kpis: DashboardKpi[];
};

export function DashboardKpiGrid({ kpis }: DashboardKpiGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {kpis.map((kpi) => (
        <DashboardKpiCard key={kpi.id} kpi={kpi} />
      ))}
    </div>
  );
}

"use client";

import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis, Cell } from "recharts";
import type { StatusBreakdownItem } from "@/features/super-admin/analytics/types/analytics";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const STATUS_COLORS: Record<StatusBreakdownItem["status"], string> = {
  active: "#16a34a",
  trial: "#3b82f6",
  pending: "#d97706",
  suspended: "#ef4444",
};

const chartConfig = {
  count: { label: "Institutions" },
  active: { label: "Active", color: STATUS_COLORS.active },
  trial: { label: "Trial", color: STATUS_COLORS.trial },
  pending: { label: "Pending", color: STATUS_COLORS.pending },
  suspended: { label: "Suspended", color: STATUS_COLORS.suspended },
} satisfies ChartConfig;

export function StatusBreakdownChart({
  data,
}: {
  data: StatusBreakdownItem[];
}) {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Institutions by status</CardTitle>
        <CardDescription>How the tenant base breaks down right now</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-auto h-56 w-full">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ left: 8, right: 24 }}
            barCategoryGap="24%"
          >
            <CartesianGrid horizontal={false} />
            <XAxis type="number" allowDecimals={false} hide />
            <YAxis
              type="category"
              dataKey="label"
              tickLine={false}
              axisLine={false}
              width={80}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent nameKey="label" hideLabel />}
            />
            <Bar dataKey="count" radius={[0, 4, 4, 0]} maxBarSize={24}>
              {data.map((entry) => (
                <Cell key={entry.status} fill={STATUS_COLORS[entry.status]} />
              ))}
              <LabelList
                dataKey="count"
                position="right"
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

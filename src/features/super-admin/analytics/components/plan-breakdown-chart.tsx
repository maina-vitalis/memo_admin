"use client";

import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";
import type { PlanBreakdownItem } from "@/features/super-admin/analytics/types/analytics";
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

const chartConfig = {
  count: {
    label: "Institutions",
    theme: { light: "rgb(35 70 152)", dark: "rgb(96 130 210)" },
  },
} satisfies ChartConfig;

export function PlanBreakdownChart({ data }: { data: PlanBreakdownItem[] }) {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Institutions by plan</CardTitle>
        <CardDescription>Subscription tier distribution</CardDescription>
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
              width={60}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent nameKey="label" hideLabel />}
            />
            <Bar
              dataKey="count"
              fill="var(--color-count)"
              radius={[0, 4, 4, 0]}
              maxBarSize={24}
            >
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

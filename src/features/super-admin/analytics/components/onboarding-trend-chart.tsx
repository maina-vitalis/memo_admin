"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import type { OnboardingTrendPoint } from "@/features/super-admin/analytics/types/analytics";
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
    label: "Institutions onboarded",
    theme: { light: "rgb(35 70 152)", dark: "rgb(96 130 210)" },
  },
} satisfies ChartConfig;

export function OnboardingTrendChart({
  data,
}: {
  data: OnboardingTrendPoint[];
}) {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Institutions onboarded</CardTitle>
        <CardDescription>New tenants provisioned over the last 6 months</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-auto h-56 w-full">
          <AreaChart data={data} margin={{ left: 8, right: 8 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value: string) => value.split(" ")[0]}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={28}
              allowDecimals={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent nameKey="count" />}
            />
            <Area
              dataKey="count"
              type="monotone"
              stroke="var(--color-count)"
              strokeWidth={2}
              fill="var(--color-count)"
              fillOpacity={0.1}
              dot={{ r: 4, fill: "var(--color-count)", strokeWidth: 0 }}
              activeDot={{ r: 4, fill: "var(--color-count)", strokeWidth: 0 }}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

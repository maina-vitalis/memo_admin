"use client";

import { Bar, BarChart, CartesianGrid, Cell, LabelList, XAxis, YAxis } from "recharts";
import type { SeatUtilizationItem } from "@/features/super-admin/analytics/types/analytics";
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

const NORMAL_COLOR = { light: "rgb(35 70 152)", dark: "rgb(96 130 210)" };
const WARNING_COLOR = "#d97706";
const DANGER_COLOR = "#ef4444";

function severityColor(utilization: number): string {
  if (utilization >= 90) return DANGER_COLOR;
  if (utilization >= 75) return WARNING_COLOR;
  return "var(--color-utilization)";
}

const chartConfig = {
  utilization: {
    label: "Seat utilization",
    theme: NORMAL_COLOR,
  },
} satisfies ChartConfig;

export function SeatUtilizationChart({
  data,
}: {
  data: SeatUtilizationItem[];
}) {
  const empty = data.length === 0;

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Seat utilization by institution</CardTitle>
        <CardDescription>
          Active seats as a share of each institution&apos;s quota
        </CardDescription>
      </CardHeader>
      <CardContent>
        {empty ? (
          <p className="flex h-56 items-center justify-center text-sm text-muted-foreground">
            No institutions to compare yet.
          </p>
        ) : (
          <ChartContainer config={chartConfig} className="aspect-auto h-56 w-full">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ left: 8, right: 32 }}
              barCategoryGap="20%"
            >
              <CartesianGrid horizontal={false} />
              <XAxis type="number" domain={[0, 100]} hide />
              <YAxis
                type="category"
                dataKey="shortcode"
                tickLine={false}
                axisLine={false}
                width={64}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    nameKey="name"
                    hideLabel
                    formatter={(value, _name, item) => (
                      <div className="flex w-full items-center justify-between gap-4">
                        <span className="text-muted-foreground">
                          {item.payload.name}
                        </span>
                        <span className="font-mono font-medium text-foreground tabular-nums">
                          {value}%
                        </span>
                      </div>
                    )}
                  />
                }
              />
              <Bar dataKey="utilization" radius={[0, 4, 4, 0]} maxBarSize={20}>
                {data.map((entry) => (
                  <Cell key={entry.id} fill={severityColor(entry.utilization)} />
                ))}
                <LabelList
                  dataKey="utilization"
                  position="right"
                  className="fill-foreground"
                  fontSize={12}
                  formatter={(value) => `${value ?? 0}%`}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}

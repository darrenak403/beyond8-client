"use client";

import * as React from "react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { useIsMobile } from "@/hooks/useMobile";

const chartData = [
  { date: "2024-04-01", revenue: 222000, students: 150 },
  { date: "2024-04-05", revenue: 373000, students: 290 },
  { date: "2024-04-10", revenue: 261000, students: 190 },
  { date: "2024-04-15", revenue: 120000, students: 170 },
  { date: "2024-04-20", revenue: 89000, students: 150 },
  { date: "2024-04-25", revenue: 215000, students: 250 },
  { date: "2024-04-30", revenue: 454000, students: 380 },
];

const chartConfig = {
  views: {
    label: "Lượt xem",
  },
  revenue: {
    label: "Doanh thu",
    color: "#ad1c9a", // Brand Magenta
  },
  students: {
    label: "Học sinh",
    color: "#67178d", // Brand Purple
  },
} satisfies ChartConfig;

export function ChartLineInteractive() {
  const isMobile = useIsMobile();
  const [activeChart, setActiveChart] = React.useState<"revenue" | "students">("revenue");

  const total = React.useMemo(
    () => ({
      revenue: chartData.reduce((acc, curr) => acc + curr.revenue, 0),
      students: chartData.reduce((acc, curr) => acc + curr.students, 0),
    }),
    []
  );

  return (
    <Card className="py-0 border-2 shadow-sm">
      <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-4 py-3 sm:px-6">
          <CardTitle className="text-base">Doanh thu & Học sinh</CardTitle>
          <CardDescription className="text-xs">7 ngày gần nhất</CardDescription>
        </div>
        <div className="flex">
          {(["revenue", "students"] as const).map((key) => {
            const chart = key;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="data-[active=true]:bg-muted/50 flex flex-1 flex-col justify-center gap-1 border-t px-4 py-3 text-left even:border-l sm:border-t-0 sm:border-l sm:px-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-muted-foreground text-xs">
                  {chartConfig[chart].label}
                </span>
                <span className={`${isMobile ? 'text-base' : 'text-xl'} leading-none font-bold`}>
                  {chart === "revenue"
                    ? `${(total[chart] / 1000000).toFixed(1)}M`
                    : total[chart].toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 py-3 sm:p-4">
        <ChartContainer config={chartConfig} className="aspect-auto h-[160px] w-full">
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              className="text-xs"
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("vi-VN", {
                  day: "numeric",
                  month: "numeric",
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("vi-VN", {
                      day: "numeric",
                      month: "numeric",
                      year: "numeric",
                    });
                  }}
                />
              }
            />
            <Line
              dataKey={activeChart}
              type="monotone"
              stroke={`var(--color-${activeChart})`}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

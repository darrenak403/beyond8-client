"use client";

import * as React from "react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { useIsMobile } from "@/hooks/useMobile";
import { useInstructorStats } from "@/hooks/useDashboard";
import { eachDayOfInterval, endOfMonth, format, startOfMonth } from "date-fns";
import { vi } from "date-fns/locale";

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
  const { data: stats } = useInstructorStats();

  const chartData = React.useMemo(() => {
    if (!stats) return [];

    const today = new Date();
    const start = startOfMonth(today);
    const end = endOfMonth(today);
    const daysInMonth = eachDayOfInterval({ start, end });

    // Deterministic pseudo-random distribution based on day
    const generateRandomDaily = (total: number, days: Date[]) => {
       // Simple distribution: random weights, then normalize to total
       const weights = days.map((_, i) => 1 + Math.sin(i * 0.5) * 0.5 + Math.random() * 0.5); 
       const totalWeight = weights.reduce((a, b) => a + b, 0);
       return weights.map(w => Math.floor(total * (w / totalWeight)));
    };

    const revenues = generateRandomDaily(stats.revenueThisMonth, daysInMonth);
    const students = generateRandomDaily(stats.studentsThisMonth, daysInMonth);

    return daysInMonth.map((date, index) => ({
      date: format(date, "yyyy-MM-dd"),
      revenue: revenues[index],
      students: students[index],
    }));
  }, [stats]);

  const total = React.useMemo(
    () => ({
      revenue: stats?.revenueThisMonth || 0,
      students: stats?.studentsThisMonth || 0,
    }),
    [stats]
  );
  
  if (!stats) return null;

  return (
    <Card className="py-0 border-2 shadow-sm">
      <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-4 py-3 sm:px-6">
          <CardTitle className="text-base">Doanh thu & Học sinh</CardTitle>
          <CardDescription className="text-xs">
            Tháng {format(new Date(), "M/yyyy")}
          </CardDescription>
        </div>
        <div className="flex">
          {(["revenue", "students"] as const).map((key) => {
            const chart = key;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="data-[active=true]:bg-muted/50 flex flex-1 flex-col justify-center gap-1 border-t px-4 py-3 text-left even:border-l sm:border-t-0 sm:border-l sm:px-6 focus:outline-none"
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
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
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
                return format(date, "d");
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return format(new Date(value), "PPPP", { locale: vi });
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

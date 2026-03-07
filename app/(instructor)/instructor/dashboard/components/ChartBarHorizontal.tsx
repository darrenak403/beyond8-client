"use client";

import { Bar, BarChart, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { useInstructorStats } from "@/hooks/useDashboard";
import { addMonths, format } from "date-fns";
import { useMemo } from "react";

const chartConfig = {
  students: {
    label: "Học sinh",
    color: "hsl(142.1 76.2% 36.3%)", // Green (fallback)
  },
} satisfies ChartConfig;

export function ChartBarHorizontal() {
  const { data: stats } = useInstructorStats();

  const chartData = useMemo(() => {
    if (!stats) return [];

    const today = new Date();
    const data = [];

    for (let i = 0; i < 6; i++) {
      const date = addMonths(today, i);
      const isCurrentMonth = i === 0;
      const count = isCurrentMonth ? (stats.studentsThisMonth || 0) : 0; 
      data.push({
        month: `T${format(date, "M")}`, // T1, T2, ...
        students: count,
        fill: i % 2 === 0 ? "#ad1c9a" : "#67178d", 
      });
    }

    return data;
  }, [stats]);

  if (!stats) return null;

  return (
    <Card className="border-2 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Học sinh theo tháng</CardTitle>
        <CardDescription className="text-xs">6 tháng gần nhất</CardDescription>
      </CardHeader>
      <CardContent className="pb-3">
        <ChartContainer config={chartConfig} className="h-[180px] w-full">
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{ left: -20 }}
          >
            <XAxis type="number" dataKey="students" hide />
            <YAxis
              dataKey="month"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              className="text-xs"
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="students" radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

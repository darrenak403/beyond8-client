"use client";

import { Bar, BarChart, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";

const chartData = [
  { month: "T1", students: 186, fill: "#f4449b" }, // Brand Pink
  { month: "T2", students: 305, fill: "#ad1c9a" }, // Brand Magenta
  { month: "T3", students: 237, fill: "#67178d" }, // Brand Purple
  { month: "T4", students: 73, fill: "#f4449b" }, // Brand Pink
  { month: "T5", students: 209, fill: "#ad1c9a" }, // Brand Magenta
  { month: "T6", students: 214, fill: "#67178d" }, // Brand Purple
];

const chartConfig = {
  students: {
    label: "Học sinh",
    color: "hsl(142.1 76.2% 36.3%)", // Green (fallback)
  },
} satisfies ChartConfig;

export function ChartBarHorizontal() {
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

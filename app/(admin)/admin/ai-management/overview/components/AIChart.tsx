'use client';

import { useAIUsageStatistics } from '@/hooks/useAI';
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"

export const description = "A bar chart"

const chartConfig = {
  desktop: {
    label: "Tokens Đầu vào",
    color: "var(--primary)", 
  },
  mobile: {
    label: "Tokens Đầu ra",
    color: "var(--brand-pink)",
  },
} satisfies ChartConfig

export function AIChart() {
  const { data: statsData, isLoading } = useAIUsageStatistics();
  const stats = statsData?.data;

  const chartData = [
    { 
        month: "Tổng quan", 
        desktop: stats?.totalInputTokens || 0, 
        mobile: stats?.totalOutputTokens || 0 
    },
  ];

  return (
    <Card className="col-span-4 shadow-sm border-gray-100 h-full">
      <CardHeader>
        <CardTitle>Phân bổ Tokens</CardTitle>
        <CardDescription>So sánh tổng lượng tokens đầu vào và đầu ra</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
            <Skeleton className="h-[250px] w-full rounded-xl" />
        ) : (
            <ChartContainer config={chartConfig}>
            <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dashed" />}
                />
                <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
                <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
            </BarChart>
            </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}

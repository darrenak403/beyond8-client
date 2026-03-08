"use client";

import { RadialBar, RadialBarChart } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { InstructorAnalytics } from "@/lib/api/services/fetchAnalystic";

interface ChartRadialSimpleProps {
  stats: InstructorAnalytics | undefined;
}

export function ChartRadialSimple({ stats }: ChartRadialSimpleProps) {
  if (!stats) return null;

  const chartData = [
    { status: "Đã xuất bản", count: stats.courses.published, fill: "#22c55e" }, // Green
    { status: "Đã duyệt", count: stats.courses.approved, fill: "#3b82f6" }, // Blue
    { status: "Chờ duyệt", count: stats.courses.pendingApproval, fill: "#eab308" }, // Yellow
    { status: "Bản nháp", count: stats.courses.draft, fill: "#a855f7" }, // Purple
    { status: "Từ chối", count: stats.courses.rejected, fill: "#ef4444" }, // Red
  ];

  const chartConfig = {
    count: {
      label: "Số lượng",
    },
    published: {
      label: "Đã xuất bản",
      color: "#22c55e",
    },
    approved: {
      label: "Đã duyệt",
      color: "#3b82f6",
    },
    pending: {
      label: "Chờ duyệt",
      color: "#eab308",
    },
    draft: {
      label: "Bản nháp",
      color: "#a855f7",
    },
    rejected: {
      label: "Từ chối",
      color: "#ef4444",
    },
  } satisfies ChartConfig;

  return (
    <Card className="flex flex-col border-2 shadow-sm h-full min-h-[200px]">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Trạng thái khóa học</CardTitle>
        <CardDescription className="text-xs">Phân bố theo trạng thái</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-3 flex flex-col justify-center">
        <div className="flex items-center justify-between h-full w-full lg:px-12">
          {/* Chart on the left */}
          <div className="shrink-0 flex items-center justify-center h-full">
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square h-[300px] w-[300px]"
            >
              <RadialBarChart
                data={chartData}
                innerRadius={60}
                outerRadius={140}
                startAngle={90}
                endAngle={-270}
              >
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel nameKey="status" />}
                />
                <RadialBar dataKey="count" background />
              </RadialBarChart>
            </ChartContainer>
          </div>

          {/* Legend/Content on the right */}
          <div className="flex-1 space-y-3 max-w-[200px]">
            {chartData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: item.fill }} />
                  <span className="text-sm font-medium">{item.status}</span>
                </div>
                <span className="text-sm font-semibold">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

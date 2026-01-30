"use client";

import { RadialBar, RadialBarChart } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { InstructorStats } from "@/lib/api/services/fetchDashboard";

interface ChartRadialSimpleProps {
  stats: InstructorStats | undefined;
}

export function ChartRadialSimple({ stats }: ChartRadialSimpleProps) {
  if (!stats) return null;

  const chartData = [
    { status: "Đã xuất bản", count: stats.publishedCourses, fill: "#22c55e" }, // Green
    { status: "Chờ duyệt", count: stats.pendingApprovalCourses, fill: "#eab308" }, // Yellow
    { status: "Bản nháp", count: stats.draftCourses, fill: "#a855f7" }, // Purple
    { status: "Từ chối", count: stats.rejectedCourses, fill: "#ef4444" }, // Red
  ];

  const chartConfig = {
    count: {
      label: "Số lượng",
    },
    published: {
      label: "Đã xuất bản",
      color: "#22c55e",
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
    <Card className="flex flex-col border-2 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Trạng thái khóa học</CardTitle>
        <CardDescription className="text-xs">Phân bố theo trạng thái</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-3">
        <div className="flex items-center gap-4">
          {/* Chart on the left */}
          <div className="flex-shrink-0">
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square h-[180px] w-[180px]"
            >
              <RadialBarChart data={chartData} innerRadius={30} outerRadius={90} startAngle={90} endAngle={-270}>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel nameKey="status" />}
                />
                <RadialBar dataKey="count" background />
              </RadialBarChart>
            </ChartContainer>
          </div>

          {/* Legend/Content on the right */}
          <div className="flex-1 space-y-2">
            {chartData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-sm"
                    style={{ backgroundColor: item.fill }}
                  />
                  <span className="text-sm font-medium">{item.status}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

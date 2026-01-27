"use client";

import { RadialBar, RadialBarChart } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";

const chartData = [
  { course: "React", completion: 275, fill: "#ad1c9a" }, // Brand Magenta
  { course: "Node.js", completion: 200, fill: "#67178d" }, // Brand Purple
  { course: "Python", completion: 187, fill: "#f4449b" }, // Brand Pink
  { course: "Java", completion: 173, fill: "#ad1c9a" }, // Brand Magenta
  { course: "C++", completion: 90, fill: "#67178d" }, // Brand Purple
];

const chartConfig = {
  completion: {
    label: "Hoàn thành",
  },
  react: {
    label: "React",
    color: "#ad1c9a", // Brand Magenta
  },
  nodejs: {
    label: "Node.js",
    color: "#67178d", // Brand Purple
  },
  python: {
    label: "Python",
    color: "#f4449b", // Brand Pink
  },
  java: {
    label: "Java",
    color: "#ad1c9a", // Brand Magenta
  },
  cpp: {
    label: "C++",
    color: "#67178d", // Brand Purple
  },
} satisfies ChartConfig;

export function ChartRadialSimple() {
  return (
    <Card className="flex flex-col border-2 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Tỷ lệ hoàn thành</CardTitle>
        <CardDescription className="text-xs">Theo khóa học</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-3">
        <div className="flex items-center gap-4">
          {/* Chart on the left */}
          <div className="flex-shrink-0">
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square h-[180px] w-[180px]"
            >
              <RadialBarChart data={chartData} innerRadius={25} outerRadius={85}>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel nameKey="course" />}
                />
                <RadialBar dataKey="completion" background />
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
                  <span className="text-sm font-medium">{item.course}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {item.completion}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

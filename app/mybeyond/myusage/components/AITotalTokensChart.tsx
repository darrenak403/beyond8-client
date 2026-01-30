"use client"

import { TrendingUp } from "lucide-react"
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  type ChartConfig,
} from "@/components/ui/chart"
import { AIUsageRecord } from "@/lib/api/services/fetchAI"
import { useMemo } from "react"

interface AITotalTokensChartProps {
    data: AIUsageRecord[];
}

export function AITotalTokensChart({ data }: AITotalTokensChartProps) {
    const totalTokens = useMemo(() => {
        return data.reduce((acc, curr) => acc + curr.totalTokens, 0);
    }, [data]);

    const chartData = [
        { name: "total", tokens: totalTokens, fill: "#67178d" },
    ];

    const chartConfig = {
        tokens: {
            label: "Tokens",
        },
        total: {
            label: "Tổng Tokens",
            color: "#67178d", // Brand Purple
        },
    } satisfies ChartConfig;

    return (
        <Card className="border-none shadow-none bg-transparent h-full w-full flex flex-col">
            <CardHeader className="items-center pb-0 px-0 pt-0 space-y-0">
                <CardTitle className="text-xl font-bold text-gray-900 leading-tight">Tổng quan sử dụng</CardTitle>
                <CardDescription className="text-sm text-gray-500 text-center leading-tight">Tokens đã tiêu thụ</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0 px-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[300px]"
                >
                    <RadialBarChart
                        data={chartData}
                        endAngle={100}
                        innerRadius={70}
                        outerRadius={110}
                    >
                        <PolarGrid
                            gridType="circle"
                            radialLines={false}
                            stroke="none"
                            className="first:fill-muted last:fill-background"
                            polarRadius={[80, 64]}
                        />
                        <RadialBar dataKey="tokens" background cornerRadius={10} />
                        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="fill-foreground text-4xl font-black"
                                                >
                                                    {totalTokens.toLocaleString()}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground text-xs uppercase tracking-widest font-bold"
                                                >
                                                    Tokens
                                                </tspan>
                                            </text>
                                        )
                                    }
                                }}
                            />
                        </PolarRadiusAxis>
                    </RadialBarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-1 text-sm px-0 pb-0 mt-auto items-center">
                <div className="flex items-center gap-2 leading-none font-medium text-[#67178d]">
                    Hiệu suất ổn định <TrendingUp className="h-4 w-4" />
                </div>
            </CardFooter>
        </Card>
    )
}

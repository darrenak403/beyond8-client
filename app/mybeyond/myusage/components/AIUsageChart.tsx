"use client"

import { TrendingUp } from "lucide-react"
import { RadialBar, RadialBarChart } from "recharts"

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
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { AIUsageRecord } from "@/lib/api/services/fetchAI"
import { useMemo } from "react"

interface AIUsageChartProps {
    data: AIUsageRecord[];
}

export function AIUsageChart({ data }: AIUsageChartProps) {
    const stats = useMemo(() => {
        return data.reduce((acc, curr) => ({
            input: acc.input + curr.inputTokens,
            output: acc.output + curr.outputTokens,
        }), { input: 0, output: 0 });
    }, [data]);

    const chartData = useMemo(() => [
        { 
            name: "Input", 
            tokens: stats.input, 
            fill: "#f4449b" // Brand Pink
        },
        { 
            name: "Output", 
            tokens: stats.output, 
            fill: "#ad1c9a" // Brand Magenta
        },
    ], [stats]);

    const chartConfig = {
        tokens: {
            label: "Tokens",
        },
        input: {
            label: "Input Tokens",
            color: "#f4449b", // Brand Pink
        },
        output: {
            label: "Output Tokens",
            color: "#ad1c9a", // Brand Magenta
        },
    } satisfies ChartConfig;

    return (
        <Card className="border-none shadow-none bg-transparent h-full w-full flex flex-col">
            <CardHeader className="items-center pb-0 px-0 pt-0 space-y-0">
                <CardTitle className="text-xl font-bold text-gray-900 leading-tight">Thống kê Tokens</CardTitle>
                <CardDescription className="text-sm text-gray-500 text-center leading-tight">So sánh Input & Output</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0 px-0 flex items-center justify-center min-h-[250px]">
                {data.length > 0 ? (
                    <ChartContainer
                        config={chartConfig}
                        className="mx-auto aspect-square w-full max-h-[300px]"
                    >
                        <RadialBarChart 
                            data={chartData} 
                            innerRadius={40} 
                            outerRadius={100}
                            startAngle={180}
                            endAngle={0}
                        >
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent hideLabel nameKey="name" />}
                            />
                            <RadialBar dataKey="tokens" background cornerRadius={8} />
                        </RadialBarChart>
                    </ChartContainer>
                ) : (
                    <div className="flex flex-col items-center justify-center text-gray-400 gap-2 py-8">
                        <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center">
                             <TrendingUp className="w-6 h-6 opacity-20" />
                        </div>
                        <p className="text-sm">Chưa có dữ liệu</p>
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm px-0 pb-0 mt-auto">
                <div className="flex items-center gap-4 leading-none font-medium">
                    <div className="flex items-center gap-2 mr-4">
                        <div className="w-2 h-2 rounded-full bg-[#f4449b]" />
                        <span className="text-gray-600">In: <span className="text-[#f4449b] font-bold">{stats.input.toLocaleString()}</span></span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#ad1c9a]" />
                        <span className="text-gray-600">Out: <span className="text-[#ad1c9a] font-bold">{stats.output.toLocaleString()}</span></span>
                    </div>
                </div>
            </CardFooter>
        </Card>
    )
}

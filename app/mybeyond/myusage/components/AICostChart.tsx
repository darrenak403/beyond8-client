"use client";

import { LabelList, RadialBar, RadialBarChart } from "recharts";
import { useMemo } from "react";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart";
import type { AIUsageRecord } from "@/hooks/useAI";

interface AICostChartProps {
    data: AIUsageRecord[];
}

export function AICostChart({ data }: AICostChartProps) {
    const costStats = useMemo(() => {
        return data.reduce(
            (acc, curr) => ({
                input: acc.input + (curr.inputCost || 0),
                output: acc.output + (curr.outputCost || 0),
                total: acc.total + (curr.totalCost || 0),
            }),
            { input: 0, output: 0, total: 0 }
        );
    }, [data]);

    const chartData = useMemo(() => [
        { 
            category: "Input", 
            cost: costStats.input, 
            fill: "#f4449b" // Brand Pink
        },
        { 
            category: "Output", 
            cost: costStats.output, 
            fill: "#ad1c9a" // Brand Magenta
        },
        { 
            category: "Total", 
            cost: costStats.total, 
            fill: "#67178d" // Brand Purple
        },
    ], [costStats]);

    const chartConfig = {
        cost: {
            label: "Chi phí",
        },
        Input: {
            label: "Input Cost",
            color: "#f4449b",
        },
        Output: {
            label: "Output Cost",
            color: "#ad1c9a",
        },
        Total: {
            label: "Total Cost",
            color: "#67178d",
        },
    } satisfies ChartConfig;

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
            minimumFractionDigits: 0,
        }).format(value);
    };

    return (
        <Card className="border-none shadow-none bg-transparent h-full w-full flex flex-col">
            <CardHeader className="items-center pb-0 px-0 pt-0 space-y-0">
                <CardTitle className="text-xl font-bold text-gray-900 leading-tight">Thống kê Chi phí</CardTitle>
                <CardDescription className="text-sm text-gray-500 text-center leading-tight">Chi phí Input, Output & Tổng cộng</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0 px-0 flex items-center justify-center min-h-[250px]">
                {data.length > 0 ? (
                    <ChartContainer
                        config={chartConfig}
                        className="mx-auto aspect-square w-full max-h-[300px]"
                    >
                        <RadialBarChart
                            data={chartData}
                            startAngle={-90}
                            endAngle={380}
                            innerRadius={40}
                            outerRadius={100}
                        >
                            <ChartTooltip
                                cursor={false}
                                content={
                                    <ChartTooltipContent 
                                        hideLabel 
                                        nameKey="category"
                                        formatter={(value: string | number | (string | number)[]) => {
                                            const val = Array.isArray(value) ? value[0] : value;
                                            return formatCurrency(Number(val));
                                        }}
                                    />
                                }
                            />
                            <RadialBar dataKey="cost" background cornerRadius={8}>
                                <LabelList
                                    position="insideStart"
                                    dataKey="category"
                                    className="fill-white font-black text-[10px] uppercase"
                                    offset={12}
                                />
                            </RadialBar>
                        </RadialBarChart>
                    </ChartContainer>
                ) : (
                    <div className="flex flex-col items-center justify-center text-gray-400 gap-2 py-8">
                        <p className="text-sm">Chưa có dữ liệu chi phí</p>
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm px-0 pb-0 mt-auto items-center">
                <div className="flex items-center gap-2 leading-none font-medium text-[#67178d]">
                    Tổng chi phí: <span className="font-bold text-lg">{formatCurrency(costStats.total)}</span>
                </div>
            </CardFooter>
        </Card>
    );
}

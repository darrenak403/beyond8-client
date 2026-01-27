'use client';

import * as React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { useIsMobile } from '@/hooks/useMobile';

const chartData = [
  { date: '2024-01', revenue: 45000000, profit: 32000000 },
  { date: '2024-02', revenue: 52000000, profit: 38000000 },
  { date: '2024-03', revenue: 48000000, profit: 35000000 },
  { date: '2024-04', revenue: 61000000, profit: 45000000 },
  { date: '2024-05', revenue: 73000000, profit: 54000000 },
  { date: '2024-06', revenue: 68000000, profit: 50000000 },
  { date: '2024-07', revenue: 82000000, profit: 62000000 },
  { date: '2024-08', revenue: 76000000, profit: 58000000 },
  { date: '2024-09', revenue: 91000000, profit: 70000000 },
  { date: '2024-10', revenue: 88000000, profit: 68000000 },
  { date: '2024-11', revenue: 95000000, profit: 74000000 },
  { date: '2024-12', revenue: 102000000, profit: 80000000 },
];

const chartConfig = {
  revenue: {
    label: 'Doanh thu',
    color: '#ad1c9a',
  },
  profit: {
    label: 'Lợi nhuận',
    color: '#67178d',
  },
} satisfies ChartConfig;

export function RevenueChart() {
  const isMobile = useIsMobile();
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>('revenue');

  const total = React.useMemo(
    () => ({
      revenue: chartData.reduce((acc, curr) => acc + curr.revenue, 0),
      profit: chartData.reduce((acc, curr) => acc + curr.profit, 0),
    }),
    []
  );

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch border-b p-0 sm:flex-row">
        <div className={`flex flex-1 flex-col justify-center gap-1 ${isMobile ? 'px-3 py-3' : 'px-4 py-4'}`}>
          <CardTitle className={isMobile ? 'text-sm' : 'text-base'}>Phân tích doanh thu</CardTitle>
          <CardDescription className={isMobile ? 'text-xs' : 'text-xs'}>
            {isMobile ? '12 tháng qua' : 'Hiển thị doanh thu và lợi nhuận trong 12 tháng qua'}
          </CardDescription>
        </div>
        <div className="flex">
          {(['revenue', 'profit'] as const).map((key) => {
            const chart = key as keyof typeof chartConfig;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className={`data-[active=true]:bg-muted/50 relative z-30 flex flex-1 flex-col justify-center gap-1 border-t ${isMobile ? 'px-3 py-2' : 'px-4 py-3'} text-left even:border-l sm:border-l sm:border-t-0 cursor-pointer hover:bg-muted/30 transition-colors`}
                onClick={() => setActiveChart(chart)}
              >
                <span className={`${isMobile ? 'text-xs' : 'text-xs'} text-muted-foreground`}>
                  {chartConfig[chart].label}
                </span>
                <span className={`${isMobile ? 'text-sm' : 'text-lg'} font-bold leading-none`}>
                  ₫{(total[key] / 1000000).toFixed(1)}M
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className={isMobile ? 'px-1 py-2' : 'px-2 sm:p-6'}>
        <ChartContainer
          config={chartConfig}
          className={`aspect-auto ${isMobile ? 'h-[150px]' : 'h-[200px]'} w-full`}
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value: string) => {
                const date = new Date(value);
                return date.toLocaleDateString('vi-VN', {
                  month: 'short',
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[180px]"
                  nameKey="views"
                  labelFormatter={(value: string) => {
                    return new Date(value).toLocaleDateString('vi-VN', {
                      month: 'long',
                      year: 'numeric',
                    });
                  }}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  formatter={(value: any) => `₫${Number(value).toLocaleString('vi-VN')}`}
                />
              }
            />
            <Bar dataKey={activeChart} fill={`var(--color-${String(activeChart)})`} radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

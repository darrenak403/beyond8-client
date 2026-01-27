'use client';

import { TrendingUp } from 'lucide-react';
import { Bar, BarChart, XAxis, YAxis } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
  { month: 'Tháng 1', escrow: 125000000, profit: 85000000, fill: 'var(--color-escrow)' },
  { month: 'Tháng 2', escrow: 98000000, profit: 72000000, fill: 'var(--color-profit)' },
  { month: 'Tháng 3', escrow: 142000000, profit: 95000000, fill: 'var(--color-escrow)' },
  { month: 'Tháng 4', escrow: 156000000, profit: 108000000, fill: 'var(--color-profit)' },
  { month: 'Tháng 5', escrow: 178000000, profit: 125000000, fill: 'var(--color-escrow)' },
  { month: 'Tháng 6', escrow: 165000000, profit: 118000000, fill: 'var(--color-profit)' },
];

const chartConfig = {
  escrow: {
    label: 'Escrow',
    color: '#f4449b',
  },
  profit: {
    label: 'Lợi nhuận ròng',
    color: '#ad1c9a',
  },
} satisfies ChartConfig;

export function CashflowChart() {
  const isMobile = useIsMobile();

  return (
    <Card>
      <CardHeader>
        <CardTitle className={isMobile ? 'text-sm' : 'text-base'}>Dòng tiền kí quỹ & Lợi nhuận ròng</CardTitle>
        <CardDescription className={isMobile ? 'text-xs' : 'text-xs'}>Tháng 1 - Tháng 6 2024</CardDescription>
      </CardHeader>
      <CardContent className={isMobile ? 'px-1 py-2' : ''}>
        <ChartContainer config={chartConfig} className={`${isMobile ? 'h-[150px]' : 'h-[200px]'} w-full`}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              left: 20,
            }}
          >
            <YAxis
              dataKey="month"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value: string) => value.slice(0, 7)}
            />
            <XAxis dataKey="escrow" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideLabel
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  formatter={(value: any) => `₫${Number(value).toLocaleString('vi-VN')}`}
                />
              }
            />
            <Bar dataKey="escrow" radius={5} />
            <Bar dataKey="profit" radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className={`flex-col items-start gap-1 ${isMobile ? 'text-xs pt-2' : 'text-xs pt-3'}`}>
        <div className="flex gap-2 font-medium leading-none">
          Tăng 15.2% {!isMobile && 'so với tháng trước'} <TrendingUp className={`${isMobile ? 'h-2.5 w-2.5' : 'h-3 w-3'}`} />
        </div>
        {!isMobile && (
          <div className="leading-none text-muted-foreground">
            Hiển thị dòng tiền và lợi nhuận trong 6 tháng qua
          </div>
        )}
      </CardFooter>
    </Card>
  );
}

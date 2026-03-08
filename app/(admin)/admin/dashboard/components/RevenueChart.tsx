'use client';

import * as React from 'react';
import { SlidersHorizontal } from 'lucide-react';
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useIsMobile } from '@/hooks/useMobile';
import { useSystemRevenueTrend, type GetSystemRevenueTrendParams, type RevenueTrendGroupBy } from '@/hooks/useAnalystic';

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
  const currentYear = React.useMemo(() => new Date().getFullYear(), []);
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [filterError, setFilterError] = React.useState('');
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>('revenue');
  const [draftFilters, setDraftFilters] = React.useState<GetSystemRevenueTrendParams>({
    GroupBy: 'Year',
    Year: currentYear,
  });
  const [appliedFilters, setAppliedFilters] = React.useState<GetSystemRevenueTrendParams>({
    GroupBy: 'Year',
    Year: currentYear,
  });

  const { data, isLoading, isError } = useSystemRevenueTrend(appliedFilters);

  const chartData = React.useMemo(
    () => (data?.dataPoints ?? []).map((item) => ({ label: item.label, revenue: item.revenue, profit: item.profit })),
    [data?.dataPoints]
  );

  const total = React.useMemo(() => ({ revenue: data?.totalRevenue ?? 0, profit: data?.totalProfit ?? 0 }), [data]);

  const handleGroupByChange = (value: RevenueTrendGroupBy) => {
    setFilterError('');
    setDraftFilters((prev) => {
      const next: GetSystemRevenueTrendParams = { GroupBy: value };
      if (value === 'Year') {
        next.Year = prev.Year ?? currentYear;
      }
      if (value === 'Quarter') {
        next.Year = prev.Year ?? currentYear;
        next.Quarter = prev.Quarter ?? 1;
      }
      return next;
    });
  };

  const applyFilters = () => {
    if (draftFilters.GroupBy === 'Quarter' && !draftFilters.Year) {
      setFilterError('Khi nhóm theo quý, bạn cần chọn năm.');
      return;
    }
    setFilterError('');
    setAppliedFilters({
      GroupBy: draftFilters.GroupBy,
      Year: draftFilters.Year ?? currentYear,
      Quarter: draftFilters.GroupBy === 'Quarter' ? (draftFilters.Quarter ?? 1) : undefined,
    });
    setIsFilterOpen(false);
  };

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch border-b p-0 sm:flex-row">
        <div className={`flex flex-1 flex-col justify-center gap-1 ${isMobile ? 'px-3 py-3' : 'px-4 py-4'}`}>
          <div className="flex items-center justify-between gap-2">
            <CardTitle className={isMobile ? 'text-sm' : 'text-base'}>Phân tích doanh thu</CardTitle>
            <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className={isMobile ? 'h-8 px-2' : 'h-8 px-3'}>
                  <SlidersHorizontal className="h-4 w-4" />
                  {!isMobile && 'Bộ lọc'}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-[300px]">
                <div className="space-y-3">
                  <p className="text-sm font-semibold">Bộ lọc doanh thu</p>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Nhóm theo</p>
                    <Select value={draftFilters.GroupBy} onValueChange={(value) => handleGroupByChange(value as RevenueTrendGroupBy)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn kiểu nhóm" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Year">Năm</SelectItem>
                        <SelectItem value="Quarter">Quý</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Năm</p>
                    <Input
                      type="number"
                      placeholder="VD: 2026"
                      value={draftFilters.Year ?? ''}
                      onChange={(e) => {
                        const next = e.target.value;
                        setDraftFilters((prev) => ({ ...prev, Year: next ? Number(next) : undefined }));
                        setFilterError('');
                      }}
                    />
                  </div>

                  {draftFilters.GroupBy === 'Quarter' && (
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Quý</p>
                      <Select
                        value={String(draftFilters.Quarter ?? 1)}
                        onValueChange={(value) => {
                          setDraftFilters((prev) => ({ ...prev, Quarter: Number(value) }));
                          setFilterError('');
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn quý" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Quý 1</SelectItem>
                          <SelectItem value="2">Quý 2</SelectItem>
                          <SelectItem value="3">Quý 3</SelectItem>
                          <SelectItem value="4">Quý 4</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {filterError && <p className="text-xs text-red-600">{filterError}</p>}

                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setDraftFilters({ GroupBy: 'Year', Year: currentYear });
                        setFilterError('');
                      }}
                    >
                      Đặt lại
                    </Button>
                    <Button onClick={applyFilters}>Áp dụng</Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <CardDescription className={isMobile ? 'text-xs' : 'text-xs'}>
            {data?.periodLabel ?? (isMobile ? 'Năm hiện tại' : 'Hiển thị doanh thu và lợi nhuận theo bộ lọc')}
          </CardDescription>
        </div>
        <div className="flex overflow-x-auto">
          {(['revenue', 'profit'] as const).map((key) => {
            const chart = key as keyof typeof chartConfig;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className={`data-[active=true]:bg-muted/50 relative z-30 flex min-w-[150px] flex-1 flex-col justify-center gap-1 border-t ${isMobile ? 'px-3 py-2' : 'px-4 py-3'} text-left even:border-l sm:min-w-[170px] sm:border-l sm:border-t-0 cursor-pointer hover:bg-muted/30 transition-colors`}
                onClick={() => setActiveChart(chart)}
              >
                <span className={`${isMobile ? 'text-xs' : 'text-xs'} whitespace-nowrap text-muted-foreground`}>
                  {chartConfig[chart].label}
                </span>
                <span className={`${isMobile ? 'text-sm' : 'text-lg'} font-bold leading-none`}>
                  {(total[key] / 1000000).toFixed(1)}M
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
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[180px]"
                  nameKey={activeChart}
                  labelFormatter={(value: string) => value}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  formatter={(value: any) => `₫${Number(value).toLocaleString('vi-VN')}`}
                />
              }
            />
            <Bar dataKey={activeChart} fill={`var(--color-${String(activeChart)})`} radius={4} />
          </BarChart>
        </ChartContainer>
        {isLoading && <p className="px-2 text-xs text-amber-600">Đang tải dữ liệu biểu đồ...</p>}
        {isError && <p className="px-2 text-xs text-red-600">Không tải được dữ liệu biểu đồ.</p>}
      </CardContent>
    </Card>
  );
}

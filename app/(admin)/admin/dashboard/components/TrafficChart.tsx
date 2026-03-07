'use client';

import * as React from 'react';
import { CalendarIcon } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useAIUsageChart } from '@/hooks/useAnalystic';
import { useIsMobile } from '@/hooks/useMobile';

const CLAUDE_SONET_COLOR = '#67178d';
const HANGFIRE_COLOR = '#f4449b';

const chartConfig = {
  visitors: {
    label: 'Lượt truy cập',
  },
  desktop: {
    label: 'claude-sonet',
    color: CLAUDE_SONET_COLOR,
  },
  mobile: {
    label: 'Hugging Face',
    color: HANGFIRE_COLOR,
  },
} satisfies ChartConfig;

const CLAUDE_MODEL = 'anthropic.claude-3-5-sonnet-20240620-v1:0';
const HANGFIRE_MODEL = 'sentence-transformers/all-MiniLM-L6-v2/pipeline/feature-extraction';

const formatDateToISO = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatDateDisplay = (date?: Date) => {
  if (!date) return '';
  return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  }).format(value);
};

const getMonthBoundaries = (date: Date) => {
  const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return { startOfMonth, endOfMonth };
};

export function TrafficChart() {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState('1');
  const [currentDate, setCurrentDate] = React.useState(() => new Date());

  const monthKey = React.useMemo(() => {
    return `${currentDate.getFullYear()}-${currentDate.getMonth()}`;
  }, [currentDate]);

  const [startDate, setStartDate] = React.useState<Date | undefined>(() => getMonthBoundaries(new Date()).startOfMonth);
  const [endDate, setEndDate] = React.useState<Date | undefined>(() => getMonthBoundaries(new Date()).endOfMonth);

  React.useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentDate(new Date());
    }, 60 * 60 * 1000);

    return () => window.clearInterval(timer);
  }, []);

  React.useEffect(() => {
    const { startOfMonth, endOfMonth } = getMonthBoundaries(currentDate);
    setStartDate(startOfMonth);
    setEndDate(endOfMonth);
  }, [monthKey, currentDate]);

  const { startOfMonth, endOfMonth } = React.useMemo(() => getMonthBoundaries(currentDate), [currentDate]);

  const normalizedStartDate = startDate ?? startOfMonth;
  const normalizedEndDate = endDate ?? endOfMonth;

  const chartParams = React.useMemo(() => {
    const start = normalizedStartDate <= normalizedEndDate ? normalizedStartDate : normalizedEndDate;
    const end = normalizedStartDate <= normalizedEndDate ? normalizedEndDate : normalizedStartDate;

    return {
      PeriodMonths: Number(timeRange),
      StartDate: formatDateToISO(start),
      EndDate: formatDateToISO(end),
    };
  }, [normalizedEndDate, normalizedStartDate, timeRange]);

  const { data } = useAIUsageChart(chartParams);

  const chartData = React.useMemo(() => {
    const usageByDate = new Map<
      string,
      {
        desktop: number;
        desktopTotalTokens: number;
        desktopUsageCount: number;
        desktopTotalCost: number;
        mobile: number;
        mobileTotalTokens: number;
        mobileUsageCount: number;
        mobileTotalCost: number;
      }
    >();

    for (const snapshot of data?.data ?? []) {
      const desktopTotalTokens = snapshot.models
        .filter((model) => model.model === CLAUDE_MODEL || model.model.includes('claude-3-5-sonnet'))
        .reduce((sum, model) => sum + model.totalTokens, 0);
      const desktop = snapshot.models
        .filter((model) => model.model === CLAUDE_MODEL || model.model.includes('claude-3-5-sonnet'))
        .reduce((sum, model) => sum + model.totalCost, 0);
      const desktopUsageCount = snapshot.models
        .filter((model) => model.model === CLAUDE_MODEL || model.model.includes('claude-3-5-sonnet'))
        .reduce((sum, model) => sum + model.usageCount, 0);
      const desktopTotalCost = snapshot.models
        .filter((model) => model.model === CLAUDE_MODEL || model.model.includes('claude-3-5-sonnet'))
        .reduce((sum, model) => sum + model.totalCost, 0);

      const mobileTotalTokens = snapshot.models
        .filter((model) => model.model === HANGFIRE_MODEL || model.model.includes('all-MiniLM-L6-v2/pipeline/feature-extraction'))
        .reduce((sum, model) => sum + model.totalTokens, 0);
      const mobile = snapshot.models
        .filter((model) => model.model === HANGFIRE_MODEL || model.model.includes('all-MiniLM-L6-v2/pipeline/feature-extraction'))
        .reduce((sum, model) => sum + model.totalCost, 0);
      const mobileUsageCount = snapshot.models
        .filter((model) => model.model === HANGFIRE_MODEL || model.model.includes('all-MiniLM-L6-v2/pipeline/feature-extraction'))
        .reduce((sum, model) => sum + model.usageCount, 0);
      const mobileTotalCost = snapshot.models
        .filter((model) => model.model === HANGFIRE_MODEL || model.model.includes('all-MiniLM-L6-v2/pipeline/feature-extraction'))
        .reduce((sum, model) => sum + model.totalCost, 0);

      usageByDate.set(snapshot.snapshotDate, {
        desktop,
        desktopTotalTokens,
        desktopUsageCount,
        desktopTotalCost,
        mobile,
        mobileTotalTokens,
        mobileUsageCount,
        mobileTotalCost,
      });
    }

    const dataPoints: {
      date: string;
      desktop: number;
      desktopTotalTokens: number;
      desktopUsageCount: number;
      desktopTotalCost: number;
      mobile: number;
      mobileTotalTokens: number;
      mobileUsageCount: number;
      mobileTotalCost: number;
    }[] = [];
    const rangeStart = normalizedStartDate <= normalizedEndDate ? normalizedStartDate : normalizedEndDate;
    const rangeEnd = normalizedStartDate <= normalizedEndDate ? normalizedEndDate : normalizedStartDate;

    for (let d = new Date(rangeStart); d <= rangeEnd; d.setDate(d.getDate() + 1)) {
      const key = formatDateToISO(d);
      const usage = usageByDate.get(key);

      dataPoints.push({
        date: key,
        desktop: usage?.desktop ?? 0,
        desktopTotalTokens: usage?.desktopTotalTokens ?? 0,
        desktopUsageCount: usage?.desktopUsageCount ?? 0,
        desktopTotalCost: usage?.desktopTotalCost ?? 0,
        mobile: usage?.mobile ?? 0,
        mobileTotalTokens: usage?.mobileTotalTokens ?? 0,
        mobileUsageCount: usage?.mobileUsageCount ?? 0,
        mobileTotalCost: usage?.mobileTotalCost ?? 0,
      });
    }

    return dataPoints;
  }, [data, normalizedEndDate, normalizedStartDate]);

  return (
    <Card>
      <CardHeader className={`flex items-start gap-3 space-y-0 border-b ${isMobile ? 'py-3 flex-col' : 'py-4 sm:flex-row'}`}>
        <div className="grid flex-1 gap-1 w-full">
          <CardTitle className={isMobile ? 'text-sm' : 'text-base'}>Tổng chi phí sử dụng model AI</CardTitle>
          <CardDescription className={isMobile ? 'text-xs' : 'text-xs'}>
            {isMobile ? 'Chi phí sử dụng model' : 'Hiển thị tổng chi phí sử dụng model AI'}
          </CardDescription>
        </div>

        <div className={`grid gap-2 w-full ${isMobile ? 'grid-cols-1' : 'grid-cols-3 max-w-[900px] sm:ml-auto'}`}>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className={`${isMobile ? 'w-full text-xs' : 'w-full text-sm'} rounded-lg`}
              aria-label="Chon so thang"
            >
              <SelectValue placeholder="1 thang" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="1" className="rounded-lg">
                1 tháng qua
              </SelectItem>
              <SelectItem value="3" className="rounded-lg">
                3 tháng qua
              </SelectItem>
              <SelectItem value="6" className="rounded-lg">
                6 tháng qua
              </SelectItem>
              <SelectItem value="9" className="rounded-lg">
                9 tháng qua
              </SelectItem>
              <SelectItem value="12" className="rounded-lg">
                12 tháng qua
              </SelectItem>
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? formatDateDisplay(startDate) : 'Start date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={(date) => {
                  if (!date) return;
                  const clampedDate = date < startOfMonth ? startOfMonth : date > endOfMonth ? endOfMonth : date;
                  setStartDate(clampedDate);
                }}
                defaultMonth={startDate ?? startOfMonth}
                disabled={(date) => date < startOfMonth || date > endOfMonth}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? formatDateDisplay(endDate) : 'End date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={(date) => {
                  if (!date) return;
                  const clampedDate = date < startOfMonth ? startOfMonth : date > endOfMonth ? endOfMonth : date;
                  setEndDate(clampedDate);
                }}
                defaultMonth={endDate ?? endOfMonth}
                disabled={(date) => date < startOfMonth || date > endOfMonth}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </CardHeader>
      <CardContent className={isMobile ? 'px-1 py-2' : 'px-2 pt-4 sm:px-6 sm:pt-6'}>
        <ChartContainer
          config={chartConfig}
          className={`aspect-auto ${isMobile ? 'h-[150px]' : 'h-[200px]'} w-full`}
        >
          <AreaChart data={chartData} margin={{ top: 14, right: 10, left: 10, bottom: 8 }}>
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={CLAUDE_SONET_COLOR}
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor={CLAUDE_SONET_COLOR}
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={HANGFIRE_COLOR}
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor={HANGFIRE_COLOR}
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
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
                  day: 'numeric',
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value: string) => {
                    return new Date(value).toLocaleDateString('vi-VN', {
                      month: 'short',
                      day: 'numeric',
                    });
                  }}
                  formatter={(value, name, item) => {
                    const isDesktop = name === 'desktop';
                    const usageCount = isDesktop ? item.payload?.desktopUsageCount : item.payload?.mobileUsageCount;
                    const totalTokens = isDesktop ? item.payload?.desktopTotalTokens : item.payload?.mobileTotalTokens;
                    const totalCost = isDesktop ? item.payload?.desktopTotalCost : item.payload?.mobileTotalCost;

                    return (
                      <div className="flex flex-col gap-1">
                        <span className="text-foreground font-medium">{isDesktop ? 'claude-sonet' : 'hugging-face'}</span>
                        <span className="text-muted-foreground">Tổng số lượt dùng: {Number(usageCount ?? 0).toLocaleString()}</span>
                        <span className="text-muted-foreground">Tổng số token: {totalTokens.toLocaleString()}</span>
                        <span className="text-muted-foreground">Tổng chi phí: {formatCurrency(Number(totalCost ?? 0))}</span>
                      </div>
                    );
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="mobile"
              type="monotone"
              fill="url(#fillMobile)"
              stroke={HANGFIRE_COLOR}
              stackId="a"
            />
            <Area
              dataKey="desktop"
              type="monotone"
              fill="url(#fillDesktop)"
              stroke={CLAUDE_SONET_COLOR}
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

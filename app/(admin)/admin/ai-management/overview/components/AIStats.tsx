'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AIUsageStatistics } from '@/hooks/useAI';
import { Activity, Coins, Database, LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

interface AIStatsProps {
  stats?: AIUsageStatistics;
  isLoading: boolean;
}

export function AIStats({ stats, isLoading }: AIStatsProps) {
  const formatCurrency = (val?: number) => {
    if (val === undefined) return '...';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 4 }).format(val);
  };

  const formatNumber = (val?: number) => {
    if (val === undefined) return '...';
    return new Intl.NumberFormat('en-US').format(val);
  };

  const cards: { title: string; value: string; icon: LucideIcon; description: ReactNode; iconColor: string }[] = [
    {
      title: 'Tổng lượt dùng',
      value: formatNumber(stats?.totalUsage),
      icon: Activity,
      description: 'Tổng số yêu cầu AI đã thực hiện',
      iconColor: 'text-blue-500',
    },
    {
      title: 'Tổng chi phí',
      value: formatCurrency(stats?.totalCost),
      icon: Coins,
      description: (
        <span>
          <span className="text-green-600 font-medium">Đầu vào: </span>
          {formatCurrency(stats?.totalInputCost)}
          <span className="mx-2">|</span>
          <span className="text-red-600 font-medium">Đầu ra: </span>
          {formatCurrency(stats?.totalOutputCost)}
        </span>
      ),
      iconColor: 'text-yellow-500',
    },
    {
      title: 'Tổng Tokens',
      value: formatNumber(stats?.totalTokens),
      icon: Database,
      description: (
        <span>
          <span className="text-blue-600 font-medium">Đầu vào: </span>
          {formatNumber(stats?.totalInputTokens)}
          <span className="mx-2">|</span>
          <span className="text-orange-600 font-medium">Đầu ra: </span>
          {formatNumber(stats?.totalOutputTokens)}
        </span>
      ),
      iconColor: 'text-purple-500',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {cards.map((card, i) => (
        <Card key={i} className="shadow-sm border-gray-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {card.title}
            </CardTitle>
            <card.icon className={`h-4 w-4 ${card.iconColor}`} />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-[100px]" />
                <Skeleton className="h-4 w-[60px]" />
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">{card.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {card.description}
                </p>
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

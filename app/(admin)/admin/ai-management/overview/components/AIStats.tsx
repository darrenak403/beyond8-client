'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AIUsageStatistics } from '@/lib/api/services/fetchAI';
import { Activity, Coins, Database, Layers } from 'lucide-react';

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

  const cards = [
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
      description: 'Ước tính tổng chi phí sử dụng',
      iconColor: 'text-yellow-500',
    },
    {
      title: 'Tổng Tokens',
      value: formatNumber(stats?.totalTokens),
      icon: Database,
      description: 'Tổng số tokens đã tiêu thụ',
      iconColor: 'text-purple-500',
    },
    {
      title: 'Tokens Vào/Ra',
      value: `${formatNumber(stats?.totalInputTokens)} / ${formatNumber(stats?.totalOutputTokens)}`,
      icon: Layers,
      description: 'Phân phối tokens đầu vào và ra',
      iconColor: 'text-pink-500',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
                <p className="text-xs text-muted-foreground">
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

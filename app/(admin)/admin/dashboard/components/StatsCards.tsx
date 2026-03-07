'use client';

import { Users, GraduationCap, TrendingUp, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/useMobile';

export function StatsCards() {
  const isMobile = useIsMobile();

  const stats = [
    {
      title: 'Tổng người dùng',
      value: '12,345',
      icon: Users,
      change: '+12.5%',
      changeType: 'increase' as const,
    },
    {
      title: 'Học viên hoàn thành',
      value: '8,234',
      icon: GraduationCap,
      change: '+8.2%',
      changeType: 'increase' as const,
    },
    {
      title: 'Khóa học bán chạy',
      value: '156',
      icon: TrendingUp,
      change: '+23.1%',
      changeType: 'increase' as const,
    },
    {
      title: 'Tổng doanh thu',
      value: '₫2.4B',
      icon: DollarSign,
      change: '+15.3%',
      changeType: 'increase' as const,
    },
  ];

  return (
    <div className={`grid ${isMobile ? 'grid-cols-2 gap-2' : 'gap-3 md:grid-cols-2 lg:grid-cols-4'}`}>
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className={`flex flex-row items-center justify-between space-y-0 ${isMobile ? 'pb-1' : 'pb-2'}`}>
              <CardTitle className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium`}>{stat.title}</CardTitle>
              <Icon className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} text-muted-foreground`} />
            </CardHeader>
            <CardContent>
              <div className={`${isMobile ? 'text-base' : 'text-xl'} font-bold`}>{stat.value}</div>
              <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground mt-1`}>
                <span className="text-green-600 font-medium">{stat.change}</span> {!isMobile && 'so với tháng trước'}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

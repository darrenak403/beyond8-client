'use client';

import { Users, GraduationCap, TrendingUp, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/useMobile';
import { useSystemDashboardAnalytics } from '@/hooks/useAnalystic';

export function StatsCards() {
  const isMobile = useIsMobile();
  const { data, isLoading, isError } = useSystemDashboardAnalytics();
  const statusText = isError ? 'Không tải được dữ liệu' : isLoading ? 'Đang tải dữ liệu' : 'Dữ liệu hệ thống';
  const statusColorClass = isError ? 'text-red-600' : isLoading ? 'text-amber-600' : 'text-emerald-600';

  const formatNumber = (value: number) => new Intl.NumberFormat('vi-VN').format(value);
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(value);

  const stats = [
    {
      title: 'Tổng người dùng',
      value: isLoading ? '...' : formatNumber(data?.totalUsers ?? 0),
      icon: Users,
    },
    {
      title: 'Tổng số học viên',
      value: isLoading ? '...' : formatNumber(data?.totalStudents ?? 0),
      icon: GraduationCap,
    },
    {
      title: 'Tổng khóa học',
      value: isLoading ? '...' : formatNumber(data?.totalCourses ?? 0),
      icon: TrendingUp,
    },
    {
      title: 'Tổng doanh thu',
      value: isLoading ? '...' : formatCurrency(data?.totalPlatformFee ?? 0),
      icon: DollarSign,
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
              <p className={`${isMobile ? 'text-xs' : 'text-sm'} mt-1 ${statusColorClass}`}>{statusText}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

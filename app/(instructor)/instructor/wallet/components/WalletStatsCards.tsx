"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Clock, CreditCard, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface WalletStatsCardsProps {
  totalRevenue: number;
  pendingBalance: number;
  holdBalance: number;
  totalWithdrawn: number;
  nextAvailableAt?: string | null;
  isLoading?: boolean;
}

export function WalletStatsCards({
  totalRevenue,
  pendingBalance,
  holdBalance,
  totalWithdrawn,
  nextAvailableAt,
  isLoading,
}: WalletStatsCardsProps) {
  const fmt = (n: number) => new Intl.NumberFormat('vi-VN').format(n);

  const stats = [
    {
      title: "Tổng doanh thu",
      amount: totalRevenue,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50",
      description: "Tổng thu nhập từ trước đến nay"
    },
    {
      title: "Chờ xử lý",
      amount: pendingBalance,
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50 ",
      description: nextAvailableAt
        ? `Khả dụng: ${new Intl.DateTimeFormat('vi-VN').format(new Date(nextAvailableAt))}`
        : "Chờ xử lý từ giao dịch"
    },
    {
      title: "Tạm giữ",
      amount: holdBalance,
      icon: AlertCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      description: "Giữ do mã giảm giá"
    },
    {
      title: "Đã rút",
      amount: totalWithdrawn,
      icon: CreditCard,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      description: "Tổng số tiền đã thanh toán"
    },
  ];

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-32 mb-2" />
              ) : (
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold [font-variant-numeric:tabular-nums]">
                    {fmt(stat.amount)}
                  </span>
                  <span className="text-xs font-medium text-muted-foreground">VNĐ</span>
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-1 truncate" title={stat.description}>
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

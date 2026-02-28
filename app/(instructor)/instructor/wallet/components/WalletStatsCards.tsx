"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Clock, AlertCircle, Wallet } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface WalletStatsCardsProps {
  availableBalance: number;
  totalRevenue: number;
  pendingBalance: number;
  holdBalance: number;
  nextAvailableAt?: string | null;
  isLoading?: boolean;
}

export function WalletStatsCards({
  availableBalance,
  totalRevenue,
  pendingBalance,
  holdBalance,
  nextAvailableAt,
  isLoading,
}: WalletStatsCardsProps) {
  const fmt = (n: number) => new Intl.NumberFormat('vi-VN').format(n);

  const stats = [
    {
      title: "Số dư",
      amount: availableBalance,
      icon: Wallet,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      description: "Số dư hiện tại"
    },
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
  ];

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card
            key={index}
            className={`transition-shadow ${index === 0 ? "border-violet-200 bg-brand-purple from-violet-600 to-violet-800 text-white dark:from-violet-700 dark:to-violet-900 shadow-md" : "hover:shadow-md"}`}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className={`text-sm font-medium ${index === 0 ? "text-violet-100" : "text-muted-foreground"}`}>
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${index === 0 ? "bg-white/20" : stat.bgColor}`}>
                <Icon className={`h-4 w-4 ${index === 0 ? "text-white" : stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className={`h-8 w-32 mb-2 ${index === 0 ? "bg-white/20" : ""}`} />
              ) : (
                <div className="flex items-baseline gap-1">
                  <span className={`text-2xl font-bold [font-variant-numeric:tabular-nums] ${index === 0 ? "text-white" : ""}`}>
                    {fmt(stat.amount)}
                  </span>
                  <span className={`text-xs font-medium ${index === 0 ? "text-violet-100" : "text-muted-foreground"}`}>VNĐ</span>
                </div>
              )}
              <p className={`text-xs mt-1 truncate ${index === 0 ? "text-violet-200" : "text-muted-foreground"}`} title={stat.description}>
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

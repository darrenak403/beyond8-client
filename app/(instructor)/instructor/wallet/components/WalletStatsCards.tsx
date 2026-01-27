"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Clock, CreditCard, Wallet } from "lucide-react";

interface WalletStatsCardsProps {
  totalRevenue: number;
  currentBalance: number;
  pendingClearance: number;
  totalWithdrawn: number;
}

export function WalletStatsCards({
  totalRevenue,
  currentBalance,
  pendingClearance,
  totalWithdrawn,
}: WalletStatsCardsProps) {
  const stats = [
    {
      title: "Tổng doanh thu",
      value: `${totalRevenue.toLocaleString()} VNĐ`,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50",
      description: "Tổng thu nhập từ trước đến nay"
    },
    {
      title: "Số dư khả dụng",
      value: `${currentBalance.toLocaleString()} VNĐ`,
      icon: Wallet,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      description: "Có thể rút ngay"
    },
    {
      title: "Chờ xử lý",
      value: `${pendingClearance.toLocaleString()} VNĐ`,
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      description: "Sẽ khả dụng sau 7 ngày"
    },
    {
      title: "Đã rút",
      value: `${totalWithdrawn.toLocaleString()} VNĐ`,
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
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

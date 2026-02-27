"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Clock, CreditCard, Wallet } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Wallet as WalletType } from "@/lib/api/services/fetchWallet";

interface PlatformWalletStatsProps {
    wallet: WalletType | null;
    isLoading?: boolean;
}

export function PlatformWalletStats({ wallet, isLoading }: PlatformWalletStatsProps) {
    const stats = [
        {
            title: "Tổng thu nhập nền tảng",
            value: `${(wallet?.totalEarnings || 0).toLocaleString()} VNĐ`,
            icon: DollarSign,
            color: "text-green-600",
            bgColor: "bg-green-50",
            description: "Tổng doanh thu từ chiết khấu"
        },
        {
            title: "Số dư khả dụng",
            value: `${(wallet?.availableBalance || 0).toLocaleString()} VNĐ`,
            icon: Wallet,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
            description: "Có thể rút/chuyển"
        },
        {
            title: "Số dư đang giữ",
            value: `${(wallet?.holdBalance || 0).toLocaleString()} VNĐ`,
            icon: Clock,
            color: "text-orange-600",
            bgColor: "bg-orange-50",
            description: "Tiền đang chờ xử lý"
        },
        {
            title: "Đã chi trả",
            value: `${(wallet?.totalWithdrawn || 0).toLocaleString()} VNĐ`,
            icon: CreditCard,
            color: "text-purple-600",
            bgColor: "bg-purple-50",
            description: "Tổng tiền đã thanh toán"
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
                                <div className="text-2xl font-bold">{stat.value}</div>
                            )}
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

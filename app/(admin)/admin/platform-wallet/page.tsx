"use client";

import React, { useState } from "react";
import { PlatformWalletStats } from "./components/PlatformWalletStats";
import { PlatformTransactionTable } from "./components/PlatformTransactionTable";
import { PlatformUpcomingSettlementsTable } from "./components/PlatformUpcomingSettlementsTable";
import { useGetPlatformWallet, useGetPlatformTransactions, useGetUpcomingSettlements, useTriggerSettlement } from "@/hooks/useWallet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export default function PlatformWalletPage() {
    const { wallet, isLoading: isWalletLoading } = useGetPlatformWallet();

    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 7,
    });

    const [upcomingPagination, setUpcomingPagination] = useState({
        pageIndex: 0,
        pageSize: 7,
    });

    const { data: transactionsData, isLoading: isTransactionsLoading } = useGetPlatformTransactions({
        pageNumber: pagination.pageIndex + 1,
        pageSize: pagination.pageSize,
        isDescending: true,
    });

    // using empty strings for from and to as per API defaults (get all)
    const { data: upcomingData, isLoading: isUpcomingLoading } = useGetUpcomingSettlements({
        from: "",
        to: "",
        pageNumber: upcomingPagination.pageIndex + 1,
        pageSize: upcomingPagination.pageSize,
        isDescending: true,
    });

    const { triggerSettlement, isPending } = useTriggerSettlement();

    return (
        <div className="space-y-4 mx-auto max-w-[1650px] p-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-bold text-gray-900">Ví nền tảng</h1>
                    <p className="text-muted-foreground">
                        Quản lý doanh thu chiết khấu và lịch sử giao dịch tổng của nền tảng
                    </p>
                </div>
                <Button
                    onClick={() => triggerSettlement()}
                    disabled={isPending}
                    className="gap-2"
                >
                    <RefreshCw className={`h-4 w-4 ${isPending ? 'animate-spin' : ''}`} />
                    Xử lý các giao dịch ngay lập tức
                </Button>
            </div>

            {/* Stats Cards */}
            <PlatformWalletStats
                wallet={wallet}
                isLoading={isWalletLoading || isPending}
            />

            {/* Transactions Section */}
            <Tabs defaultValue="transactions" className="w-full">
                <div className="flex items-center justify-between mb-4">
                    <TabsList>
                        <TabsTrigger value="transactions">Lịch sử giao dịch</TabsTrigger>
                        <TabsTrigger value="upcoming">Giao dịch đang xử lý</TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="transactions" className="mt-0">
                    <PlatformTransactionTable
                        transactions={transactionsData?.data || []}
                        isLoading={isTransactionsLoading || isPending}
                        pagination={pagination}
                        setPagination={setPagination}
                        pageCount={transactionsData?.totalPages || 0}
                    />
                </TabsContent>

                <TabsContent value="upcoming" className="mt-0">
                    <PlatformUpcomingSettlementsTable
                        settlements={upcomingData?.data || []}
                        isLoading={isUpcomingLoading || isPending}
                        pagination={upcomingPagination}
                        setPagination={setUpcomingPagination}
                        pageCount={upcomingData?.totalPages || 0}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
}

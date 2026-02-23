"use client";

import React, { useState } from "react";
import { PlatformWalletStats } from "./components/PlatformWalletStats";
import { PlatformTransactionTable } from "./components/PlatformTransactionTable";
import { useGetPlatformWallet, useGetPlatformTransactions } from "@/hooks/useWallet";

export default function PlatformWalletPage() {
    const { wallet, isLoading: isWalletLoading } = useGetPlatformWallet();

    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });

    const { data: transactionsData, isLoading: isTransactionsLoading } = useGetPlatformTransactions({
        pageNumber: pagination.pageIndex + 1,
        pageSize: pagination.pageSize,
        isDescending: true,
    });

    return (
        <div className="space-y-4 mx-auto max-w-[1650px] p-4">
            {/* Header */}
            <div className="flex flex-col gap-2">
                {/* <h1 className="text-2xl font-bold text-gray-900">Ví nền tảng (Platform Wallet)</h1> */}
                <p className="text-muted-foreground">
                    Quản lý doanh thu chiết khấu và lịch sử giao dịch tổng của nền tảng
                </p>
            </div>

            {/* Stats Cards */}
            <PlatformWalletStats
                wallet={wallet}
                isLoading={isWalletLoading}
            />

            {/* Transactions Section */}
            <PlatformTransactionTable
                transactions={transactionsData?.data || []}
                isLoading={isTransactionsLoading}
                pagination={pagination}
                setPagination={setPagination}
                pageCount={transactionsData?.totalPages || 0}
            />
        </div>
    );
}

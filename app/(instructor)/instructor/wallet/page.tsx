"use client";

import React, { useState } from "react";
import { WalletStatsCards } from "./components/WalletStatsCards";
import { TransactionHistoryTable } from "./components/TransactionHistoryTable";
import { useGetMyWallet, useGetMyTransactions } from "@/hooks/useWallet";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { DepositDialog } from "@/components/widget/wallet/DepositDialog";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UpcomingSettlementsTable } from "./components/UpcomingSettlementsTable";
import { useGetMyUpcomingSettlements } from "@/hooks/useWallet";

export default function WalletPage() {
  const { wallet, isLoading: isWalletLoading } = useGetMyWallet();

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [upcomingPagination, setUpcomingPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data: transactionsData, isLoading: isTransactionsLoading, refetch: refetchTransactions } = useGetMyTransactions({
    pageNumber: pagination.pageIndex + 1,
    pageSize: pagination.pageSize,
    isDescending: true,
  });

  const { data: upcomingData, isLoading: isUpcomingLoading } = useGetMyUpcomingSettlements({
    pageNumber: upcomingPagination.pageIndex + 1,
    pageSize: upcomingPagination.pageSize,
    isDescending: true,
  });

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const processedRef = useRef(false);

  useEffect(() => {
    const vnp_ResponseCode = searchParams.get("vnp_ResponseCode");
    const vnp_Amount = searchParams.get("vnp_Amount");

    if (vnp_ResponseCode && !processedRef.current) {
      processedRef.current = true;
      if (vnp_ResponseCode === "00") {
        const amount = vnp_Amount ? parseInt(vnp_Amount) / 100 : 0;
        toast.success(`Nạp tiền thành công ${amount > 0 ? amount.toLocaleString() + ' VNĐ' : ''}`);
        // Refetch to get updated wallet balance and transactions
        refetchTransactions();
      } else {
        toast.error("Nạp tiền thất bại hoặc đã bị hủy.");
      }

      // Cleanup URL to remove VNPay params
      router.replace(pathname, { scroll: false });
    }
  }, [searchParams, router, pathname, refetchTransactions]);

  return (
    <div className="space-y-6 sm:space-y-8 min-w-[1100px] w-full p-1 mx-auto max-w-[1650px]">
      {/* Header */}
      <div className="flex sm:flex-row flex-col gap-4 sm:items-center justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">Ví của tôi</h1>
            {wallet && (
              <Badge variant={wallet.isActive ? "default" : "destructive"}>
                {wallet.isActive ? "Hoạt động" : "Bị khóa"}
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground">
            Quản lý thu nhập và lịch sử giao dịch của bạn
            {wallet?.createdAt ? ` • Tham gia từ: ${new Date(wallet.createdAt).toLocaleDateString('vi-VN')}` : ''}
          </p>
        </div>
        <div className="flex shrink-0">
          <DepositDialog />
        </div>
      </div>

      {/* Stats Cards */}
      <WalletStatsCards
        availableBalance={wallet?.availableBalance || 0}
        totalRevenue={wallet?.totalEarnings || 0}
        pendingBalance={wallet?.pendingBalance || 0}
        holdBalance={wallet?.holdBalance || 0}
        nextAvailableAt={wallet?.nextAvailableAt || null}
        isLoading={isWalletLoading}
      />

      {/* Main Content */}
      <div className="w-full space-y-6">
        {/* Chart Section */}
        {/* <ChartLineInteractive /> */}

        {/* Transactions & Upcoming Section */}
        <Tabs defaultValue="transactions" className="w-full">
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="transactions">Lịch sử giao dịch</TabsTrigger>
              <TabsTrigger value="upcoming">Giao dịch đang xử lý</TabsTrigger>
            </TabsList>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" aria-hidden="true" />
              Xuất báo cáo
            </Button>
          </div>

          <TabsContent value="transactions" className="mt-0">
            <TransactionHistoryTable
              transactions={transactionsData?.data || []}
              isLoading={isTransactionsLoading}
              pagination={pagination}
              setPagination={setPagination}
              pageCount={transactionsData?.totalPages || 0}
            />
          </TabsContent>

          <TabsContent value="upcoming" className="mt-0">
            <UpcomingSettlementsTable
              settlements={upcomingData?.data || []}
              isLoading={isUpcomingLoading}
              pagination={upcomingPagination}
              setPagination={setUpcomingPagination}
              pageCount={upcomingData?.totalPages || 0}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

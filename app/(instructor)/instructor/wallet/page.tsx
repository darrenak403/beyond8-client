"use client";

import React from "react";
import { WalletStatsCards } from "./components/WalletStatsCards";
import { TransactionHistoryTable, Transaction } from "./components/TransactionHistoryTable";
import { WithdrawalSection } from "./components/WithdrawalSection";
import { ChartLineInteractive } from "../dashboard/components/ChartLineInteractive";

// Mock data
const walletData = {
  totalRevenue: 154200000,
  currentBalance: 24500000,
  pendingClearance: 5200000,
  totalWithdrawn: 124500000,
};

const transactions = [
  {
    id: "TRX-001",
    source: "Khóa học React Advanced",
    date: "27/01/2026",
    amount: 500000,
    status: "Completed",
    type: "Sale",
  },
  {
    id: "TRX-002",
    source: "Rút tiền về Vietcombank",
    date: "25/01/2026",
    amount: 10000000,
    status: "Completed",
    type: "Withdrawal",
  },
  {
    id: "TRX-003",
    source: "Khóa học Next.js Master",
    date: "24/01/2026",
    amount: 1200000,
    status: "Pending",
    type: "Sale",
  },
  {
    id: "TRX-004",
    source: "Khóa học UI/UX Design",
    date: "22/01/2026",
    amount: 800000,
    status: "Completed",
    type: "Sale",
  },
  {
    id: "TRX-005",
    source: "Rút tiền về Vietcombank",
    date: "15/01/2026",
    amount: 5000000,
    status: "Failed",
    type: "Withdrawal",
  },
] satisfies Transaction[];

export default function WalletPage() {

  return (
    <div className="space-y-6 sm:space-y-8 mx-auto max-w-[1650px] p-1">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Ví của tôi</h1>
        <p className="text-muted-foreground">
          Quản lý thu nhập và lịch sử giao dịch của bạn
        </p>
      </div>

      {/* Stats Cards */}
      <WalletStatsCards
        totalRevenue={walletData.totalRevenue}
        currentBalance={walletData.currentBalance}
        pendingClearance={walletData.pendingClearance}
        totalWithdrawn={walletData.totalWithdrawn}
      />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="xl:col-span-2 space-y-6">
          {/* Chart Section */}
          <ChartLineInteractive />
          
          {/* Transactions Section */}
          <TransactionHistoryTable transactions={transactions} />
        </div>

        {/* Right Column - Sidebar */}
        <div className="xl:col-span-1">
          <WithdrawalSection />
        </div>
      </div>
    </div>
  );
}
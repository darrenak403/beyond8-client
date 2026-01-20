"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Wallet,
  CreditCard,
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  Download,
  TrendingUp,
  DollarSign,
  Calendar,
  Filter,
  Clock,
} from "lucide-react";
import { useIsMobile } from "@/hooks/useMobile";

const mockTransactions = [
  {
    id: 1,
    type: "income",
    title: "Thanh toán khóa học: React Complete Guide",
    amount: 500000,
    date: "2026-01-19",
    status: "completed",
    student: "Nguyễn Văn A",
  },
  {
    id: 2,
    type: "expense",
    title: "Rút tiền về ngân hàng",
    amount: 2000000,
    date: "2026-01-18",
    status: "completed",
    bank: "Vietcombank **** 1234",
  },
  {
    id: 3,
    type: "income",
    title: "Thanh toán khóa học: Node.js Backend",
    amount: 750000,
    date: "2026-01-17",
    status: "completed",
    student: "Trần Thị B",
  },
  {
    id: 4,
    type: "expense",
    title: "Phí giao dịch",
    amount: 5000,
    date: "2026-01-17",
    status: "completed",
  },
  {
    id: 5,
    type: "income",
    title: "Thanh toán khóa học: UI/UX Design",
    amount: 600000,
    date: "2026-01-16",
    status: "pending",
    student: "Lê Văn C",
  },
];

export default function MyWalletPage() {
  const [activeTab, setActiveTab] = useState("all");
  const isMobile = useIsMobile();

  const balance = 3845000;
  const pendingBalance = 600000;
  const totalIncome = 12500000;
  const totalWithdraw = 8655000;

  const filteredTransactions = mockTransactions.filter((transaction) => {
    if (activeTab === "all") return true;
    if (activeTab === "income") return transaction.type === "income";
    if (activeTab === "expense") return transaction.type === "expense";
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className={`font-bold mb-2 ${isMobile ? "text-xl" : "text-2xl"}`}>
          Ví của tôi
        </h2>
        <p className="text-gray-600">Quản lý thu nhập và giao dịch của bạn</p>
      </div>

      {/* Balance Cards */}
      <div
        className={`grid gap-4 ${
          isMobile ? "grid-cols-1" : "grid-cols-2 lg:grid-cols-4"
        }`}
      >
        {/* Main Balance */}
        <Card className="p-6 bg-gradient-to-br from-primary to-brand-purple text-white">
          <div className="flex items-center gap-2 mb-2">
            <Wallet className="w-5 h-5" />
            <span className="text-sm opacity-90">Số dư khả dụng</span>
          </div>
          <p className="text-3xl font-bold">
            {balance.toLocaleString("vi-VN")}đ
          </p>
        </Card>

        {/* Pending Balance */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-2 text-gray-600">
            <Clock className="w-5 h-5" />
            <span className="text-sm">Đang chờ xử lý</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {pendingBalance.toLocaleString("vi-VN")}đ
          </p>
        </Card>

        {/* Total Income */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-2 text-green-600">
            <TrendingUp className="w-5 h-5" />
            <span className="text-sm">Tổng thu nhập</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {totalIncome.toLocaleString("vi-VN")}đ
          </p>
        </Card>

        {/* Total Withdraw */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-2 text-red-600">
            <ArrowUpRight className="w-5 h-5" />
            <span className="text-sm">Tổng rút tiền</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {totalWithdraw.toLocaleString("vi-VN")}đ
          </p>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className={`flex gap-3 ${isMobile ? "flex-col" : "flex-row"}`}>
        <Button className="gap-2 flex-1">
          <ArrowUpRight className="w-4 h-4" />
          Rút tiền
        </Button>
        <Button variant="outline" className="gap-2 flex-1">
          <Download className="w-4 h-4" />
          Xuất báo cáo
        </Button>
        <Button variant="outline" className="gap-2">
          <Filter className="w-4 h-4" />
          Bộ lọc
        </Button>
      </div>

      {/* Transactions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Lịch sử giao dịch</h3>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start mb-6">
            <TabsTrigger value="all">Tất cả</TabsTrigger>
            <TabsTrigger value="income">Thu nhập</TabsTrigger>
            <TabsTrigger value="expense">Chi tiêu</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            <div className="space-y-4">
              {filteredTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {/* Left Side */}
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        transaction.type === "income"
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {transaction.type === "income" ? (
                        <ArrowDownLeft className="w-5 h-5" />
                      ) : (
                        <ArrowUpRight className="w-5 h-5" />
                      )}
                    </div>

                    <div>
                      <p className="font-medium">{transaction.title}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(transaction.date).toLocaleDateString("vi-VN")}
                        {transaction.student && (
                          <>
                            <span>•</span>
                            <span>{transaction.student}</span>
                          </>
                        )}
                        {transaction.bank && (
                          <>
                            <span>•</span>
                            <span>{transaction.bank}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Side */}
                  <div className="text-right">
                    <p
                      className={`text-lg font-bold ${
                        transaction.type === "income"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {transaction.type === "income" ? "+" : "-"}
                      {transaction.amount.toLocaleString("vi-VN")}đ
                    </p>
                    <Badge
                      variant={
                        transaction.status === "completed"
                          ? "default"
                          : "secondary"
                      }
                      className="mt-1"
                    >
                      {transaction.status === "completed"
                        ? "Hoàn thành"
                        : "Đang xử lý"}
                    </Badge>
                  </div>
                </div>
              ))}

              {/* Empty State */}
              {filteredTransactions.length === 0 && (
                <div className="text-center py-12">
                  <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Chưa có giao dịch
                  </h3>
                  <p className="text-gray-600">
                    Các giao dịch của bạn sẽ hiển thị ở đây
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}

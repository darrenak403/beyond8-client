"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";
import { WalletTransaction, TransactionType } from "@/lib/api/services/fetchWallet";

const TransactionTypeLabels: Record<string, string> = {
  [TransactionType.Sale]: "Bán khóa học",
  [TransactionType.Payout]: "Rút tiền",
  [TransactionType.PlatformFee]: "Chiết khấu nền tảng",
  [TransactionType.Adjustment]: "Điều chỉnh",
  [TransactionType.TopUp]: "Nạp tiền",
  [TransactionType.CouponHold]: "Tạm giữ (Coupon)",
  [TransactionType.CouponRelease]: "Hoàn trả (Coupon)",
  [TransactionType.CouponUsage]: "Sử dụng Coupon",
  [TransactionType.Settlement]: "Thanh toán định kỳ"
};

interface TransactionHistoryTableProps {
  transactions: WalletTransaction[];
  isLoading?: boolean;
  pagination: { pageIndex: number; pageSize: number };
  setPagination: React.Dispatch<React.SetStateAction<{ pageIndex: number; pageSize: number }>>;
  pageCount: number;
}

export function TransactionHistoryTable({
  transactions,
  isLoading,
  pagination,
  setPagination,
  pageCount
}: TransactionHistoryTableProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nội dung</TableHead>
              <TableHead>Ngày</TableHead>
              <TableHead>Loại</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Số tiền</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-50" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-25" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-25" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-30 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : transactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Không có giao dịch nào.
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((transaction) => {
                const isPositive = [
                  TransactionType.Sale,
                  TransactionType.TopUp,
                  TransactionType.CouponRelease,
                ].includes(transaction.type);

                return (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium max-w-50 truncate" title={transaction.description}>
                      {transaction.description || transaction.referenceType}
                    </TableCell>
                    <TableCell>
                      {transaction.createdAt ? format(new Date(transaction.createdAt.endsWith('Z') ? transaction.createdAt : `${transaction.createdAt}Z`), "dd/MM/yyyy HH:mm", { locale: vi }) : "N/A"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={isPositive ? "default" : "secondary"}>
                        {TransactionTypeLabels[transaction.type] || transaction.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`
                          ${transaction.status === "Completed" ? "text-green-600 border-green-200 bg-green-50" : ""}
                          ${transaction.status === "Pending" ? "text-orange-600 border-orange-200 bg-orange-50" : ""}
                          ${transaction.status === "Failed" ? "text-red-600 border-red-200 bg-red-50" : ""}
                        `}
                      >
                        {transaction.status === "Completed" ? "Hoàn thành" :
                          transaction.status === "Pending" ? "Đang xử lý" : "Thất bại"}
                      </Badge>
                    </TableCell>
                    <TableCell className={`text-right font-medium [font-variant-numeric:tabular-nums] ${isPositive ? "text-green-600" : "text-foreground"}`}>
                      {isPositive ? "+" : "-"}
                      {new Intl.NumberFormat('vi-VN').format(transaction.amount)} VNĐ
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {!isLoading && pageCount > 1 && (
        <div className="flex items-center justify-between px-2">
          <div className="flex w-25 items-center justify-center text-sm font-medium">
            Trang {pagination.pageIndex + 1} / {pageCount}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => setPagination(p => ({ ...p, pageIndex: p.pageIndex - 1 }))}
              disabled={pagination.pageIndex === 0}
              aria-label="Trang trước"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => setPagination(p => ({ ...p, pageIndex: p.pageIndex + 1 }))}
              disabled={pagination.pageIndex >= pageCount - 1}
              aria-label="Trang tiếp"
            >
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

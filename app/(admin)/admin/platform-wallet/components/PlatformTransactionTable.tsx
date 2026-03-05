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
    [TransactionType.Payout]: "Giảng viên rút tiền",
    [TransactionType.PlatformFee]: "Chiết khấu nền tảng",
    [TransactionType.Adjustment]: "Điều chỉnh",
    [TransactionType.TopUp]: "Giảng viên nạp tiền",
    [TransactionType.CouponHold]: "Tạm giữ (Coupon)",
    [TransactionType.CouponRelease]: "Hoàn trả (Coupon)",
    [TransactionType.CouponUsage]: "Sử dụng Coupon",
    "Revenue": "Doanh thu",
    "CouponCost": "Chi phí Coupon",
    "Settlement": "Thanh toán",
};

interface PlatformTransactionTableProps {
    transactions: WalletTransaction[];
    isLoading?: boolean;
    pagination: { pageIndex: number; pageSize: number };
    setPagination: React.Dispatch<React.SetStateAction<{ pageIndex: number; pageSize: number }>>;
    pageCount: number;
}

export function PlatformTransactionTable({
    transactions,
    isLoading,
    pagination,
    setPagination,
    pageCount
}: PlatformTransactionTableProps) {
    return (
        <div className="space-y-4">
            {/* <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Lịch sử giao dịch nền tảng</h2>
            </div> */}

            <div className="rounded-md border bg-white">
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
                                    <TableCell><Skeleton className="h-5 w-[200px]" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-[100px]" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-[80px]" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-[100px]" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-[120px] ml-auto" /></TableCell>
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
                                    TransactionType.PlatformFee,
                                    TransactionType.CouponUsage,
                                    "Revenue"
                                ].includes(transaction.type);

                                return (
                                    <TableRow key={transaction.id}>
                                        <TableCell className="font-medium max-w-[350px] truncate" title={transaction.description}>
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
                                                {transaction.status === "Completed" ? "Thành công" :
                                                    transaction.status === "Pending" ? "Đang xử lý" : "Thất bại"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right align-middle">
                                            <div className="flex flex-col items-end justify-center">
                                                <span className={`font-medium [font-variant-numeric:tabular-nums] ${transaction.type === TransactionType.Sale && transaction.status === "Pending" ? "text-orange-600" :
                                                    transaction.type === TransactionType.Sale && transaction.status === "Completed" ? "text-green-600" :
                                                        transaction.type === TransactionType.TopUp || (transaction.type as string) === "Revenue" ? "text-green-600" :
                                                            transaction.type === TransactionType.CouponHold || (transaction.type as string) === "CouponCost" ? "text-red-600" :
                                                                transaction.type === TransactionType.CouponUsage ? "text-purple-600" :
                                                                    isPositive ? "text-green-600" : "text-gray-900"
                                                    }`}>
                                                    {['CouponHold', 'CouponUsage', 'Payout', 'PlatformFee'].some(t => TransactionType[t as keyof typeof TransactionType] === transaction.type) || ['CouponCost', 'Settlement'].includes(transaction.type as string) ? "-" : "+"}
                                                    {Math.abs(transaction.amount).toLocaleString()} VNĐ
                                                </span>
                                                <span className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">
                                                    {transaction.type === TransactionType.Sale && transaction.status === "Pending" && "Cộng vào chờ xử lý"}
                                                    {transaction.type === TransactionType.Sale && transaction.status === "Completed" && "Cộng vào số dư"}
                                                    {transaction.type === TransactionType.TopUp && "Cộng vào số dư"}
                                                    {transaction.type === TransactionType.CouponHold && "Giữ từ số dư"}
                                                    {transaction.type === TransactionType.CouponUsage && "Trừ từ tạm giữ"}
                                                    {(transaction.type as string) === "Revenue" && "Cộng vào doanh thu"}
                                                    {(transaction.type as string) === "CouponCost" && "Trừ chi phí"}
                                                </span>
                                            </div>
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
                    <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                        Trang {pagination.pageIndex + 1} / {pageCount}
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => setPagination(p => ({ ...p, pageIndex: p.pageIndex - 1 }))}
                            disabled={pagination.pageIndex === 0}
                        >
                            <span className="sr-only">Go to previous page</span>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => setPagination(p => ({ ...p, pageIndex: p.pageIndex + 1 }))}
                            disabled={pagination.pageIndex >= pageCount - 1}
                        >
                            <span className="sr-only">Go to next page</span>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}

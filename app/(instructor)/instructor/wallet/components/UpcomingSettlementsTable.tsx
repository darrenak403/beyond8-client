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
import { MyUpcoming } from "@/lib/api/services/fetchWallet";

interface UpcomingSettlementsTableProps {
    settlements: MyUpcoming[];
    isLoading?: boolean;
    pagination: { pageIndex: number; pageSize: number };
    setPagination: React.Dispatch<React.SetStateAction<{ pageIndex: number; pageSize: number }>>;
    pageCount: number;
}

export function UpcomingSettlementsTable({
    settlements,
    isLoading,
    pagination,
    setPagination,
    pageCount
}: UpcomingSettlementsTableProps) {
    return (
        <div className="space-y-4">
            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Mã đơn hàng</TableHead>
                            <TableHead>Ngày dự kiến nhận</TableHead>
                            <TableHead>Trạng thái</TableHead>
                            <TableHead className="text-right">Số tiền</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-5 w-37.5" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-37.5" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-25" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-30 ml-auto" /></TableCell>
                                </TableRow>
                            ))
                        ) : settlements.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">
                                    Không có khoản đang xử lý nào.
                                </TableCell>
                            </TableRow>
                        ) : (
                            settlements.map((item) => (
                                <TableRow key={item.transactionId}>
                                    <TableCell className="font-medium max-w-40 truncate" title={item.orderId || item.transactionId}>
                                        {item.orderId || item.transactionId}
                                    </TableCell>
                                    <TableCell>
                                        {item.availableAt ? format(new Date(item.availableAt.endsWith('Z') ? item.availableAt : `${item.availableAt}Z`), "dd/MM/yyyy HH:mm", { locale: vi }) : "N/A"}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="outline"
                                            className={`
                        ${item.status === "Pending" ? "text-orange-600 border-orange-200 bg-orange-50" : ""}
                        ${item.status === "Completed" ? "text-green-600 border-green-200 bg-green-50" : ""}
                      `}
                                        >
                                            {item.status === "Pending" ? "Chờ xử lý" : "Đã xử lý"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right font-medium text-green-600 [font-variant-numeric:tabular-nums]">
                                        +{new Intl.NumberFormat('vi-VN').format(item.amount)} VNĐ
                                    </TableCell>
                                </TableRow>
                            ))
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

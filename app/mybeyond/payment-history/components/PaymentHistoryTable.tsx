"use client";

import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { ColumnDef, OnChangeFn, PaginationState } from "@tanstack/react-table";
import { useMemo } from "react";
import { format } from "date-fns";
import { CreditCard, Clock, CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PaymentItem } from "@/lib/api/services/fetchOrder";
import { PaymentHistoryTableSkeleton } from "./PaymentHistoryTableSkeleton";

interface PaymentHistoryTableProps {
  data: PaymentItem[];
  isLoading: boolean;
  pageCount: number;
  pagination: PaginationState;
  onPaginationChange: OnChangeFn<PaginationState>;
}

const formatCurrency = (amount: number, currency: string) => {
  try {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: currency || "VND",
      minimumFractionDigits: 0,
    }).format(amount);
  } catch {
    return amount.toLocaleString("vi-VN") + " " + (currency || "VND");
  }
};

export function PaymentHistoryTable({
  data,
  isLoading,
  pageCount,
  pagination,
  onPaginationChange,
}: PaymentHistoryTableProps) {
  const columns = useMemo<ColumnDef<PaymentItem>[]>(
    () => [
      {
        accessorKey: "paymentNumber",
        header: "Mã giao dịch",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-purple-50 text-purple-600">
              <CreditCard className="w-3.5 h-3.5" />
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-gray-800">
                {row.getValue("paymentNumber")}
              </span>
              <span className="text-xs text-gray-500">
                #{row.original.orderId.slice(0, 8)}
              </span>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "amount",
        header: "Số tiền",
        cell: ({ row }) => {
          const item = row.original;
          return (
            <div className="font-semibold text-gray-900">
              {formatCurrency(item.amount, item.currency)}
            </div>
          );
        },
      },
      {
        accessorKey: "provider",
        header: "Cổng thanh toán",
        cell: ({ row }) => {
          const item = row.original;
          return (
            <div className="flex flex-col text-sm">
              <span className="font-medium text-gray-800">
                {item.provider}
              </span>
              {item.paymentMethod && (
                <span className="text-xs text-gray-500">
                  {item.paymentMethod}
                </span>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "createdAt",
        header: "Thời gian",
        cell: ({ row }) => (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="w-3.5 h-3.5 text-gray-400" />
            {format(new Date(row.getValue("createdAt")), "dd/MM/yyyy HH:mm")}
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: "Trạng thái",
        cell: ({ row }) => {
          const status = (row.getValue("status") as string) || "Unknown";
          const isSuccess =
            status === "Success" ||
            status === "Completed" ||
            status === "Paid";
          const isPending =
            status === "Pending" || status === "Processing";

          const icon = isSuccess ? (
            <CheckCircle className="w-3 h-3" />
          ) : isPending ? (
            <Clock className="w-3 h-3" />
          ) : (
            <XCircle className="w-3 h-3" />
          );

          const label = isSuccess
            ? "Thành công"
            : isPending
            ? "Đang xử lý"
            : "Thất bại";

          return (
            <Badge
              variant="outline"
              className={cn(
                "gap-1 pl-1 pr-2.5 py-0.5 border-transparent",
                isSuccess
                  ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                  : isPending
                  ? "bg-amber-50 text-amber-700 hover:bg-amber-100"
                  : "bg-red-50 text-red-700 hover:bg-red-100"
              )}
            >
              {icon}
              {label}
            </Badge>
          );
        },
      },
    ],
    []
  );

  return (
    <div className="w-full h-full flex flex-col">
      {isLoading ? (
        <PaymentHistoryTableSkeleton />
      ) : (
        <DataTable
          columns={columns}
          data={data}
          pageCount={pageCount}
          pagination={pagination}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onPaginationChange={onPaginationChange as OnChangeFn<any>}
          className="border-none flex-1"
        >
          {() => null}
        </DataTable>
      )}
    </div>
  );
}


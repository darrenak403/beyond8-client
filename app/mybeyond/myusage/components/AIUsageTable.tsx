"use client";

import { DataTable } from "@/components/ui/data-table";
import { ColumnDef, PaginationState, OnChangeFn } from "@tanstack/react-table";
import { format } from "date-fns";
import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Server, Clock, CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AIUsageRecord } from "@/hooks/useAI";
import { AIUsageTableSkeleton } from "./AIUsageTableSkeleton";

interface AIUsageTableProps {
    data: AIUsageRecord[];
    isLoading: boolean;
    pageCount: number;
    pagination: PaginationState;
    onPaginationChange: OnChangeFn<PaginationState>;
}

export function AIUsageTable({ data, isLoading, pageCount, pagination, onPaginationChange }: AIUsageTableProps) {
    const columns = useMemo<ColumnDef<AIUsageRecord>[]>(() => [
        {
            accessorKey: "model",
            header: "Model",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-md bg-purple-50 text-purple-600">
                        <Server className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-medium text-gray-700">{row.getValue("model")}</span>
                </div>
            ),
        },
        {
            accessorKey: "operation",
            header: "Hoạt động",
            cell: ({ row }) => (
                <div className="font-medium text-sm text-gray-900">{row.getValue("operation")}</div>
            ),
        },
        {
            accessorKey: "tokens",
            header: "Mức độ sử dụng Token",
            cell: ({ row }) => {
                const record = row.original;
                return (
                    <div className="flex gap-3 text-xs">
                        <div className="flex flex-col">
                            <span className="text-gray-500 text-[10px] uppercase font-semibold">Input</span>
                            <span className="text-[#f4449b] font-mono font-medium">{record.inputTokens}</span>
                        </div>
                        <div className="w-px h-8 bg-gray-100 mx-1" />
                        <div className="flex flex-col">
                            <span className="text-gray-500 text-[10px] uppercase font-semibold">Output</span>
                            <span className="text-[#ad1c9a] font-mono font-medium">{record.outputTokens}</span>
                        </div>
                        <div className="w-px h-8 bg-gray-100 mx-1" />
                        <div className="flex flex-col">
                            <span className="text-gray-500 text-[10px] uppercase font-semibold">Tổng</span>
                            <span className="text-gray-900 font-mono font-bold">{record.totalTokens}</span>
                        </div>
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
                const status = row.getValue("status") as string;
                const isSuccess = status === "Success";
                return (
                    <Badge 
                        variant="outline" 
                        className={cn(
                            "gap-1 pl-1 pr-2.5 py-0.5 border-transparent",
                            isSuccess 
                                ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100" 
                                : "bg-red-50 text-red-700 hover:bg-red-100"
                        )}
                    >
                        {isSuccess ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {isSuccess ? "Thành công" : "Thất bại"}
                    </Badge>
                )
            },
        }
    ], []);

    return (
        <div className="w-full h-full">
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Chi tiết hoạt động</h3>
                <p className="text-sm text-gray-500 opacity-90">Danh sách các yêu cầu gần đây</p>
            </div>
            
            <div>
                {isLoading ? (
                    <AIUsageTableSkeleton />
                ) : (
                     <DataTable
                        columns={columns}
                        data={data}
                        pageCount={pageCount}
                        pagination={pagination}
                        onPaginationChange={onPaginationChange}
                        className="border-none"
                        fullHeight={false}
                    >
                        {() => null}
                    </DataTable>
                )}
            </div>
        </div>
    );
}

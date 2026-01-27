"use client";

import { useAIUsageHistory } from "@/hooks/useAI";
import { PaginationState } from "@tanstack/react-table";
import { useEffect, useMemo } from "react";
import { AIUsageTable } from "./components/AIUsageTable";
import { AIUsageChart } from "./components/AIUsageChart";
import { AITotalTokensChart } from "./components/AITotalTokensChart";
import { AICostChart } from "./components/AICostChart";
import { StatCardAnimated } from "./components/StatCardAnimated";
import { Activity, Zap, Coins } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AIUsagePage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const pageIndex = parseInt(searchParams.get("pageNumber") || "1") - 1;
    const pageSize = parseInt(searchParams.get("pageSize") || "10");
    const isDescending = searchParams.get("isDescending") !== "false"; 

    const pagination = useMemo(() => ({
        pageIndex,
        pageSize,
    }), [pageIndex, pageSize]);

    // Update URL helper
    const updateUrl = (newPagination: PaginationState) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("pageNumber", (newPagination.pageIndex + 1).toString());
        params.set("pageSize", newPagination.pageSize.toString());
        params.set("isDescending", isDescending.toString());
        router.push(`/mybeyond?${params.toString()}`);
    };

    const onPaginationChange = (updaterOrValue: PaginationState | ((old: PaginationState) => PaginationState)) => {
        let newPagination: PaginationState;
        if (typeof updaterOrValue === 'function') {
            newPagination = updaterOrValue(pagination);
        } else {
            newPagination = updaterOrValue;
        }
        updateUrl(newPagination);
    };

    // Enforce default URL params
    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());
        let changed = false;
        if (!params.has("pageNumber")) { params.set("pageNumber", "1"); changed = true; }
        if (!params.has("pageSize")) { params.set("pageSize", "10"); changed = true; }
        if (!params.has("isDescending")) { params.set("isDescending", "true"); changed = true; }

        if (changed) {
            router.replace(`/mybeyond?${params.toString()}`);
        }
    }, [searchParams, router]);

    const { data: historyRes, isLoading } = useAIUsageHistory({
        PageNumber: pagination.pageIndex + 1,
        PageSize: pagination.pageSize,
        IsDescending: isDescending,
    });

    const historyData = useMemo(() => historyRes?.data || [], [historyRes?.data]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const metadata = historyRes?.metadata as any;
    const totalPages = metadata?.totalPages || 1;

    // Summary calculations for cards
    const stats = useMemo(() => {
        return historyData.reduce((acc, curr) => ({
            input: acc.input + (curr.inputTokens || 0),
            output: acc.output + (curr.outputTokens || 0),
            cost: acc.cost + (curr.totalCost || 0)
        }), { input: 0, output: 0, cost: 0 });
    }, [historyData]);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
            minimumFractionDigits: 0,
        }).format(value);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-4xl font-black tracking-tighter text-gray-900 uppercase">Lịch sử hoạt động AI</h2>
                    <p className="text-gray-500 font-medium">Theo dõi mức sử dụng và tối ưu hóa chi phí AI của bạn.</p>
                </div>
                <div className="flex gap-2">
                    <div className="px-4 py-2 bg-purple-50 rounded-2xl border border-purple-100">
                        <span className="text-xs font-bold text-purple-600 uppercase tracking-widest">Active Model</span>
                        <div className="text-sm font-black text-gray-900">GPT-4 Omni</div>
                    </div>
                </div>
            </div>

            {/* Stats Cards Grid - Replace Charts Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCardAnimated
                    title="Phân bổ Tokens"
                    value={(stats.input + stats.output).toLocaleString()}
                    subtext={`${stats.input.toLocaleString()} In / ${stats.output.toLocaleString()} Out`}
                    icon={Activity}
                    colorClass="text-[#f4449b]"
                    chartTitle="Token Distribution"
                    chartDescription="Phân tích tỉ lệ giữa dữ liệu đầu vào và kết quả phản hồi."
                    isLoading={isLoading}
                    detailsContent={
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-pink-50 rounded-2xl border border-pink-100">
                                    <div className="text-[10px] font-black text-pink-500 uppercase">Input Avg</div>
                                    <div className="text-xl font-black text-gray-900">{~~(stats.input / (historyData.length || 1))}</div>
                                </div>
                                <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100">
                                    <div className="text-[10px] font-black text-purple-500 uppercase">Output Avg</div>
                                    <div className="text-xl font-black text-gray-900">{~~(stats.output / (historyData.length || 1))}</div>
                                </div>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <div className="text-[10px] font-black text-gray-400 uppercase mb-1">Tỉ lệ Input/Output</div>
                                <div className="text-lg font-black text-gray-900">1 : {(stats.output / (stats.input || 1)).toFixed(2)}</div>
                            </div>
                        </div>
                    }
                >
                    <AIUsageChart data={historyData} />
                </StatCardAnimated>

                <StatCardAnimated
                    title="Tổng Tokens"
                    value={(stats.input + stats.output).toLocaleString()}
                    subtext="Lưu lượng tiêu thụ trang này"
                    icon={Zap}
                    colorClass="text-[#ad1c9a]"
                    chartTitle="Token Velocity"
                    chartDescription="Tốc độ tiêu thụ tokens dựa trên các hoạt động gần đây."
                    isLoading={isLoading}
                    detailsContent={
                        <div className="space-y-6">
                            <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl border border-purple-100">
                                <div className="text-xs font-black text-purple-600 uppercase mb-1">Tổng tiêu hao trong trang</div>
                                <div className="text-2xl font-black text-gray-900">{(stats.input + stats.output).toLocaleString()} <span className="text-sm font-bold text-gray-400">Tokens</span></div>
                                <div className="mt-4 w-full bg-white/50 h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-purple-600 h-full w-[100%]" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <div className="text-[10px] font-black text-gray-400 uppercase">Tối đa (Peak)</div>
                                    <div className="text-lg font-black text-gray-900">{Math.max(...historyData.map(d => (d.inputTokens || 0) + (d.outputTokens || 0)), 0).toLocaleString()}</div>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <div className="text-[10px] font-black text-gray-400 uppercase">Trung bình (Avg)</div>
                                    <div className="text-lg font-black text-gray-900">{~~((stats.input + stats.output) / (historyData.length || 1)).toLocaleString()}</div>
                                </div>
                            </div>
                        </div>
                    }
                >
                    <AITotalTokensChart data={historyData} />
                </StatCardAnimated>

                <StatCardAnimated
                    title="Chi phí ước tính"
                    value={formatCurrency(stats.cost)}
                    subtext="Tổng phí dựa trên tokens"
                    icon={Coins}
                    colorClass="text-[#67178d]"
                    chartTitle="Cost Efficiency"
                    chartDescription="Báo cáo chi tiết về giá trị quy đổi từ lượng tokens đã dùng."
                    isLoading={isLoading}
                    detailsContent={
                        <div className="space-y-6">
                            <div className="p-6 bg-gray-900 rounded-3xl shadow-xl">
                                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Chi phí trung bình mỗi yêu cầu</div>
                                <div className="text-2xl font-black text-emerald-400">{formatCurrency(stats.cost / (historyData.length || 1))}</div>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <div className="text-[10px] font-black text-gray-400 uppercase mb-1">Phí Tokens (Dự tính)</div>
                                <div className="text-lg font-black text-gray-900">{formatCurrency(stats.cost)}</div>
                                <p className="text-[10px] text-gray-500 font-medium mt-1">Dựa trên đơn giá model hiện tại</p>
                            </div>
                        </div>
                    }
                >
                    <AICostChart data={historyData} />
                </StatCardAnimated>
            </div>

            {/* Usage Table */}
                <AIUsageTable 
                    data={historyData} 
                    isLoading={isLoading} 
                    pageCount={totalPages}
                    pagination={pagination}
                    onPaginationChange={onPaginationChange}
                />
        </div>
    );
}

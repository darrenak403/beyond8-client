"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Pencil, Ticket, Lock, Unlock, Copy } from "lucide-react"
import { format, differenceInSeconds } from "date-fns"
import { vi } from "date-fns/locale"
import { Coupon, CouponType } from "@/lib/api/services/fetchCoupon"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils/formatCurrency"
import { toast } from "sonner"

interface CouponCardProps {
    coupon: Coupon
    index: number
    onEdit: (coupon: Coupon) => void
    onToggleStatus: (coupon: Coupon) => void
}

export function CouponCard({
    coupon,
    index,
    onEdit,
    onToggleStatus
}: CouponCardProps) {
    const [now, setNow] = useState(() => new Date())

    useEffect(() => {
        const interval = setInterval(() => {
            setNow(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const getCountdown = (value?: string | null) => {
        if (!value) return null;
        const endDate = new Date(value);
        if (Number.isNaN(endDate.getTime())) return null;
        const secondsLeft = differenceInSeconds(endDate, now);
        if (secondsLeft <= 0) return { label: "Đã hết hạn", urgent: true };

        const days = Math.floor(secondsLeft / 86400);
        const minutes = Math.floor((secondsLeft % 3600) / 60);
        const seconds = secondsLeft % 60;
        const padded = (n: number) => String(n).padStart(2, "0");
        return {
            label: `Còn ${days} ngày : ${padded(minutes)} phút : ${padded(seconds)} giây`,
            urgent: secondsLeft <= 3 * 24 * 3600,
        };
    };

    const handleSaveCoupon = async (code?: string | null) => {
        const safeCode = typeof code === "string" ? code.trim() : "";
        if (!safeCode) {
            toast.error("Không tìm thấy mã coupon để lưu.");
            return;
        }
        try {
            await navigator.clipboard.writeText(safeCode)
            toast.success(`Đã sao chép mã ${safeCode}.`);
        } catch {
            toast.error("Không thể lưu mã vào bộ nhớ tạm.");
        }
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group relative overflow-hidden rounded-2xl border border-purple-200 bg-linear-to-br from-purple-50 via-white to-pink-50 p-5 shadow-sm transition-all duration-300 hover:shadow-md"
            >
                {/* Left Gradient Strip */}
                <div className="absolute left-0 top-0 h-full w-1.5 rounded-l-2xl bg-linear-to-b from-purple-600 via-fuchsia-500 to-pink-500" />

                <div className="relative pl-3 space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start justify-between gap-3 w-full">
                            <div>
                                <div className="flex items-center gap-2">
                                    <Badge
                                        variant="outline"
                                        className="text-[10px] border-fuchsia-200 text-fuchsia-700 bg-white"
                                    >
                                        {coupon.type === CouponType.Percentage ? "Phần trăm" : "Cố định"}
                                    </Badge>
                                    <Badge
                                        variant="outline"
                                        className={`text-[10px] ${coupon.isActive
                                            ? "border-green-200 text-green-700 bg-green-50"
                                            : "border-red-200 text-red-700 bg-red-50"}`}
                                    >
                                        {coupon.isActive ? "Đang hoạt động" : "Vô hiệu hóa"}
                                    </Badge>
                                </div>
                                <div className="mt-2 text-xl font-bold font-mono tracking-wide text-slate-900 flex items-center gap-2">
                                    {coupon.code}
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleSaveCoupon(coupon.code);
                                        }}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-purple-100 rounded-md text-purple-600 cursor-pointer"
                                        title="Sao chép mã"
                                    >
                                        <Copy className="h-4 w-4" />
                                    </button>
                                </div>
                                <div className="mt-1 text-sm text-slate-500 line-clamp-2">
                                    {coupon.description ?? "Không có mô tả"}
                                </div>
                            </div>

                            <div className="flex flex-col items-end gap-3">
                                <div className="inline-flex items-center rounded-full bg-linear-to-r from-purple-600 to-fuchsia-600 px-4 py-1.5 text-base font-bold text-white shadow">
                                    {coupon.type === CouponType.Percentage ? `${coupon.value}%` : formatCurrency(coupon.value)}
                                </div>

                                {/* Actions - fade in on hover */}
                                <div className="flex items-center gap-1 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/50 backdrop-blur-sm rounded-full p-1 border border-purple-100">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => onEdit(coupon)}
                                        className="h-8 w-8 rounded-full text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                                        title="Chỉnh sửa"
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>

                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => onToggleStatus(coupon)}
                                        className={`h-8 w-8 rounded-full ${coupon.isActive ? 'text-amber-600 hover:text-amber-700 hover:bg-amber-50' : 'text-green-600 hover:text-green-700 hover:bg-green-50'}`}
                                        title={coupon.isActive ? "Vô hiệu hóa" : "Kích hoạt"}
                                    >
                                        {coupon.isActive ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full h-px bg-purple-100" />

                    {/* Details section mirroring floating panel */}
                    <div className="flex items-center justify-between text-sm text-slate-600">
                        <div className="space-y-1.5 flex-1">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-slate-900 w-24">Tối thiểu:</span>
                                <span>{coupon.minOrderAmount != null ? formatCurrency(coupon.minOrderAmount) : formatCurrency(0)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-slate-900 w-24">Giảm tối đa:</span>
                                <span>{coupon.maxDiscountAmount ? formatCurrency(coupon.maxDiscountAmount) : "Không giới hạn"}</span>
                            </div>
                        </div>

                        <div className="space-y-1.5 flex-1 text-right">
                            <div className="flex items-center gap-2 justify-end">
                                <Ticket className="h-3.5 w-3.5" />
                                <span>{coupon.usedCount} / {coupon.usageLimit || "∞"} đã dùng</span>
                            </div>
                            <div className="flex items-center gap-2 justify-end">
                                {(() => {
                                    const countdown = getCountdown(coupon.validTo);
                                    if (!countdown) return (
                                        <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-slate-100 text-slate-600">
                                            Không thời hạn
                                        </span>
                                    );
                                    const badgeClass = countdown.urgent
                                        ? "bg-red-50 text-red-700 border border-red-100"
                                        : "bg-purple-50 text-purple-700 border border-purple-100";
                                    return (
                                        <span
                                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${badgeClass}`}
                                            title={format(new Date(coupon.validTo), "dd/MM/yyyy HH:mm", { locale: vi })}
                                        >
                                            {countdown.label}
                                        </span>
                                    );
                                })()}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

        </>
    )
}

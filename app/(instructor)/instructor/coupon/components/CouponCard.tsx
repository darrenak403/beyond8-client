"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Pencil, Trash2, Ticket, Percent, BadgeDollarSign, CalendarRange, Lock, Unlock } from "lucide-react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { Coupon, CouponType } from "@/lib/api/services/fetchCoupon"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface CouponCardProps {
    coupon: Coupon
    index: number
    onEdit: (coupon: Coupon) => void
    onDelete: (coupon: Coupon) => void
    onToggleStatus: (coupon: Coupon) => void
}

export function CouponCard({
    coupon,
    index,
    onEdit,
    onDelete,
    onToggleStatus
}: CouponCardProps) {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

    // Format currency
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
    }

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group relative overflow-hidden rounded-2xl border border-brand-magenta/20 bg-white/80 p-6 shadow-lg shadow-brand-magenta/5 backdrop-blur-xl transition-all duration-300 hover:border-brand-magenta/40 hover:shadow-xl hover:shadow-brand-magenta/10"
            >
                <div className="relative z-10 space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-brand-magenta/10 p-2 text-brand-magenta">
                                {coupon.type === CouponType.Percentage ? (
                                    <Percent className="h-5 w-5" />
                                ) : (
                                    <BadgeDollarSign className="h-5 w-5" />
                                )}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold font-mono tracking-wide text-foreground">
                                    {coupon.code}
                                </h3>
                                <Badge
                                    variant="outline"
                                    className={`mt-1 ${coupon.isActive
                                        ? "bg-green-50 text-green-700 border-green-200"
                                        : "bg-red-50 text-red-700 border-red-200"}`}
                                >
                                    {coupon.isActive ? "Đang hoạt động" : "Vô hiệu hóa"}
                                </Badge>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => onToggleStatus(coupon)}
                                className="h-8 w-8 rounded-full text-muted-foreground hover:bg-brand-magenta/5 hover:text-brand-magenta"
                                title={coupon.isActive ? "Vô hiệu hóa" : "Kích hoạt"}
                            >
                                {coupon.isActive ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                            </Button>

                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => onEdit(coupon)}
                                className="h-8 w-8 rounded-full text-muted-foreground hover:bg-brand-magenta/5 hover:text-brand-magenta"
                                title="Chỉnh sửa"
                            >
                                <Pencil className="h-4 w-4" />
                            </Button>

                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsDeleteDialogOpen(true)}
                                className="h-8 w-8 rounded-full text-muted-foreground hover:bg-red-50 hover:text-red-500"
                                title="Xóa"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 gap-y-3 sm:grid-cols-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground">Giá trị:</span>
                            <span className="text-brand-magenta font-semibold">
                                {coupon.type === CouponType.Percentage ? `${coupon.value}%` : formatCurrency(coupon.value)}
                            </span>
                            {coupon.maxDiscountAmount && coupon.maxDiscountAmount > 0 && (
                                <span className="text-xs">(Tối đa {formatCurrency(coupon.maxDiscountAmount)})</span>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground">Đơn tối thiểu:</span>
                            <span>{coupon.minOrderAmount ? formatCurrency(coupon.minOrderAmount) : "Không"}</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground">Lượt dùng:</span>
                            <span className="flex items-center gap-1">
                                <Ticket className="h-3 w-3" />
                                {coupon.usedCount} / {coupon.usageLimit || "∞"}
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground">Hạn dùng:</span>
                            <span className="flex items-center gap-1">
                                <CalendarRange className="h-3 w-3" />
                                {format(new Date(coupon.validTo), "dd/MM/yyyy", { locale: vi })}
                            </span>
                        </div>
                    </div>

                    {/* Description */}
                    {coupon.description && (
                        <div className="rounded-lg border border-brand-magenta/10 bg-brand-magenta/5 p-3 text-sm">
                            <p className="text-muted-foreground line-clamp-2">
                                {coupon.description}
                            </p>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent className="border-brand-magenta/20 bg-white/95 backdrop-blur-xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl font-bold bg-gradient-to-r from-brand-magenta to-brand-purple bg-clip-text text-transparent">
                            Xác nhận xóa mã giảm giá
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-sm text-muted-foreground">
                            Bạn có chắc chắn muốn xóa mã giảm giá <span className="font-mono font-bold text-foreground">{coupon.code}</span> không? Hành động này không thể hoàn tác.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel
                            onClick={() => setIsDeleteDialogOpen(false)}
                            className="rounded-xl border-brand-magenta/20 hover:bg-brand-magenta/10 hover:text-black"
                        >
                            Hủy
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                onDelete(coupon)
                                setIsDeleteDialogOpen(false)
                            }}
                            className="rounded-xl bg-red-500 text-white hover:bg-red-600"
                        >
                            Xóa
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

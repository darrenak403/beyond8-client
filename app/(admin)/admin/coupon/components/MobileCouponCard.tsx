"use client"

import { Coupon, CouponType } from "@/lib/api/services/fetchCoupon"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Pencil, Lock, Unlock } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { format } from "date-fns"
import { vi } from "date-fns/locale"

interface MobileCouponCardProps {
    coupon: Coupon
    onEdit: () => void
    onDelete: () => void
    onToggleStatus: () => void
}

export function MobileCouponCard({
    coupon,
    onEdit,
    onDelete,
    onToggleStatus,
}: MobileCouponCardProps) {
    const isGlobal = coupon.applicableCourseId === null
    return (
        <div className="flex flex-col space-y-2 rounded-lg border p-4 shadow-sm bg-white">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <span className="font-semibold text-lg">{coupon.code}</span>
                    <Badge className={coupon.isActive ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}>
                        {coupon.isActive ? "Hoạt động" : "Vô hiệu hóa"}
                    </Badge>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                        <DropdownMenuItem onClick={onEdit} disabled={!isGlobal}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={onToggleStatus} disabled={!isGlobal}>
                            {coupon.isActive ? <Lock className="mr-2 h-4 w-4" /> : <Unlock className="mr-2 h-4 w-4" />}
                            {coupon.isActive ? "Vô hiệu hóa" : "Kích hoạt"}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm text-gray-500">
                <div>
                    <span className="font-medium">Loại:</span> {coupon.type === CouponType.Percentage ? "Phần trăm" : "Cố định"}
                </div>
                <div>
                    <span className="font-medium">Giá trị:</span> {coupon.type === CouponType.Percentage ? `${coupon.value}%` : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(coupon.value)}
                </div>
                <div>
                    <span className="font-medium">Đã dùng:</span> {coupon.usedCount} / {coupon.usageLimit || "∞"}
                </div>
                <div>
                    <span className="font-medium">Hết hạn:</span> {coupon.validTo ? format(new Date(coupon.validTo), "dd/MM/yyyy", { locale: vi }) : "-"}
                </div>
            </div>

            {coupon.description && (
                <div className="text-sm text-gray-500 mt-2">
                    <span className="font-medium">Mô tả:</span> {coupon.description}
                </div>
            )}
        </div>
    )
}

"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Coupon, CouponType } from "@/lib/api/services/fetchCoupon"
import { Badge } from "@/components/ui/badge"

import { DataTableColumnHeader } from "@/components/ui/data-table-column-header"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { Pencil, Lock, Unlock } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ColumnProps {
    onEdit: (coupon: Coupon) => void;
    onDelete: (coupon: Coupon) => void;
    onToggleStatus: (coupon: Coupon) => void;
}

export const getColumns = ({ onEdit, onDelete, onToggleStatus }: ColumnProps): ColumnDef<Coupon>[] => [

    {
        accessorKey: "code",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Mã Coupon" />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex space-x-2">
                    <Badge variant="outline" className="font-mono">
                        {row.getValue("code")}
                    </Badge>
                </div>
            )
        },
    },
    {
        accessorKey: "type",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Loại" />
        ),
        cell: ({ row }) => {
            const type = row.getValue("type") as string
            return (
                <div className="flex w-[100px] items-center">
                    <span>{type === CouponType.Percentage ? "Phần trăm" : "Số tiền cố định"}</span>
                </div>
            )
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        accessorKey: "value",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Giá trị" />
        ),
        cell: ({ row }) => {
            const type = row.original.type
            const value = row.getValue("value") as number

            return (
                <div className="flex items-center">
                    {type === CouponType.Percentage ? `${value}%` : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)}
                </div>
            )
        },
    },
    {
        accessorKey: "usage",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Đã dùng / Giới hạn" />
        ),
        cell: ({ row }) => {
            const used = row.original.usedCount
            const limit = row.original.usageLimit

            return (
                <div className="flex items-center">
                    <span>{used} / {limit ? limit : "∞"}</span>
                </div>
            )
        },
    },
    {
        accessorKey: "isActive",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Trạng thái" />
        ),
        cell: ({ row }) => {
            const isActive = row.getValue("isActive") as boolean

            return (
                <Badge className={isActive ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}>
                    {isActive ? "Hoạt động" : "Vô hiệu hóa"}
                </Badge>
            )
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        accessorKey: "validTo",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Hết hạn" />
        ),
        cell: ({ row }) => {
            const date = row.getValue("validTo") as string
            if (!date) return <span>-</span>
            return <span>{format(new Date(date), "dd/MM/yyyy", { locale: vi })}</span>
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const coupon = row.original
            const isActive = coupon.isActive
            const isGlobal = coupon.applicableCourseId === null

            return (
                <div className="flex items-center">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-blue-600/10 hover:text-blue-600"
                        onClick={() => onEdit(coupon)}
                        title={isGlobal ? "Chỉnh sửa" : "Chỉ có thể chỉnh sửa coupon toàn cục"}
                        disabled={!isGlobal}
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className={isActive ? "text-destructive hover:bg-destructive/10 hover:text-destructive" : "text-green-600 hover:bg-green-100 hover:text-green-700"}
                        onClick={() => onToggleStatus(coupon)}
                        title={isGlobal ? (isActive ? "Vô hiệu hóa" : "Kích hoạt") : "Chỉ có thể thao tác với coupon toàn cục"}
                        disabled={!isGlobal}
                    >
                        {isActive ? (
                            <Lock className="h-4 w-4" />
                        ) : (
                            <Unlock className="h-4 w-4" />
                        )}
                    </Button>
                </div>
            )
        },
    },
]

"use client"

import { Table } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, RotateCw, X } from "lucide-react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { CouponType } from "@/lib/api/services/fetchCoupon"
import { useIsMobile } from "@/hooks/useMobile"
import { useState, useEffect } from "react"

interface CouponTableToolbarProps<TData> {
    table: Table<TData>
    onAdd: () => void
    onRefresh: () => void
    isFetching: boolean
}

export function CouponTableToolbar<TData>({
    table,
    onAdd,
    onRefresh,
    isFetching,
}: CouponTableToolbarProps<TData>) {
    const isMobile = useIsMobile()
    const isFiltered = table.getState().columnFilters.length > 0
    const column = table.getColumn("type")

    // Manage local search state to match UserTableToolbar pattern
    const codeColumn = table.getColumn("code")
    const initialSearchValue = (codeColumn?.getFilterValue() as string) ?? ""
    const [inputValue, setInputValue] = useState(initialSearchValue)

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setInputValue((codeColumn?.getFilterValue() as string) ?? "")
    }, [codeColumn?.getFilterValue()]) // Sync if filter changes externally

    const handleSearch = () => {
        codeColumn?.setFilterValue(inputValue)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSearch()
        }
    }

    const types = [
        {
            value: CouponType.Percentage,
            label: "Phần trăm",
        },
        {
            value: CouponType.FixedAmount,
            label: "Số tiền cố định",
        },
    ]

    return (
        <div className="sticky top-0 md:top-[42px] z-20 bg-white/95 backdrop-blur pb-4 pt-2 flex items-center gap-2 w-full">
            {/* Search - Flexible width */}
            <div className="relative flex-1 min-w-0">
                <Input
                    placeholder={isMobile ? "Mã coupon..." : "Tìm kiếm theo mã..."}
                    value={inputValue}
                    onChange={(event) => setInputValue(event.target.value)}
                    onKeyDown={handleKeyDown}
                    className="pr-8 md:pr-10 h-9 bg-white border-slate-200 rounded-full shadow-sm w-full"
                />
                <Button
                    onClick={handleSearch}
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full"
                >
                    <Search className="h-3 w-3 md:h-4 md:w-4" />
                </Button>
            </div>

            {/* Type Filter */}
            {column && (
                <div className={`${isMobile ? "w-[110px]" : "w-[150px]"} shrink-0`}>
                    <Select
                        value={(column.getFilterValue() as string) ?? "ALL"}
                        onValueChange={(value) => column.setFilterValue(value === "ALL" ? undefined : value)}
                    >
                        <SelectTrigger className="h-9 rounded-full border-slate-200 shadow-sm bg-white px-3">
                            <SelectValue placeholder="Loại" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">Tất cả</SelectItem>
                            {types.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                    {type.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            )}

            {isFiltered && (
                <Button
                    variant="ghost"
                    onClick={() => table.resetColumnFilters()}
                    className="h-9 w-9 rounded-full shrink-0 p-0"
                    title="Reset filters"
                >
                    <X className="h-4 w-4" />
                </Button>
            )}

            {/* Add Button */}
            <Button
                onClick={onAdd}
                className={`h-9 rounded-full shadow-sm whitespace-nowrap shrink-0 ${isMobile ? "w-9 p-0" : "px-4 gap-2"}`}
                size={isMobile ? "icon" : "default"}
            >
                <Plus className="h-4 w-4" />
                {!isMobile && "Tạo mới"}
            </Button>

            {/* Refresh Button */}
            <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-full shrink-0 border-slate-200 shadow-sm bg-white"
                onClick={onRefresh}
                disabled={isFetching}
            >
                <RotateCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
            </Button>
        </div>
    )
}

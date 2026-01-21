"use client"

import { Table } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Cross, Search, Plus } from "lucide-react"

interface UserTableToolbarProps<TData> {
    table: Table<TData>
    onAdd: () => void
}

export function UserTableToolbar<TData>({
    table,
    onAdd,
}: UserTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0

    return (
        <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Tìm kiếm ..."
                    value={(table.getColumn("fullName")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("fullName")?.setFilterValue(event.target.value)
                    }
                    className="pl-10 h-9 bg-white border-slate-200 rounded-full shadow-sm"
                />
            </div>

            {/* Reset Filter */}
            {isFiltered && (
                <Button
                    variant="ghost"
                    onClick={() => table.resetColumnFilters()}
                    className="h-9 px-4 gap-2 border-slate-200 text-slate-700 hover:bg-slate-50 rounded-full"
                >
                    Đặt lại
                    <Cross className="h-4 w-4" />
                </Button>
            )}

            {/* Count */}
            <div className="text-sm font-medium text-slate-500 whitespace-nowrap px-2">
                Tổng số: <strong>{table.getFilteredRowModel().rows.length}</strong> thành viên
            </div>

            {/* Add User Button */}
            <Button
                onClick={onAdd}
                className="h-9 px-4 gap-2 rounded-full shadow-sm"
            >
                <Plus className="h-4 w-4" />
                Thêm người dùng
            </Button>
        </div>
    )
}

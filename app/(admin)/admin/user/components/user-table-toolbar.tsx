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
        <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center space-x-2">
                <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Tìm kiếm ..."
                        value={(table.getColumn("fullName")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("fullName")?.setFilterValue(event.target.value)
                        }
                        className="h-8 w-[150px] lg:w-[250px] pl-8"
                    />
                </div>
                {isFiltered && (
                    <Button
                        variant="ghost"
                        onClick={() => table.resetColumnFilters()}
                        className="h-8 px-2 lg:px-3"
                    >
                        Đặt lại
                        <Cross className="ml-2 h-4 w-4" />
                    </Button>
                )}
                <div className="text-sm text-muted-foreground ml-2">
                    Tổng số: <strong>{table.getFilteredRowModel().rows.length}</strong> thành viên
                </div>
            </div>

            <Button size="sm" className="h-8" onClick={onAdd}>
                <Plus className="mr-2 h-4 w-4" />
                Thêm người dùng
            </Button>
            {/* <DataTableViewOptions table={table} /> */}
        </div>
    )
}

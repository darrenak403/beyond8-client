"use client"

import { Table } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus } from "lucide-react"

import { useIsMobile } from "@/hooks/useMobile"



interface UserTableToolbarProps<TData> {
    table: Table<TData>
    onAdd: () => void
    searchValue: string
    onSearchChange: (value: string) => void
}

export function UserTableToolbar<TData>({
    table,
    onAdd,
    searchValue,
    onSearchChange,
}: UserTableToolbarProps<TData>) {
    const isFiltered = searchValue.length > 0 || table.getState().columnFilters.length > 0
    const isMobile = useIsMobile()

    return (
        <div className="flex items-center gap-2 md:gap-4 flex-wrap">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Tìm kiếm theo tên..."
                    value={searchValue}
                    onChange={(event) =>
                        onSearchChange(event.target.value)
                    }
                    className="pl-10 h-9 bg-white border-slate-200 rounded-full shadow-sm w-full"
                />
            </div>

            {/* Role Filter */}
            {/* <div className="w-[150px]">
                <Select
                    value={roleFilter === "" ? "ALL" : roleFilter}
                    onValueChange={(value) => onRoleChange(value === "ALL" ? "" : value)}
                >
                    <SelectTrigger className="h-9 rounded-full border-slate-200 shadow-sm bg-white">
                        <SelectValue placeholder="Vai trò" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">Tất cả</SelectItem>
                        <SelectItem value="ROLE_ADMIN">Admin</SelectItem>
                        <SelectItem value="ROLE_INSTRUCTOR">Giảng viên</SelectItem>
                        <SelectItem value="ROLE_STUDENT">Học sinh</SelectItem>
                        <SelectItem value="ROLE_STAFF">Nhân viên</SelectItem>
                    </SelectContent>
                </Select>
            </div> */}

            <div className="flex items-center gap-2">
                {/* Reset Filter */}
                {isFiltered && (
                    <Button
                        variant="ghost"
                        onClick={() => {
                            table.resetColumnFilters()
                            onSearchChange("")
                        }}
                        className="h-9 px-2 md:px-4 gap-2 border-slate-200 text-slate-700 hover:bg-slate-50 rounded-full whitespace-nowrap"
                    >
                        {/* {isMobile ? <Cross className="h-4 w-4" /> : (
                            <>
                                Đặt lại
                                <Cross className="h-4 w-4" />
                            </>
                        )} */}
                    </Button>
                )}

                {/* Count - Hidden on Mobile */}
                {!isMobile && (
                    <div className="text-sm font-medium text-slate-500 whitespace-nowrap px-2">
                        Tổng số: <strong>{table.getFilteredRowModel().rows.length}</strong> thành viên
                    </div>
                )}

                {/* Add User Button - Icon only on mobile */}
                <Button
                    onClick={onAdd}
                    className="h-9 px-4 gap-2 rounded-full shadow-sm whitespace-nowrap md:ml-0"
                    size={isMobile ? "icon" : "default"}
                >
                    <Plus className="h-4 w-4" />
                    {!isMobile && "Thêm người dùng"}
                </Button>
            </div>
        </div>
    )
}

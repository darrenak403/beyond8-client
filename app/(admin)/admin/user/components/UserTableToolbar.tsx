"use client"

import { Table } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus } from "lucide-react"

import { useIsMobile } from "@/hooks/useMobile"
import { useEffect, useState } from "react"

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
    const isMobile = useIsMobile()
    const [inputValue, setInputValue] = useState(searchValue)

    // Sync local state with parent state (e.g. when reset is clicked)
    useEffect(() => {
        setInputValue(searchValue)
    }, [searchValue])

    const handleSearch = () => {
        onSearchChange(inputValue)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSearch()
        }
    }

    return (
        <div className="flex items-center gap-2 md:gap-4 flex-wrap">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
                <Input
                    placeholder="Tìm kiếm theo tên..."
                    value={inputValue}
                    onChange={(event) => setInputValue(event.target.value)}
                    onKeyDown={handleKeyDown}
                    className="pr-10 h-9 bg-white border-slate-200 rounded-full shadow-sm w-full"
                />
                <Button
                    onClick={handleSearch}
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full"
                >
                    <Search className="h-4 w-4" />
                </Button>
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

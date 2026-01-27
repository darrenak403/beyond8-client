"use client"

import { Table } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, RotateCw } from "lucide-react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { useIsMobile } from "@/hooks/useMobile"
import { useEffect, useState } from "react"

interface UserTableToolbarProps {
    onAdd: () => void
    searchValue: string
    onSearchChange: (value: string) => void
    roleFilter: string
    onRoleChange: (value: string) => void
    onRefresh: () => void
    isFetching: boolean
}

export function UserTableToolbar({
    onAdd,
    searchValue,
    onSearchChange,
    roleFilter,
    onRoleChange,
    onRefresh,
    isFetching,
}: UserTableToolbarProps) {
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
        <div className="sticky top-0 md:top-[42px] z-20 bg-white/95 backdrop-blur pb-4 pt-2 flex items-center gap-2 w-full">
            {/* Search - Flexible width */}
            <div className="relative flex-1 min-w-0">
                <Input
                    placeholder={isMobile ? "Email..." : "Tìm kiếm theo email..."}
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

            {/* Role Filter */}
            <div className={`${isMobile ? "w-[110px]" : "w-[150px]"} shrink-0`}>
                <Select
                    value={roleFilter === "" ? "ALL" : roleFilter}
                    onValueChange={(value) => onRoleChange(value === "ALL" ? "" : value)}
                >
                    <SelectTrigger className="h-9 rounded-full border-slate-200 shadow-sm bg-white px-3">
                        <SelectValue placeholder="Vai trò" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">Tất cả</SelectItem>
                        <SelectItem value="ROLE_ADMIN">Admin</SelectItem>
                        <SelectItem value="ROLE_INSTRUCTOR">Giảng viên</SelectItem>
                        <SelectItem value="ROLE_STUDENT">Học viên</SelectItem>
                        <SelectItem value="ROLE_STAFF">Nhân viên</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Add Button */}
            <Button
                onClick={onAdd}
                className={`h-9 rounded-full shadow-sm whitespace-nowrap shrink-0 ${isMobile ? "w-9 p-0" : "px-4 gap-2"}`}
                size={isMobile ? "icon" : "default"}
            >
                <Plus className="h-4 w-4" />
                {!isMobile && "Thêm người dùng"}
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

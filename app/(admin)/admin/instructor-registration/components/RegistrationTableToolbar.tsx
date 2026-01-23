"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Cross, Search } from "lucide-react";
import { useIsMobile } from "@/hooks/useMobile";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface RegistrationTableToolbarProps {
    searchValue: string;
    onSearchChange: (value: string) => void;
    statusFilter: string;
    onStatusChange: (value: string) => void;
}

export function RegistrationTableToolbar({
    searchValue,
    onSearchChange,
    statusFilter,
    onStatusChange,
}: RegistrationTableToolbarProps) {
    const isMobile = useIsMobile();

    return (
        <div className="flex items-center gap-2 md:gap-4 flex-wrap">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Tìm kiếm giảng viên..."
                    value={searchValue}
                    onChange={(event) => onSearchChange(event.target.value)}
                    className="pl-10 h-9 bg-white border-slate-200 rounded-full shadow-sm w-full"
                />
            </div>

            {/* Status Filter */}
            <div className="w-[180px]">
                <Select
                    value={statusFilter}
                    onValueChange={onStatusChange}
                >
                    <SelectTrigger className="h-9 rounded-full border-slate-200 shadow-sm bg-white">
                        <SelectValue placeholder="Trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">Tất cả</SelectItem>
                        <SelectItem value="Pending">Chờ duyệt</SelectItem>
                        <SelectItem value="Verified">Đã duyệt</SelectItem>
                        <SelectItem value="Rejected">Đã từ chối</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}

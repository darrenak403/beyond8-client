"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";

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
    const [inputValue, setInputValue] = useState(searchValue);

    // Sync local state with parent state
    useEffect(() => {
        setInputValue(searchValue);
    }, [searchValue]);

    const handleSearch = () => {
        onSearchChange(inputValue);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <div className="flex items-center gap-2 md:gap-4 flex-wrap">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
                <Input
                    placeholder="Tìm kiếm theo email..."
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

            {/* Status Filter */}
            <div className="w-[180px]">
                <Select
                    value={statusFilter === "" ? "ALL" : statusFilter}
                    onValueChange={(value) => onStatusChange(value === "ALL" ? "" : value)}
                >
                    <SelectTrigger className="h-9 rounded-full border-slate-200 shadow-sm bg-white">
                        <SelectValue placeholder="Trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">Tất cả</SelectItem>
                        <SelectItem value="Pending">Chờ duyệt</SelectItem>
                        <SelectItem value="Verified">Đã duyệt</SelectItem>
                        <SelectItem value="RequestUpdate">Yêu cầu cập nhật</SelectItem>
                        <SelectItem value="Recovering">Yêu cầu khôi phục</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}

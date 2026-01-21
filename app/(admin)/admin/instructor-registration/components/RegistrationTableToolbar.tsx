"use client";

import { Table } from "@tanstack/react-table";
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

interface RegistrationTableToolbarProps<TData> {
    table: Table<TData>;
}

export function RegistrationTableToolbar<TData>({
    table,
}: RegistrationTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0;
    const isMobile = useIsMobile();

    return (
        <div className="flex items-center gap-2 md:gap-4 flex-wrap">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Tìm kiếm ứng viên..."
                    value={
                        (table.getColumn("user_fullName")?.getFilterValue() as string) ?? ""
                    }
                    onChange={(event) =>
                        table.getColumn("user_fullName")?.setFilterValue(event.target.value)
                    }
                    className="pl-10 h-9 bg-white border-slate-200 rounded-full shadow-sm w-full"
                />
            </div>

            {/* Status Filter */}
            <div className="w-[180px]">
                <Select
                    value={
                        (table.getColumn("verificationStatus")?.getFilterValue() as string) ??
                        "all"
                    }
                    onValueChange={(value) =>
                        table
                            .getColumn("verificationStatus")
                            ?.setFilterValue(value === "all" ? undefined : value)
                    }
                >
                    <SelectTrigger className="h-9 rounded-full border-slate-200 shadow-sm bg-white">
                        <SelectValue placeholder="Trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        <SelectItem value="Pending">Chờ duyệt</SelectItem>
                        <SelectItem value="Approved">Đã duyệt</SelectItem>
                        <SelectItem value="Rejected">Đã từ chối</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Reset Filter */}
            {isFiltered && (
                <Button
                    variant="ghost"
                    onClick={() => table.resetColumnFilters()}
                    className="h-9 px-2 md:px-4 gap-2 border-slate-200 text-slate-700 hover:bg-slate-50 rounded-full whitespace-nowrap"
                >
                    {isMobile ? (
                        <Cross className="h-4 w-4" />
                    ) : (
                        <>
                            Đặt lại
                            <Cross className="h-4 w-4" />
                        </>
                    )}
                </Button>
            )}
        </div>
    );
}

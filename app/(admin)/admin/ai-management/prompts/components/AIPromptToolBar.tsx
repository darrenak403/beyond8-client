"use client"

import { Button } from "@/components/ui/button"
import { Plus, RotateCw } from "lucide-react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { useIsMobile } from "@/hooks/useMobile"

interface AIPromptToolBarProps {
    onAdd: () => void
    sortFilter: string
    onSortChange: (value: string) => void
    onRefresh: () => void
    isFetching: boolean
}

export function AIPromptToolBar({
    onAdd,
    sortFilter,
    onSortChange,
    onRefresh,
    isFetching,
}: AIPromptToolBarProps) {
    const isMobile = useIsMobile()

    return (
        <div className="sticky top-0 md:top-[42px] z-20 bg-white/95 backdrop-blur pb-4 pt-2 flex items-center justify-between gap-2 w-full">
            <div className="flex items-center gap-2">
                 {/* Sort Filter (IsDescending) */}
                <div className={`${isMobile ? "w-[130px]" : "w-[160px]"} shrink-0`}>
                    <Select
                        value={sortFilter}
                        onValueChange={onSortChange}
                    >
                        <SelectTrigger className="h-9 rounded-full border-slate-200 shadow-sm bg-white px-3">
                            <SelectValue placeholder="Sắp xếp" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="true">Mới nhất</SelectItem>
                            <SelectItem value="false">Cũ nhất</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
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

            {/* Add Button */}
            <Button
                onClick={onAdd}
                className={`h-9 rounded-full shadow-sm whitespace-nowrap shrink-0 ${isMobile ? "w-9 p-0" : "px-4 gap-2"}`}
                size={isMobile ? "icon" : "default"}
            >
                <Plus className="h-4 w-4" />
                {!isMobile && "Tạo Prompt"}
            </Button>
        </div>
    )
}

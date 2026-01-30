"use client"

import { Button } from "@/components/ui/button"
import { Plus, RotateCw, Search, LayoutGrid, ListIcon } from "lucide-react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useIsMobile } from "@/hooks/useMobile"
import { motion } from 'framer-motion'

interface AIPromptToolBarProps {
    onAdd: () => void
    sortFilter: string
    onSortChange: (value: string) => void
    onRefresh: () => void
    isFetching: boolean
    searchTerm: string
    onSearchChange: (value: string) => void
    viewMode: 'list' | 'grid'
    onViewModeChange: (mode: 'list' | 'grid') => void
}

export function AIPromptToolBar({
    onAdd,
    sortFilter,
    onSortChange,
    onRefresh,
    isFetching,
    searchTerm,
    onSearchChange,
    viewMode,
    onViewModeChange,
}: AIPromptToolBarProps) {
    const isMobile = useIsMobile()

    return (
        <div className="sticky top-0 md:top-[42px] z-20 bg-white/95 backdrop-blur pb-4 pt-2 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 w-full border-b border-transparent md:border-none">

            <div className="flex items-center gap-2 w-full md:w-auto flex-1">
                {/* Search Input */}
                <div className="relative w-full md:w-[300px]">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Tìm kiếm prompt..."
                        className="pl-9 h-9 bg-white border-slate-200 rounded-full w-full"
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>

                {/* Sort Filter (IsDescending) */}
                <div className={`${isMobile ? "w-[130px]" : "w-[160px]"} shrink-0 hidden md:block`}>
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
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">

                {/* Mobile Sort (Visible only on mobile) */}
                <div className={`${isMobile ? "w-[140px]" : "w-[160px]"} shrink-0 md:hidden`}>
                    <Select
                        value={sortFilter}
                        onValueChange={onSortChange}
                    >
                        <SelectTrigger className="h-9 rounded-full border-slate-200 shadow-sm bg-white px-3 text-xs">
                            <SelectValue placeholder="Sắp xếp" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="true">Mới nhất</SelectItem>
                            <SelectItem value="false">Cũ nhất</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center gap-2">
                    {/* View Toggle */}
            {!isMobile && (
                <div className="flex items-center p-1 bg-white rounded-full border border-slate-200 h-9 shadow-sm px-1 gap-1">
                    <button
                        onClick={() => onViewModeChange('grid')}
                        className={`relative p-2 rounded-full transition-colors duration-200 ${viewMode === 'grid'
                            ? 'text-white'
                            : 'text-slate-400 hover:text-slate-600'
                            }`}
                    >
                        {viewMode === 'grid' && (
                            <motion.div
                                layoutId="viewMode-active"
                                className="absolute inset-0 bg-slate-900 rounded-full shadow-sm"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        <span className="relative z-10">
                            <LayoutGrid className="w-4 h-4" />
                        </span>
                    </button>

                    <button
                        onClick={() => onViewModeChange('list')}
                        className={`relative p-2 rounded-full transition-colors duration-200 ${viewMode === 'list'
                            ? 'text-white'
                            : 'text-slate-400 hover:text-slate-600'
                            }`}
                    >
                        {viewMode === 'list' && (
                            <motion.div
                                layoutId="viewMode-active"
                                className="absolute inset-0 bg-slate-900 rounded-full shadow-sm"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        <span className="relative z-10">
                            <ListIcon className="w-4 h-4" />
                        </span>
                    </button>
                </div>
            )}

                    {/* Refresh Button */}
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 rounded-full shrink-0 border-slate-200 shadow-sm bg-white"
                        onClick={onRefresh}
                        disabled={isFetching}
                        title="Làm mới"
                    >
                        <RotateCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
                    </Button>

                    {/* Add Button */}
                    <Button
                        onClick={onAdd}
                        className={`h-9 rounded-full shadow-sm whitespace-nowrap shrink-0 ${isMobile ? "w-9 p-0" : "px-4 gap-2"}`}
                        size={isMobile ? "icon" : "default"}
                        title="Tạo Prompt"
                    >
                        <Plus className="h-4 w-4" />
                        {!isMobile && "Tạo Prompt"}
                    </Button>
                </div>
            </div>
        </div>
    )
}


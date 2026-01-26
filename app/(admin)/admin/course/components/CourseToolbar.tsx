'use client'

import {
    Search,
    LayoutGrid,
    List as ListIcon,
    SlidersHorizontal,
    RotateCw,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface CourseToolbarProps {
    viewMode: 'grid' | 'list'
    setViewMode: (mode: 'grid' | 'list') => void
    searchQuery: string
    setSearchQuery: (query: string) => void
    totalCount: number
    isMobile: boolean
    onRefresh: () => void
    isLoading: boolean
}

export default function CourseToolbar({
    viewMode,
    setViewMode,
    searchQuery,
    setSearchQuery,
    totalCount,
    isMobile,
    onRefresh,
    isLoading
}: CourseToolbarProps) {
    return (
        <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Tìm môi giới (theo tên, email, số điện thoại)..."
                    className="pl-10 h-9 bg-white border-slate-200 rounded-full shadow-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Filter Button */}
            <Button variant="outline" className="h-9 px-4 gap-2 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 rounded-full shadow-sm">
                <SlidersHorizontal className="w-4 h-4" />
                Bộ lọc
            </Button>

            {/* View Toggle */}
            {!isMobile && (
                <div className="flex items-center p-1 bg-white rounded-full border border-slate-200 h-9 shadow-sm px-1 gap-1">
                    <button
                        onClick={() => setViewMode('grid')}
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
                        onClick={() => setViewMode('list')}
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

            {/* Count */}
            <div className="text-sm font-medium text-slate-500 whitespace-nowrap px-2">
                {totalCount} khóa học
            </div>

            {/* Sort */}
            <Select defaultValue="newest">
                <SelectTrigger className="w-[150px] h-9 bg-white border-slate-200 rounded-full shadow-sm">
                    <SelectValue placeholder="Sắp xếp" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="newest">Ngày tạo</SelectItem>
                    <SelectItem value="price-asc">Giá tăng dần</SelectItem>
                    <SelectItem value="price-desc">Giá giảm dần</SelectItem>
                </SelectContent>
            </Select>

            {/* Refresh Button - Moved to end */}
            <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-full shrink-0 border-slate-200 shadow-sm bg-white"
                onClick={onRefresh}
                disabled={isLoading}
            >
                <RotateCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
        </div>
    )
}

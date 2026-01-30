import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { SlidersHorizontal, X, Star } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { CourseLevel, CourseStatus } from "@/lib/api/services/fetchCourse"

const SUGGESTED_LANGUAGES = [
    "Tiếng Việt", "English", "日本語", "한국어", "简体中文", "繁體中文",
    "Français", "Deutsch", "Español", "Português", "Italiano", "Русский"
]

interface CourseFilterSheetProps {
    activeFilterCount?: number
}

export function CourseFilterSheet({ activeFilterCount = 0 }: CourseFilterSheetProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [open, setOpen] = useState(false)
    const [isClosing, setIsClosing] = useState(false)

    // Local state for filters
    const [level, setLevel] = useState<string>(searchParams.get("level") || "All")
    const [status, setStatus] = useState<string>(searchParams.get("status") || "All")
    const [minRating, setMinRating] = useState<string>(searchParams.get("minRating") || "all")
    const [language, setLanguage] = useState<string>(searchParams.get("language") || "")
    const [pageSize, setPageSize] = useState<string>(searchParams.get("pageSize") || "8")
    const [isDescending, setIsDescending] = useState<boolean>(searchParams.get("isDescending") !== "false")
    const [sortBy, setSortBy] = useState<string>(searchParams.get("sortBy") || "createdDate")

    // Price state for Slider (Range)
    const MAX_PRICE = 5000000
    const [priceRange, setPriceRange] = useState<[number, number]>([
        parseInt(searchParams.get("minPrice") || "0"),
        parseInt(searchParams.get("maxPrice") || MAX_PRICE.toString())
    ])

    // Update local state when URL params change
    useEffect(() => {
        const newLevel = searchParams.get("level") || "All"
        if (level !== newLevel) setLevel(newLevel)

        const newStatus = searchParams.get("status") || "All"
        if (status !== newStatus) setStatus(newStatus)

        const newMinRating = searchParams.get("minRating") || "all"
        if (minRating !== newMinRating) setMinRating(newMinRating)

        const newLanguage = searchParams.get("language") || ""
        if (language !== newLanguage) setLanguage(newLanguage)

        const newPageSize = searchParams.get("pageSize") || "8"
        if (pageSize !== newPageSize) setPageSize(newPageSize)

        const newIsDescending = searchParams.get("isDescending") !== "false"
        if (isDescending !== newIsDescending) setIsDescending(newIsDescending)

        const newSortBy = searchParams.get("sortBy") || "createdDate"
        if (sortBy !== newSortBy) setSortBy(newSortBy)

        const newMinPrice = parseInt(searchParams.get("minPrice") || "0")
        const newMaxPrice = parseInt(searchParams.get("maxPrice") || MAX_PRICE.toString())
        if (priceRange[0] !== newMinPrice || priceRange[1] !== newMaxPrice) {
            setPriceRange([newMinPrice, newMaxPrice])
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams])

    const handleClose = () => {
        setIsClosing(true)
    }

    const handleOpenChange = (newOpen: boolean) => {
        if (!newOpen) {
            // If closing, trigger animation instead of closing immediately
            handleClose()
        } else {
            setOpen(newOpen)
        }
    }

    const handleApply = () => {
        const params = new URLSearchParams(searchParams.toString())

        if (level && level !== "All") params.set("level", level)
        else if (level === "All") params.set("level", "All")

        if (status && status !== "All") params.set("status", status)
        else params.delete("status")

        // Price
        if (priceRange[0] > 0) params.set("minPrice", priceRange[0].toString())
        else params.delete("minPrice")

        if (priceRange[1] < MAX_PRICE) params.set("maxPrice", priceRange[1].toString())
        else params.delete("maxPrice")

        if (minRating && minRating !== "all") params.set("minRating", minRating)
        else params.delete("minRating")

        if (language) params.set("language", language)
        else params.delete("language")

        params.set("pageSize", pageSize)
        params.set("isDescending", isDescending.toString())
        params.set("sortBy", sortBy)

        params.set("pageNumber", "1")

        router.push(`?${params.toString()}`)
        // Trigger exit animation before closing
        handleClose()
    }

    const handleReset = () => {
        setLevel("All")
        setStatus("All")
        setMinRating("all")
        setLanguage("")
        setPageSize("8")
        setIsDescending(true)
        setSortBy("createdDate")
        setPriceRange([0, MAX_PRICE])
    }

    // Formatting currency
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
    }

    const priceQuickFilters = [
        { label: "Dưới 200k", min: 0, max: 200000 },
        { label: "200k - 500k", min: 200000, max: 500000 },
        { label: "500k - 1tr", min: 500000, max: 1000000 },
        { label: "Trên 1tr", min: 1000000, max: MAX_PRICE },
    ]

    return (
        <Sheet open={open} onOpenChange={handleOpenChange}>
            <SheetTrigger asChild>
                <Button
                    variant="outline"
                    className={`relative h-10 px-4 gap-2 rounded-2xl hover:text-black ${
                        activeFilterCount > 0
                            ? 'border-brand-magenta bg-purple-50 hover:bg-purple-100'
                            : 'border-border bg-white hover:bg-muted'
                    }`}
                >
                    <SlidersHorizontal className={`w-4 h-4 ${
                        activeFilterCount > 0 ? 'text-brand-magenta' : ''
                    }`} />
                    <span className="hidden md:inline">Bộ lọc</span>
                    {activeFilterCount > 0 && (
                        <Badge
                            variant="default"
                            className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-brand-magenta hover:bg-brand-magenta text-white text-xs rounded-full"
                        >
                            {activeFilterCount}
                        </Badge>
                    )}
                </Button>
            </SheetTrigger>
            <SheetContent
                forceMount
                className="h-full w-full sm:max-w-md p-0 bg-transparent border-none shadow-none data-[state=open]:animate-none data-[state=closed]:animate-none pointer-events-none [&>button]:hidden"
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key="filter-sheet"
                        initial={{ x: "100%" }}
                        animate={isClosing ? { x: "100%" } : { x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        onAnimationComplete={() => {
                            if (isClosing) {
                                setOpen(false)
                                setIsClosing(false)
                            }
                        }}
                        className="flex flex-col h-full w-full bg-background shadow-lg border-l pointer-events-auto relative"
                    >
                            <SheetClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
                                <X className="h-4 w-4" />
                                <span className="sr-only">Close</span>
                            </SheetClose>
                            <div className="p-6 pb-0">
                                <SheetHeader>
                                    <SheetTitle>Bộ lọc tìm kiếm</SheetTitle>
                                    <SheetDescription>
                                        Tùy chỉnh kết quả tìm kiếm theo nhu cầu của bạn.
                                    </SheetDescription>
                                </SheetHeader>
                            </div>

                            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-transparent hover:[&::-webkit-scrollbar-thumb]:bg-gray-300 transition-colors">
                                {/* Framer Motion Wrapper for content Stagger */}
                                <motion.div
                                    initial="hidden"
                                    animate="visible"
                                    variants={{
                                        hidden: { opacity: 0, x: 50 },
                                        visible: {
                                            opacity: 1,
                                            x: 0,
                                            transition: {
                                                delay: 0.2,
                                                type: "spring",
                                                stiffness: 260,
                                                damping: 20,
                                                staggerChildren: 0.1
                                            }
                                        }
                                    }}
                                    className="flex flex-col gap-6"
                                >
                                    {/* Price Section */}
                                    <motion.div variants={{ hidden: { x: 50, opacity: 0 }, visible: { x: 0, opacity: 1 } }} className="space-y-4">
                                        <Label className="text-base font-semibold">Giá bán</Label>

                                        {/* Inputs */}
                                        <div className="flex items-center gap-4">
                                            <div className="relative flex-1">
                                                <Label className="text-xs text-muted-foreground mb-1.5 block">Giá thấp nhất</Label>
                                                <div className="relative">
                                                    <Input
                                                        type="number"
                                                        value={priceRange[0]}
                                                        onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                                                        className="pr-12 h-10"
                                                    />
                                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">VND</span>
                                                </div>
                                            </div>
                                            <div className="relative flex-1">
                                                <Label className="text-xs text-muted-foreground mb-1.5 block">Giá cao nhất</Label>
                                                <div className="relative">
                                                    <Input
                                                        type="number"
                                                        value={priceRange[1]}
                                                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 0])}
                                                        className="pr-12 h-10"
                                                    />
                                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">VND</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Slider */}
                                        <div className="pt-6 pb-2 px-2">
                                            <Slider
                                                value={[priceRange[0], priceRange[1]]}
                                                max={MAX_PRICE}
                                                step={10000}
                                                min={0}
                                                onValueChange={(val) => setPriceRange([val[0], val[1]])}
                                                className="my-4"
                                            />
                                            <div className="flex justify-between text-xs text-muted-foreground">
                                                <span>{formatCurrency(priceRange[0])}</span>
                                                <span>{formatCurrency(priceRange[1])}</span>
                                            </div>
                                        </div>

                                        {/* Quick Filters */}
                                        <div className="grid grid-cols-2 gap-3">
                                            {priceQuickFilters.map((filter, idx) => (
                                                <Button
                                                    key={idx}
                                                    variant="outline"
                                                    size="sm"
                                                    className="rounded-full hover:bg-gray-100 hover:text-black border-gray-200 transition-all"
                                                    onClick={() => setPriceRange([filter.min, filter.max])}
                                                >
                                                    {filter.label}
                                                </Button>
                                            ))}
                                        </div>
                                    </motion.div>

                                    <Separator />

                                    {/* Other Filters */}
                                    <motion.div variants={{ hidden: { x: 50, opacity: 0 }, visible: { x: 0, opacity: 1 } }} className="space-y-4">
                                        <div className="grid grid-cols-1 gap-4">
                                            <div className="grid gap-3">
                                                <Label htmlFor="level" className="text-base semi-bold">Trình độ</Label>
                                                <div className="flex flex-wrap gap-2">
                                                    {[
                                                        { label: "Tất cả", value: CourseLevel.All },
                                                        { label: "Người mới bắt đầu", value: CourseLevel.Beginner },
                                                        { label: "Trung cấp", value: CourseLevel.Intermediate },
                                                        { label: "Nâng cao", value: CourseLevel.Advanced },
                                                        { label: "Chuyên gia", value: CourseLevel.Expert },
                                                    ].map((item) => (
                                                        <Button
                                                            key={item.value}
                                                            variant={level === item.value ? "default" : "outline"}
                                                            size="sm"
                                                            onClick={() => setLevel(item.value)}
                                                            className={`rounded-full ${level === item.value ? "bg-black text-white hover:bg-black/90" : "hover:bg-gray-100 text-black border-gray-200 hover:text-black"}`}
                                                        >
                                                            {item.label}
                                                        </Button>
                                                    ))}
                                                </div>
                                            </div>
                                            <Separator />
                                            <div className="grid gap-3">
                                                <Label htmlFor="status" className="text-base semi-bold">Trạng thái</Label>
                                                <div className="flex flex-wrap gap-2">
                                                    {[
                                                        { label: "Tất cả", value: "All" },
                                                        { label: "Nháp", value: CourseStatus.Draft },
                                                        { label: "Chờ duyệt", value: CourseStatus.PendingApproval },
                                                        { label: "Đã duyệt", value: CourseStatus.Approved },
                                                        { label: "Bị từ chối", value: CourseStatus.Rejected },
                                                        { label: "Đã xuất bản", value: CourseStatus.Published },
                                                        { label: "Lưu trữ", value: CourseStatus.Archived },
                                                        { label: "Tạm ngưng", value: CourseStatus.Suspended },
                                                    ].map((item) => (
                                                        <Button
                                                            key={item.value}
                                                            variant={status === item.value ? "default" : "outline"}
                                                            size="sm"
                                                            onClick={() => setStatus(item.value)}
                                                            className={`rounded-full ${status === item.value ? "bg-black text-white hover:bg-black/90" : "hover:bg-gray-100 text-black border-gray-200 hover:text-black"}`}
                                                        >
                                                            {item.label}
                                                        </Button>
                                                    ))}
                                                </div>
                                            </div>
                                            <Separator />
                                            <div className="grid gap-3">
                                                <Label htmlFor="minRating" className="text-base semi-bold">Đánh giá tối thiểu</Label>
                                                <div className="flex items-center gap-1">
                                                    {[1, 2, 3, 4, 5].map((star) => {
                                                        const currentRating = minRating === "all" ? 0 : parseFloat(minRating)
                                                        const isFilled = star <= currentRating
                                                        return (
                                                            <button
                                                                key={star}
                                                                type="button"
                                                                onClick={() => {
                                                                    if (currentRating === star) {
                                                                        setMinRating("all")
                                                                    } else {
                                                                        setMinRating(star.toString())
                                                                    }
                                                                }}
                                                                className="transition-all hover:scale-110 focus:outline-none"
                                                            >
                                                                <Star
                                                                    className={`w-8 h-8 transition-colors ${
                                                                        isFilled
                                                                            ? "fill-yellow-400 text-yellow-400"
                                                                            : "text-gray-300 hover:text-yellow-400"
                                                                    }`}
                                                                />
                                                            </button>
                                                        )
                                                    })}
                                                    {minRating !== "all" && (
                                                        <span className="ml-2 text-sm text-muted-foreground">
                                                            {minRating} sao trở lên
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <Separator />
                                            <div className="grid gap-2">
                                                <Label htmlFor="language" className="text-base semi-bold">Ngôn ngữ</Label>
                                                <div className="flex flex-wrap gap-2">
                                                    {SUGGESTED_LANGUAGES.map((lang) => (
                                                        <Button
                                                            key={lang}
                                                            variant={language === lang ? "default" : "outline"}
                                                            size="sm"
                                                            onClick={() => setLanguage(language === lang ? "" : lang)}
                                                            className={`rounded-full ${language === lang ? "bg-black text-white hover:bg-black/90 hover:text-white" : "hover:bg-gray-100 text-black border-gray-200 hover:text-black"}`}
                                                        >
                                                            {lang}
                                                        </Button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                    <Separator />
                                    <motion.div variants={{ hidden: { x: 50, opacity: 0 }, visible: { x: 0, opacity: 1 } }}>
                                        <div className="grid gap-2">
                                            <Label className="text-base semi-bold">Sắp xếp</Label>
                                            <div className="flex flex-wrap gap-2">
                                                {[
                                                    { label: "Mới nhất", value: "createdDate", isDesc: true },
                                                    { label: "Cũ nhất", value: "createdDate", isDesc: false },
                                                    { label: "Giá cao nhất", value: "price", isDesc: true },
                                                    { label: "Giá thấp nhất", value: "price", isDesc: false },
                                                ].map((item) => {
                                                    const isSelected = sortBy === item.value && isDescending === item.isDesc
                                                    return (
                                                        <Button
                                                            key={`${item.value}-${item.isDesc}`}
                                                            variant={isSelected ? "default" : "outline"}
                                                            size="sm"
                                                            onClick={() => {
                                                                setSortBy(item.value)
                                                                setIsDescending(item.isDesc)
                                                            }}
                                                            className={`rounded-full ${isSelected ? "bg-black text-white hover:bg-black/90 hover:text-white" : "hover:bg-gray-100 text-black border-gray-200 hover:text-black"}`}
                                                        >
                                                            {item.label}
                                                        </Button>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    </motion.div>

                                </motion.div>
                            </div>

                            <div className="p-4 bg-background border-t">
                                <SheetFooter className="flex flex-row gap-3 sm:space-x-0">
                                    <Button variant="outline" onClick={handleReset} className="flex-1 h-11 rounded-xl hover:bg-gray-100 hover:text-black border-gray-200">
                                        Đặt lại
                                    </Button>
                                    {/* SheetClose removed, manual close via setOpen(false) in handleApply */}
                                    <Button onClick={handleApply} className="flex-1 h-11 rounded-xl text-white">
                                        Xem kết quả
                                    </Button>
                                </SheetFooter>
                            </div>
                        </motion.div>
                </AnimatePresence>
            </SheetContent>
        </Sheet>
    )
}

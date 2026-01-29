import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { SlidersHorizontal } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"

export function CourseFilterSheet() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [open, setOpen] = useState(false)

    // Local state for filters
    const [level, setLevel] = useState<string>(searchParams.get("level") || "All")
    const [status, setStatus] = useState<string>(searchParams.get("status") || "All")
    const [minRating, setMinRating] = useState<string>(searchParams.get("minRating") || "all")
    const [language, setLanguage] = useState<string>(searchParams.get("language") || "")
    const [pageSize, setPageSize] = useState<string>(searchParams.get("pageSize") || "8")
    const [isDescending, setIsDescending] = useState<boolean>(searchParams.get("isDescending") !== "false")

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

        const newMinPrice = parseInt(searchParams.get("minPrice") || "0")
        const newMaxPrice = parseInt(searchParams.get("maxPrice") || MAX_PRICE.toString())
        if (priceRange[0] !== newMinPrice || priceRange[1] !== newMaxPrice) {
            setPriceRange([newMinPrice, newMaxPrice])
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams])

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

        params.set("pageNumber", "1")

        router.push(`?${params.toString()}`)
        // Close sheet after applying
        setOpen(false)
    }

    const handleReset = () => {
        setLevel("All")
        setStatus("All")
        setMinRating("all")
        setLanguage("")
        setPageSize("8")
        setIsDescending(true)
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
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button
                    variant="outline"
                    className="h-10 px-4 gap-2 border-border bg-white hover:bg-muted rounded-2xl hover:text-black"
                >
                    <SlidersHorizontal className="w-4 h-4" />
                    <span className="hidden md:inline">Bộ lọc</span>
                </Button>
            </SheetTrigger>
            <AnimatePresence>
                {open && (
                    <SheetContent
                        forceMount
                        className="overflow-y-auto w-full sm:max-w-md p-0 bg-transparent border-none shadow-none data-[state=open]:animate-none data-[state=closed]:animate-none"
                    >
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="h-full w-full bg-background p-6 shadow-lg border-l"
                        >
                            <SheetHeader>
                                <SheetTitle>Bộ lọc tìm kiếm</SheetTitle>
                                <SheetDescription>
                                    Tùy chỉnh kết quả tìm kiếm theo nhu cầu của bạn.
                                </SheetDescription>
                            </SheetHeader>

                            <div className="py-6 space-y-8">
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
                                                    className="rounded-full hover:border-primary hover:text-primary transition-all"
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
                                        <Label className="text-base font-semibold">Thông tin khác</Label>

                                        <div className="grid grid-cols-1 gap-4">
                                            <div className="grid gap-2">
                                                <Label htmlFor="level">Trình độ</Label>
                                                <Select value={level} onValueChange={setLevel}>
                                                    <SelectTrigger id="level">
                                                        <SelectValue placeholder="Chọn trình độ" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="All">Tất cả</SelectItem>
                                                        <SelectItem value="0">Người mới bắt đầu</SelectItem>
                                                        <SelectItem value="1">Trung cấp</SelectItem>
                                                        <SelectItem value="2">Nâng cao</SelectItem>
                                                        <SelectItem value="3">Chuyên gia</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="grid gap-2">
                                                <Label htmlFor="minRating">Đánh giá</Label>
                                                <Select value={minRating} onValueChange={setMinRating}>
                                                    <SelectTrigger id="minRating">
                                                        <SelectValue placeholder="Chọn đánh giá" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="all">Bất kỳ</SelectItem>
                                                        <SelectItem value="3">3 sao trở lên</SelectItem>
                                                        <SelectItem value="4">4 sao trở lên</SelectItem>
                                                        <SelectItem value="4.5">4.5 sao trở lên</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="grid gap-2">
                                                <Label htmlFor="language">Ngôn ngữ</Label>
                                                <Input
                                                    id="language"
                                                    placeholder="VD: Tiếng Việt"
                                                    value={language}
                                                    onChange={(e) => setLanguage(e.target.value)}
                                                    className=""
                                                />
                                            </div>
                                        </div>
                                    </motion.div>

                                    <motion.div variants={{ hidden: { x: 50, opacity: 0 }, visible: { x: 0, opacity: 1 } }}>
                                        <div className="flex items-center space-x-2 pt-2">
                                            <Checkbox
                                                id="isDescending"
                                                checked={isDescending}
                                                onCheckedChange={(checked) => setIsDescending(checked as boolean)}
                                            />
                                            <Label htmlFor="isDescending" className="font-normal cursor-pointer select-none">Sắp xếp mới nhất</Label>
                                        </div>
                                    </motion.div>

                                </motion.div>
                            </div>

                            <SheetFooter className="absolute bottom-0 left-0 right-0 p-4 bg-background border-t flex flex-row gap-3 sm:space-x-0">
                                <Button variant="outline" onClick={handleReset} className="flex-1 h-11 rounded-xl">
                                    Đặt lại
                                </Button>
                                {/* SheetClose removed, manual close via setOpen(false) in handleApply */}
                                <Button onClick={handleApply} className="flex-1 h-11 rounded-xl text-white">
                                    Xem kết quả
                                </Button>
                            </SheetFooter>
                        </motion.div>
                    </SheetContent>
                )}
            </AnimatePresence>
        </Sheet>
    )
}

'use client'

import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon, Percent, DollarSign, X } from 'lucide-react'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { useUpdateCourseDiscount } from '@/hooks/useCourse'

interface Step6DiscountProps {
    courseId: string
    initialData?: {
        discountPercent: number | null
        discountAmount: number | null
        discountEndsAt: string | null
    }
}

export default function Step6Discount({ courseId, initialData }: Step6DiscountProps) {
    const [discountType, setDiscountType] = useState<'percent' | 'amount' | null>(
        initialData?.discountPercent ? 'percent' : initialData?.discountAmount ? 'amount' : null
    )
    const [discountPercent, setDiscountPercent] = useState<number>(initialData?.discountPercent || 0)
    const [discountAmount, setDiscountAmount] = useState<number>(initialData?.discountAmount || 0)
    const [discountEndsAt, setDiscountEndsAt] = useState<Date | undefined>(
        initialData?.discountEndsAt ? new Date(initialData.discountEndsAt) : undefined
    )

    const { updateCourseDiscount, isPending } = useUpdateCourseDiscount()

    const handleSave = async () => {
        try {
            await updateCourseDiscount({
                id: courseId,
                data: {
                    discountPercent: discountType === 'percent' ? discountPercent : null,
                    discountAmount: discountType === 'amount' ? discountAmount : null,
                    discountEndsAt: discountEndsAt ? discountEndsAt.toISOString() : null,
                },
            })
        } catch (error) {
            console.error('Error updating discount:', error)
        }
    }

    const handleClearDiscount = async () => {
        try {
            await updateCourseDiscount({
                id: courseId,
                data: {
                    discountPercent: null,
                    discountAmount: null,
                    discountEndsAt: null,
                },
            })
            setDiscountType(null)
            setDiscountPercent(0)
            setDiscountAmount(0)
            setDiscountEndsAt(undefined)
        } catch (error) {
            console.error('Error clearing discount:', error)
        }
    }
    return (
        <div className="w-full mx-auto py-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight">Giảm giá khóa học</h2>
                <p className="text-muted-foreground">
                    Thiết lập chương trình giảm giá để thu hút học viên. Bạn có thể chọn giảm theo phần trăm hoặc số tiền cố định.
                </p>
            </div>

            <div className="space-y-6">
                {/* Discount Type Selection */}
                <div className="space-y-4">
                    <Label className="text-base font-semibold">Chọn loại giảm giá</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button
                            onClick={() => setDiscountType('percent')}
                            className={cn(
                                "flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left",
                                discountType === 'percent'
                                    ? "border-purple-600 bg-purple-50 text-purple-900"
                                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                            )}
                        >
                            <div className={cn(
                                "p-2 rounded-lg shrink-0",
                                discountType === 'percent' ? "bg-purple-100 text-purple-600" : "bg-gray-100 text-gray-500"
                            )}>
                                <Percent className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="font-semibold">Phần trăm</div>
                                <div className="text-sm text-muted-foreground">Giảm theo tỷ lệ %</div>
                            </div>
                        </button>
                        <button
                            onClick={() => setDiscountType('amount')}
                            className={cn(
                                "flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left",
                                discountType === 'amount'
                                    ? "border-purple-600 bg-purple-50 text-purple-900"
                                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                            )}
                        >
                            <div className={cn(
                                "p-2 rounded-lg shrink-0",
                                discountType === 'amount' ? "bg-purple-100 text-purple-600" : "bg-gray-100 text-gray-500"
                            )}>
                                <DollarSign className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="font-semibold">Số tiền</div>
                                <div className="text-sm text-muted-foreground">Giảm cố định VND</div>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Discount Value Input */}
                {discountType && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                        <Label className="text-base font-semibold">
                            {discountType === 'percent' ? 'Phần trăm giảm giá' : 'Số tiền giảm giá'}
                        </Label>
                        <div className="space-y-3 relative">
                            <Input
                                type="number"
                                min="0"
                                max={discountType === 'percent' ? 100 : undefined}
                                value={(discountType === 'percent' ? discountPercent : discountAmount) === 0 ? '' : (discountType === 'percent' ? discountPercent : discountAmount)}
                                onChange={(e) => {
                                    const value = parseFloat(e.target.value) || 0
                                    if (discountType === 'percent') {
                                        setDiscountPercent(Math.min(100, Math.max(0, value)))
                                    } else {
                                        setDiscountAmount(Math.max(0, value))
                                    }
                                }}
                                className="h-14 sm:h-16 text-2xl sm:text-3xl font-bold tracking-tight bg-transparent border border-gray-400 focus-visible:border-black rounded-lg w-full px-4"
                                style={{ fontSize: '1.8rem' }}
                                placeholder="0"
                            />
                            <p className="text-base sm:text-lg text-muted-foreground font-medium">
                                {discountType === 'percent'
                                    ? `${discountPercent}%`
                                    : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(discountAmount)
                                }
                            </p>
                        </div>
                    </div>
                )}

                {/* Discount End Date */}
                {discountType && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                        <Label className="text-base font-semibold flex items-center gap-2">
                            Thời hạn giảm giá
                            <span className="text-sm font-normal text-muted-foreground">(Tùy chọn)</span>
                        </Label>
                        <div className="flex gap-2">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            "w-full justify-start text-left font-normal h-12",
                                            !discountEndsAt && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {discountEndsAt ? (
                                            format(discountEndsAt, 'PPP', { locale: vi })
                                        ) : (
                                            <span>Chọn ngày kết thúc</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={discountEndsAt}
                                        onSelect={setDiscountEndsAt}
                                        disabled={(date) => date < new Date()}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            {discountEndsAt && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setDiscountEndsAt(undefined)}
                                    className="h-12 w-12 shrink-0 text-muted-foreground hover:text-red-600"
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            )}
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t">
                    <Button
                        onClick={handleSave}
                        disabled={!discountType || isPending}
                        className="flex-1 h-11 rounded-xl"
                    >
                        {isPending ? 'Đang xử lí...' : 'Cập nhật'}
                    </Button>
                    {discountType && (
                        <Button
                            variant="outline"
                            onClick={handleClearDiscount}
                            disabled={isPending}
                            className="h-11 px-6 text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-200"
                        >
                            Xóa giảm giá
                        </Button>
                    )}
                </div>

                {/* Info Note */}
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-900 space-y-2">
                    <p className="font-semibold flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                        Lưu ý
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-blue-800/80 pl-2">
                        <li>Giảm giá sẽ được áp dụng ngay lập tức sau khi lưu</li>
                        <li>Nếu không đặt thời hạn, giảm giá sẽ có hiệu lực vô thời hạn</li>
                        <li>Bạn chỉ có thể chọn một trong hai loại giảm giá: phần trăm hoặc số tiền</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

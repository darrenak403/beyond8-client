'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { formatCurrency }from '@/lib/utils/formatCurrency'
import { useActiveCoupons } from '@/hooks/useCoupon'
import type { Coupon } from '@/lib/api/services/fetchCoupon'
import { Ticket, Percent, Clock } from 'lucide-react'

function CouponCard({
  coupon,
  isSelected,
  onSelect,
}: {
  coupon: Coupon
  isSelected: boolean
  onSelect: () => void
}) {
  const isPercentage = coupon.type?.toLowerCase() === 'percentage'
  const validTo = new Date(coupon.validTo)
  const now = new Date()
  const daysLeft = Math.max(0, Math.ceil((validTo.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
  const isExpiringSoon = daysLeft <= 3

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group relative flex w-full overflow-hidden rounded-xl border-2 text-left transition-all ${
        isSelected
          ? 'border-brand-magenta shadow-md shadow-brand-magenta/10'
          : 'border-border hover:border-brand-pink/40 hover:shadow-sm'
      }`}
    >
      {/* Left ticket strip */}
      <div
        className={`relative flex w-24 shrink-0 flex-col items-center justify-center gap-1 px-3 py-4 ${
          isSelected
            ? 'bg-gradient-to-b from-brand-magenta to-brand-purple'
            : 'bg-gradient-to-b from-brand-pink/80 to-brand-magenta/80'
        }`}
      >
        {/* Ticket notches */}
        <div className="absolute -right-2 top-1/4 h-4 w-4 rounded-full bg-background" />
        <div className="absolute -right-2 bottom-1/4 h-4 w-4 rounded-full bg-background" />

        {isPercentage ? (
          <Percent className="h-6 w-6 text-white" />
        ) : (
          <Ticket className="h-6 w-6 text-white" />
        )}
        <span className="text-[10px] font-medium uppercase tracking-wider text-white/80">
          Giảm giá
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-1 items-center gap-3 px-4 py-3">
        <div className="flex-1 min-w-0 space-y-1.5">
          {/* Value + Type */}
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-foreground">
              {isPercentage
                ? `Giảm ${coupon.value}%`
                : `Giảm ${formatCurrency(coupon.value)}`}
            </span>
            {coupon.maxDiscountAmount != null && coupon.maxDiscountAmount > 0 && (
              <span className="text-base font-medium text-muted-foreground">
                (tối đa {formatCurrency(coupon.maxDiscountAmount)})
              </span>
            )}
          </div>

          {/* Min order */}
          <p className="text-base text-muted-foreground">
            Đơn tối thiểu: {coupon.minOrderAmount != null && coupon.minOrderAmount > 0
              ? formatCurrency(coupon.minOrderAmount)
              : '0đ'}
          </p>

          {/* Usage progress */}
          {coupon.usageLimit != null && coupon.usageLimit > 0 && (
            <div className="space-y-0.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground">
                  Đã dùng {coupon.usedCount}/{coupon.usageLimit}
                </span>
                {(() => {
                  const usagePercent = Math.round((coupon.usedCount / coupon.usageLimit) * 100)
                  return usagePercent >= 80 ? (
                    <span className="text-[10px] font-medium text-red-500">Sắp hết</span>
                  ) : null
                })()}
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-brand-pink to-brand-magenta transition-all"
                  style={{ width: `${Math.min(100, (coupon.usedCount / coupon.usageLimit) * 100)}%` }}
                />
              </div>
            </div>
          )}

          {/* Footer info */}
          <div className="flex items-center gap-3 pt-0.5">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-muted-foreground" />
              <span className={`text-[11px] ${isExpiringSoon ? 'text-red-500 font-medium' : 'text-muted-foreground'}`}>
                {isExpiringSoon ? `Còn ${daysLeft} ngày` : `HSD: ${validTo.toLocaleDateString('vi-VN')}`}
              </span>
            </div>
            <Badge
              variant="outline"
              className="h-4 px-1.5 text-[12px] font-medium border-brand-pink/30 text-brand-magenta"
            >
              {coupon.code}
            </Badge>
          </div>
        </div>

        {/* Radio indicator */}
        <div
          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
            isSelected
              ? 'border-brand-magenta bg-brand-magenta'
              : 'border-muted-foreground/30'
          }`}
        >
          {isSelected && (
            <div className="h-2 w-2 rounded-full bg-white" />
          )}
        </div>
      </div>
    </button>
  )
}

interface CouponDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onApply: (couponCode: string | null) => Promise<boolean> | boolean
  filterByCourseId?: string
  strictCourseFilter?: boolean
  currentCouponCode?: string | null
}

export default function CouponDialog({ 
  open, 
  onOpenChange, 
  onApply, 
  filterByCourseId, 
  strictCourseFilter = false,
  currentCouponCode 
}: CouponDialogProps) {
  const { coupons: allCoupons, isLoading: isCouponsLoading } = useActiveCoupons()
  const [manualCode, setManualCode] = useState('')
  const [isApplying, setIsApplying] = useState(false)

  const coupons = filterByCourseId
    ? allCoupons.filter((c) =>
        strictCourseFilter
          ? c.applicableCourseId === filterByCourseId
          : c.applicableCourseId === filterByCourseId || c.applicableCourseId === null
      )
    : allCoupons
  
  const [selectedCouponId, setSelectedCouponId] = useState<string | null>(() => {
    if (currentCouponCode) {
      const found = coupons.find(c => c.code === currentCouponCode)
      return found?.id || null
    }
    return null
  })
  useEffect(() => {
    if (currentCouponCode) {
      const found = coupons.find(c => c.code === currentCouponCode)
      setSelectedCouponId(found?.id || null)
    } else {
      setSelectedCouponId(null)
    }
  }, [currentCouponCode, coupons])

  const handleSelectCoupon = (couponId: string) => {
    setSelectedCouponId(selectedCouponId === couponId ? null : couponId)
  }

  const handleApplyCoupon = async () => {
    setIsApplying(true)
    
    try {
      const selected = coupons.find((c) => c.id === selectedCouponId)
      const couponToApply = selected ? selected.code : null
      
      const result = await onApply(couponToApply)
      
      if (result) {
        resetState()
      }
    } finally {
      setIsApplying(false)
    }
  }

  const resetState = () => {
    setManualCode('')
    setSelectedCouponId(null)
    onOpenChange(false)
  }

  const handleOpenChange = (value: boolean) => {
    if (!value) {
      setManualCode('')
      setSelectedCouponId(null)
    }
    onOpenChange(value)
  }

  return (
    <Dialog open={open}onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-2xl p-0 gap-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="text-lg">Chọn Beyond Voucher</DialogTitle>
          <DialogDescription className="sr-only">
            Chọn một mã giảm giá để áp dụng cho đơn hàng
          </DialogDescription>
        </DialogHeader>

        {/* Coupon list header */}
        <div className="mx-6 mb-2">
          <p className="text-sm font-semibold text-foreground">Mã giảm giá khả dụng</p>
          <p className="text-xs text-muted-foreground">Có thể chọn 1 Voucher</p>
        </div>

        {/* Coupon list */}
        <ScrollArea className="max-h-[400px]">
          <div className="px-6 pb-2">
            {isCouponsLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex overflow-hidden rounded-xl border border-border">
                    <div className="w-24 shrink-0 animate-pulse bg-muted" />
                    <div className="flex-1 space-y-2 p-4">
                      <div className="h-4 w-32 animate-pulse rounded bg-muted" />
                      <div className="h-3 w-24 animate-pulse rounded bg-muted" />
                      <div className="h-3 w-40 animate-pulse rounded bg-muted" />
                    </div>
                  </div>
                ))}
              </div>
            ) : coupons.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Ticket className="h-10 w-10 mb-2 opacity-30" />
                <p className="text-sm">
                  {filterByCourseId
                    ? 'Không có mã giảm giá cho sản phẩm này'
                    : 'Không có mã giảm giá nào khả dụng'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {coupons.map((coupon) => (
                  <CouponCard
                    key={coupon.id}
                    coupon={coupon}
                    isSelected={selectedCouponId === coupon.id}
                    onSelect={() => handleSelectCoupon(coupon.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        <DialogFooter className="border-t border-border px-6 py-4 sm:justify-between">
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            className="min-w-[100px]"
            disabled={isApplying}
          >
            Trở lại
          </Button>
          <Button
            onClick={handleApplyCoupon}
            className="min-w-[100px] bg-gradient-to-r from-brand-magenta to-brand-purple text-white hover:opacity-90"
            disabled={isApplying}
          >
            {isApplying ? 'Đang xử lý...' : 'Đồng ý'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatCurrency } from '@/lib/utils/formatCurrency'
import { useCartContext } from '../context/CartContext'
import type { CartItem } from '@/lib/api/services/fetchOrder'
import { useGetCart, useCheckout, useProcessPayment } from '@/hooks/useOrder'
import { useAuth } from '@/hooks/useAuth'

export default function CartSummary() {
  const { isAuthenticated } = useAuth()
  const { cart } = useGetCart({ enabled: isAuthenticated })
  const { selectedItems, selectedTotal, getInstructorCouponCode } = useCartContext()
  const { checkout, isPending: isCheckoutPending } = useCheckout()
  const { processPayment, isPending: isProcessPaymentPending } = useProcessPayment()
  const [couponCode, setCouponCode] = useState<string>('')

  const handleCheckout = async () => {
    if (selectedItems.size === 0) return

    try {
      const selectedItemsArray = Array.from(selectedItems).map(courseId => ({
        courseId,
        instructorCouponCode: getInstructorCouponCode(courseId),
      }))

      const checkoutResponse = await checkout({
        selectedItems: selectedItemsArray,
        couponCode: couponCode || null,
        notes: null,
      })

      if (checkoutResponse.isSuccess && checkoutResponse.data) {
        const orderId = checkoutResponse.data.id

        const paymentResponse = await processPayment({
          orderId,
        })

        if (paymentResponse.isSuccess && paymentResponse.data?.paymentUrl) {
          window.location.href = paymentResponse.data.paymentUrl
        }
      }
    } catch (error) {
      console.error('Checkout error:', error)
    }
  }

  if (!cart || cart.items.length === 0) {
    return null
  }

  const isLoading = isCheckoutPending || isProcessPaymentPending

  const hasSelection = selectedItems.size > 0

  let originalTotal = 0
  let subTotal = 0
  let totalDiscount = 0

  if (hasSelection) {
    const selectedCartItems: CartItem[] = cart.items.filter(item =>
      selectedItems.has(item.courseId)
    )

    originalTotal = selectedCartItems.reduce(
      (sum, item) => sum + item.originalPrice,
      0
    )
    subTotal = selectedTotal
    totalDiscount = Math.max(originalTotal - subTotal, 0)
  }

  return (
    <div className="sticky top-4 h-fit">
      <div className="border border-border rounded-2xl bg-white dark:bg-black/50 p-6 space-y-4">
        <h3 className="font-bold text-lg text-foreground mb-4">Tóm tắt đơn hàng</h3>

        {/* Coupon Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Mã giảm giá</label>
          <div className="flex gap-2">
            <Input
              placeholder="Nhập mã giảm giá"
              className="flex-1"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
            />
            <Button variant="outline" size="sm">
              Áp dụng
            </Button>
          </div>
        </div>

        {/* Total */}
        <div className="pt-4 border-t border-border space-y-3">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Tạm tính</span>
              <span>{formatCurrency(originalTotal)}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-red-500">
              <span>Giảm giá</span>
              <span>-{formatCurrency(totalDiscount)}</span>
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-sm font-medium text-foreground">
                {selectedItems.size > 0
                  ? `Tổng cộng (${selectedItems.size} khóa học):`
                  : 'Tổng cộng:'}
              </span>
              <span className="text-lg font-bold text-brand-magenta">
                {formatCurrency(subTotal)}
              </span>
            </div>
          </div>

          {/* Payment Button */}
          <Button
            size="lg"
            className="w-full bg-gradient-to-r from-brand-magenta to-brand-purple text-white hover:opacity-90"
            disabled={selectedItems.size === 0 || isLoading}
            onClick={handleCheckout}
          >
            {isLoading ? 'Đang xử lý...' : 'Thanh toán'}
          </Button>
        </div>
      </div>
    </div>
  )
}

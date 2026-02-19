'use client'

import { useState, useEffect }from 'react'
import { Button }from '@/components/ui/button'
import { formatCurrency }from '@/lib/utils/formatCurrency'
import { useCartContext }from '../context/CartContext'
import { useGetCart, useCheckout, useProcessPayment, useCheckoutPreview }from '@/hooks/useOrder'
import { useAuth } from '@/hooks/useAuth'
import CouponDialog from '@/components/widget/CouponDialog'
import { PendingPaymentDialog }from '@/components/widget/PendingPaymentDialog'
import { Tag, Ticket, Edit }from 'lucide-react'

export default function CartSummary() {
  const { isAuthenticated } = useAuth()
  const { cart }= useGetCart({ enabled: isAuthenticated })
  const { selectedItems, selectedTotal, getInstructorCouponCode, systemCouponCode, setSystemCouponCode }= useCartContext()
  
  const [dialogOpen, setDialogOpen] = useState(false)
  const [pendingPaymentDialogOpen, setPendingPaymentDialogOpen] = useState(false)
  const [pendingPaymentUrl, setPendingPaymentUrl] = useState('')
  const [pendingOrderNumber, setPendingOrderNumber] = useState('')
  
  const { checkout, isPending: isCheckoutPending } = useCheckout()
  const { processPayment, isPending: isProcessPaymentPending }= useProcessPayment()
  const { previewCheckout, isPending: isPreviewPending, previewData }= useCheckoutPreview()

  // Trigger preview when coupon or selected items change
  useEffect(() => {
    if (selectedItems.size > 0 && systemCouponCode) {
      const selectedItemsArray = Array.from(selectedItems).map(courseId => ({
        courseId,
        instructorCouponCode: getInstructorCouponCode(courseId),
      }))

      previewCheckout({
        items: selectedItemsArray,
        couponCode: systemCouponCode || null,
      })
    }
  }, [systemCouponCode, selectedItems, getInstructorCouponCode, previewCheckout])

  const handleApplyCoupon = async (code: string | null): Promise<boolean> => {
    if (!code) {
      setSystemCouponCode('')
      return true
    }

    if (selectedItems.size === 0) {
      return false
    }

    try {
      const selectedItemsArray = Array.from(selectedItems).map(courseId => ({
        courseId,
        instructorCouponCode: getInstructorCouponCode(courseId),
      }))

      await previewCheckout({
        items: selectedItemsArray,
        couponCode: code,
      })

      // If no error thrown, coupon is valid
      setSystemCouponCode(code)
      return true
    }catch (error) {
      // Error thrown means coupon is invalid
      console.error('Coupon validation error:', error)
      return false
    }
  }

  const handleCheckout = async () => {
    if (selectedItems.size === 0) return

    const selectedItemsArray = Array.from(selectedItems).map(courseId => ({
      courseId,
      instructorCouponCode: getInstructorCouponCode(courseId),
    }))

    const checkoutResponse = await checkout({
      selectedItems: selectedItemsArray,
      couponCode: systemCouponCode || null,
      notes: null,
    })

    // Kiểm tra nếu có pendingPaymentInfo
    if (checkoutResponse.isSuccess && checkoutResponse.data?.pendingPaymentInfo) {
      const paymentInfo = checkoutResponse.data.pendingPaymentInfo
      setPendingPaymentUrl(paymentInfo.paymentInfo.paymentUrl)
      setPendingOrderNumber(paymentInfo.orderNumber)
      setPendingPaymentDialogOpen(true)
      return
    }

    // Nếu checkout thành công và có orderId, tiếp tục process payment
    if (checkoutResponse.isSuccess && checkoutResponse.data?.id) {
      const orderId = checkoutResponse.data.id

      const paymentResponse = await processPayment({
        orderId,
      })

      if (paymentResponse.isSuccess && paymentResponse.data?.paymentUrl) {
        localStorage.removeItem('cartSystemCoupon')
        window.location.href = paymentResponse.data.paymentUrl
      }
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
    if (systemCouponCode && previewData) {
      originalTotal = previewData.subTotal
      subTotal = previewData.totalAmount
      totalDiscount = previewData.totalDiscountAmount
    }else {
      const selectedCartItems = cart.items.filter(item =>
        selectedItems.has(item.courseId)
      )

      originalTotal = selectedCartItems.reduce(
        (sum, item) => sum + item.originalPrice,
        0
      )
      subTotal = selectedTotal
      totalDiscount = Math.max(originalTotal - subTotal, 0)
    }
  }

  return (
    <div className="sticky top-4 h-fit">
      <div className="border border-border rounded-2xl bg-white dark:bg-black/50 p-6 space-y-4">
        <h3 className="font-bold text-lg text-foreground mb-4">Tóm tắt đơn hàng</h3>

        {/* Coupon Section */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Mã giảm giá</label>
          {systemCouponCode ? (
            <div className="flex items-center justify-between rounded-lg border border-brand-pink/30 bg-brand-pink/5 dark:bg-brand-purple/10 px-3 py-2">
              <div className="flex items-center gap-2">
                <Ticket className="h-4 w-4 text-brand-magenta" />
                <span className="text-sm font-medium text-brand-magenta">
                  {systemCouponCode}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setDialogOpen(true)}
                className="rounded-full p-1 text-brand-magenta/70 hover:bg-brand-pink/10 hover:text-brand-magenta transition-colors"
                aria-label="Sửa mã giảm giá"
              >
                <Edit className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <Button
              variant="outline"
              className="w-full justify-start gap-2 text-muted-foreground"
              onClick={() => setDialogOpen(true)}
            >
              <Tag className="h-4 w-4" />
              Chọn mã giảm giá
            </Button>
          )}
        </div>

        {/* Coupon Selection Dialog */}
        <CouponDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onApply={handleApplyCoupon}
          currentCouponCode={systemCouponCode}
        />

        {/* Pending Payment Dialog */}
        <PendingPaymentDialog
          open={pendingPaymentDialogOpen}
          onOpenChange={setPendingPaymentDialogOpen}
          paymentUrl={pendingPaymentUrl}
          orderNumber={pendingOrderNumber}
        />

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
                {isPreviewPending && systemCouponCode ? (
                  <span className="text-sm text-muted-foreground">Đang tính...</span>
                ) : (
                  formatCurrency(subTotal)
                )}
              </span>
            </div>
          </div>

          {/* Payment Button */}
          <Button
            size="lg"
            className="w-full bg-gradient-to-r from-brand-magenta to-brand-purple text-white hover:opacity-90"
            disabled={selectedItems.size === 0 || isLoading || (isPreviewPending && !!systemCouponCode)}
            onClick={handleCheckout}
          >
            {isLoading ? 'Đang xử lý...' : 'Thanh toán'}
          </Button>
        </div>
      </div>
    </div>
  )
}

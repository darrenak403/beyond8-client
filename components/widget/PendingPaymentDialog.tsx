'use client'

import { AlertCircle, CreditCard, History, X }from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
}from '@/components/ui/alert-dialog'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface PendingPaymentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  paymentUrl: string
  orderNumber?: string
}

export function PendingPaymentDialog({ 
  open, 
  onOpenChange, 
  paymentUrl,
  orderNumber 
}: PendingPaymentDialogProps) {
  const handleProceedToPayment = () => {
    onOpenChange(false)
    window.location.href = paymentUrl
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-[480px] p-0 gap-0 overflow-hidden border-0 shadow-lg">
        <div className="p-6 bg-white space-y-4">
          <AlertDialogHeader className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-orange-100 shrink-0">
                <AlertCircle className="w-6 h-6 text-orange-600" />
              </div>
              <AlertDialogTitle className="text-xl font-bold text-orange-700">
                Đơn hàng chưa thanh toán
              </AlertDialogTitle>
              <button
                onClick={() => onOpenChange(false)}
                className="ml-auto p-1 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Đóng"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <AlertDialogDescription className="text-gray-600 text-base leading-relaxed pl-12 space-y-2">
              <p>Đơn hàng này hiện chưa thanh toán trước đó.</p>
              {orderNumber && (
                <p className="text-sm font-medium text-gray-700">
                  Mã đơn hàng: <span className="text-brand-magenta">{orderNumber}</span>
                </p>
              )}
              <p className="text-sm text-orange-600">
                Vui lòng thanh toán trước để hoàn tất đơn hàng.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
        </div>
        <div className="px-6 py-4 bg-gray-50 flex items-center justify-end gap-3 border-t">
          <AlertDialogCancel
            className={cn(
              'rounded-full border-gray-200 text-gray-700 hover:bg-gray-100 hover:text-black hover:border-gray-300 mt-0'
            )}
          >
            <Link href={`/mybeyond/payment-history`} className="flex items-center gap-2">
              <History className="w-4 h-4" />
              Xem lịch sử giao dịch
            </Link>
           
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleProceedToPayment}
            className={cn(
              'bg-gradient-to-r from-brand-magenta to-brand-purple hover:opacity-90 text-white rounded-full px-6 transition-all gap-2'
            )}
          >
            <CreditCard className="w-4 h-4" />
            Thanh toán ngay
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}

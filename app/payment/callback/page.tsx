'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef } from 'react'
import { CheckCircle2, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { formatCurrency } from '@/lib/utils/formatCurrency'

export default function PaymentCallbackPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const returnUrlRef = useRef<string>('/')

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedReturnUrl = sessionStorage.getItem("walletTopUpReturnUrl");
      if (savedReturnUrl) {
        returnUrlRef.current = savedReturnUrl;
      }
      sessionStorage.removeItem("isWalletTopUp");
      sessionStorage.removeItem("walletTopUpReturnUrl");
    }
  }, []);

  const { isSuccess, paymentInfo, errorMessage, errorReason } = useMemo(() => {
    const responseCode = searchParams.get('vnp_ResponseCode')
    const transactionStatus = searchParams.get('vnp_TransactionStatus')
    const amount = searchParams.get('vnp_Amount')
    const orderInfo = searchParams.get('vnp_OrderInfo')
    const transactionNo = searchParams.get('vnp_TransactionNo')
    const bankCode = searchParams.get('vnp_BankCode')

    const isSuccess = responseCode === '00' && transactionStatus === '00'

    let errorMessage: string | undefined
    let errorReason: string | undefined
    if (!isSuccess) {
      errorMessage = 'Giao dịch không thành công'

      // Mapping chỉ dành cho các trường hợp giao dịch thất bại
      switch (responseCode) {
        case '07':
          errorReason =
            'Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường).'
          break
        case '09':
          errorReason = 'Thẻ/Tài khoản chưa đăng ký dịch vụ InternetBanking tại ngân hàng.'
          break
        case '10':
          errorReason = 'Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần.'
          break
        case '11':
          errorReason = 'Đã hết hạn chờ thanh toán.'
          break
        case '12':
          errorReason = 'Thẻ/Tài khoản bị khóa.'
          break
        case '13':
          errorReason = 'Quý khách nhập sai mật khẩu xác thực giao dịch (OTP).'
          break
        case '24':
          errorReason = 'Khách hàng hủy giao dịch.'
          break
        case '51':
          errorReason = 'Tài khoản không đủ số dư.'
          break
        case '65':
          errorReason = 'Tài khoản đã vượt quá hạn mức giao dịch trong ngày.'
          break
        case '75':
          errorReason = 'Ngân hàng thanh toán đang bảo trì.'
          break
        case '79':
          errorReason = 'Nhập sai mật khẩu thanh toán quá số lần quy định.'
          break
        case '99':
          errorReason = 'Lỗi không xác định.'
          break
        default:
          if (responseCode) {
            errorReason = `Mã lỗi: ${responseCode}`
          } else {
            errorMessage = 'Giao dịch không thành công. Vui lòng thử lại.'
          }
          break
      }
    }

    let formattedAmount: string | undefined
    if (amount) {
      const amountNumber = parseInt(amount) / 100
      formattedAmount = formatCurrency(amountNumber)
    }

    return {
      isSuccess,
      errorMessage,
      errorReason,
      paymentInfo: {
        amount: formattedAmount,
        orderInfo: orderInfo || undefined,
        transactionNo: transactionNo || undefined,
        bankCode: bankCode || undefined,
      },
    }
  }, [searchParams])

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <div className="flex-1 flex items-center justify-center py-12 px-4">
        <Card className="max-w-md w-full mx-auto text-center shadow-lg">
          <CardContent className="p-8 space-y-6">
            {/* Icon */}
            <div className="flex justify-center">
              {isSuccess ? (
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="w-12 h-12 text-green-600" />
                </div>
              ) : (
                <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
                  <XCircle className="w-12 h-12 text-red-600" />
                </div>
              )}
            </div>

            {/* Title */}
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                {isSuccess ? 'Thanh toán thành công!' : 'Thanh toán thất bại'}
              </h1>
              {isSuccess ? (
                <p className="text-muted-foreground">
                  Cảm ơn bạn đã thanh toán. Đơn hàng của bạn đã được xử lý thành công.
                </p>
              ) : (
                <div className="space-y-2">
                  <p className="text-muted-foreground">
                    {errorMessage || 'Đã xảy ra lỗi trong quá trình thanh toán. Vui lòng thử lại.'}
                  </p>
                  {errorReason && (
                    <p className="text-sm font-semibold text-red-600 bg-red-50 px-3 py-2 rounded-md">
                      {errorReason}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Payment Info */}
            {paymentInfo.amount && (
              <div className="bg-muted rounded-lg p-4 space-y-2 text-left">
                {paymentInfo.amount && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Số tiền:</span>
                    <span className="text-sm font-semibold text-foreground">
                      {paymentInfo.amount}
                    </span>
                  </div>
                )}
                {paymentInfo.orderInfo && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Mã đơn hàng:</span>
                    <span className="text-sm font-semibold text-foreground">
                      {paymentInfo.orderInfo}
                    </span>
                  </div>
                )}
                {paymentInfo.transactionNo && paymentInfo.transactionNo !== '0' && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Mã giao dịch:</span>
                    <span className="text-sm font-semibold text-foreground">
                      {paymentInfo.transactionNo}
                    </span>
                  </div>
                )}
                {paymentInfo.bankCode && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Ngân hàng:</span>
                    <span className="text-sm font-semibold text-foreground">
                      {paymentInfo.bankCode}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Action Button */}
            <div className="pt-4">
              <Button
                size="lg"
                className="w-full bg-linear-to-r from-brand-magenta to-brand-purple text-white hover:opacity-90"
                onClick={() => router.push(returnUrlRef.current)}
              >
                Quay lại
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  )
}

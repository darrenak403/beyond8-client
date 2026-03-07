'use client'

import { useState } from 'react'
import {
  MonitorPlay,
  FileText,
  Trophy,
  Infinity,
  Smartphone
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { formatCurrency } from '@/lib/utils/formatCurrency'
import { CourseSummary, CourseDetail as CourseDetailType } from '@/lib/api/services/fetchCourse'
import { useCheckEnrollment, useEnrollCourse } from '@/hooks/useEnroll'
import { ConfirmDialog } from '@/components/widget/confirm-dialog'
import { useAuth } from '@/hooks/useAuth'
import { useAddToCart, useGetCart, useBuyNow, useCheckCourse } from '@/hooks/useOrder'
import { startOfToday, differenceInCalendarDays } from 'date-fns'
import { PendingPaymentDialog } from '@/components/widget/PendingPaymentDialog'
import { useRouter } from 'next/navigation'
import { LoginDialog } from '@/components/widget/auth/LoginDialog'

interface CourseSidebarProps {
  course: CourseSummary | CourseDetailType
  preview?: boolean
}

// Format duration from minutes to readable string
const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours > 0 && mins > 0) {
    return `${hours}h ${mins}m`
  } else if (hours > 0) {
    return `${hours}h`
  }
  return `${mins}m`
}

export default function CourseSidebar({ course, preview }: CourseSidebarProps) {
  const totalLessons =
    course.totalLessons ||
    course.sections.reduce((sum, section) => sum + section.lessons.length, 0)
  const duration = formatDuration(course.totalDurationMinutes)
  const originalPrice = course.price
  const finalPrice = course.finalPrice ?? course.price
  const hasDiscount = finalPrice < originalPrice
  const isFreeCourse = finalPrice === 0
  const computedDiscountPercent =
    originalPrice > 0
      ? Math.round(((originalPrice - finalPrice) / originalPrice) * 100)
      : 0
  const effectiveDiscountPercent =
    course.discountPercent ?? computedDiscountPercent

  const discountEndDate = course.discountEndsAt
    ? new Date(course.discountEndsAt)
    : null
  const today = startOfToday()
  const remainingDiscountDays =
    discountEndDate && discountEndDate.getTime() > today.getTime()
      ? differenceInCalendarDays(discountEndDate, today)
      : 0

  const levelText: Record<string, string> = {
    Beginner: 'Cơ bản',
    Intermediate: 'Trung bình',
    Advanced: 'Nâng cao',
    Expert: 'Chuyên gia',
  }

  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [pendingPaymentDialogOpen, setPendingPaymentDialogOpen] = useState(false)
  const [pendingPaymentUrl, setPendingPaymentUrl] = useState('')
  const [pendingOrderNumber, setPendingOrderNumber] = useState('')
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false)

  const router = useRouter()
  const { enrollCourse, isPending } = useEnrollCourse()
  const { isAuthenticated } = useAuth()
  const { isEnrolled, isLoading: isCheckingEnroll } = useCheckEnrollment(course.id, {
    enabled: isAuthenticated && !!course.id,
  })
  const { addToCart, isPending: isAddingToCart } = useAddToCart()
  const { cart } = useGetCart({ enabled: isAuthenticated })

  const { isPurchased } = useCheckCourse(course.id, {
    enabled: !!course.id,
  })
  const { buyNow, isPending: isBuyNowPending } = useBuyNow({
    onPendingPayment: (paymentUrl, orderNumber) => {
      setPendingPaymentUrl(paymentUrl)
      setPendingOrderNumber(orderNumber)
      setPendingPaymentDialogOpen(true)
    }
  })

  const isInCart = cart?.items?.some(item => item.courseId === course.id) ?? false
  const isProcessingPayment = isBuyNowPending

  const handleFreeEnroll = async () => {
    try {
      await enrollCourse(course.id)
      setIsConfirmOpen(false)
    } catch {
    }
  }

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      setIsLoginDialogOpen(true)
      return
    }

    try {
      await addToCart({ courseId: course.id })
    } catch (error) {
      console.error('Failed to add to cart:', error)
    }
  }

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      setIsLoginDialogOpen(true)
      return
    }

    try {
      if (!isPurchased) {
        if (!isInCart) {
          await addToCart({ courseId: course.id })
        }
        router.push('/cart')
        return
      }

      const buyNowResponse = await buyNow({
        courseId: course.id,
        instructorCouponCode: null,
        couponCode: null,
        notes: null,
      })

      if (buyNowResponse.isSuccess && buyNowResponse.data?.pendingPaymentInfo) {
        return
      }
    } catch (error) {
      console.error('Buy now error:', error)
    }
  }

  return (
    <Card className="sticky top-40 overflow-hidden border-brand-magenta/20 shadow-xl shadow-brand-magenta/5 backdrop-blur-xl bg-white/80">
      <div className="h-2 bg-linear-to-r from-brand-pink via-brand-magenta to-brand-purple" />
      <CardContent className="p-6 space-y-6">
        {/* Price Section */}
        {!isEnrolled && (
          <div>
            {hasDiscount && effectiveDiscountPercent > 0 && (
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-brand-magenta font-medium bg-brand-magenta/10 px-2 py-1 rounded-2xl">
                  Ưu đãi ra mắt
                </span>
                <span className="text-sm font-bold text-green-600">
                  GIẢM {effectiveDiscountPercent}%
                </span>
              </div>
            )}
            <div className="flex items-baseline gap-2">
              {course.finalPrice > 0 && (
                <span className="text-4xl font-bold text-slate-900">
                  {formatCurrency(finalPrice)}
                </span>
              )}
              {course.finalPrice === 0 && (
                <span className="text-4xl font-bold text-slate-900">
                  Miễn phí
                </span>
              )}
              {hasDiscount && (
                <span className="text-lg text-muted-foreground line-through decoration-red-500/50">
                  {formatCurrency(originalPrice)}
                </span>
              )}
            </div>
            {hasDiscount && course.discountEndsAt && remainingDiscountDays > 0 && (
              <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600 border border-red-100">
                <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                <span>
                  Chỉ còn{' '}
                  <span className="font-bold">{remainingDiscountDays}</span>{' '}
                  ngày với giá ưu đãi
                </span>
              </div>
            )}
          </div>
        )}


        {/* Action Buttons */}
        <div className="space-y-3">
          {preview ? (
            <>
              <Button
                className="w-full text-lg py-7 rounded-2xl bg-primary/50 cursor-not-allowed border border-white/10 relative overflow-hidden"
                disabled
              >
                <span className="font-semibold text-white relative z-10">
                  Đăng ký ngay
                </span>
              </Button>
              <Button
                variant="outline"
                className="w-full h-12 rounded-2xl text-base font-semibold border-brand-magenta/20 bg-gray-50 cursor-not-allowed"
                disabled
              >
                Thêm vào giỏ hàng
              </Button>
            </>
          ) : isAuthenticated && isCheckingEnroll ? (
            <Button className="w-full text-lg py-7 rounded-2xl" disabled>
              Đang kiểm tra...
            </Button>
          ) : isAuthenticated && isEnrolled ? (
            <Button
              className="w-full text-lg py-7 rounded-2xl bg-green-600 hover:bg-green-600 text-white"
              disabled
            >
              Đã tham gia
            </Button>
          ) : isFreeCourse ? (
            <ConfirmDialog
              open={isConfirmOpen}
              onOpenChange={(open) => {
                if (open && !isAuthenticated) {
                  setIsLoginDialogOpen(true)
                  return
                }
                setIsConfirmOpen(open)
              }}
              onConfirm={handleFreeEnroll}
              title="Tham gia khóa học miễn phí"
              description="Bạn có chắc chắn muốn tham gia khóa học này không? Sau khi tham gia, bạn có thể truy cập toàn bộ nội dung học."
              confirmText="Tham gia ngay"
              cancelText="Hủy"
              variant="success"
              isLoading={isPending}
              trigger={
                <Button className="w-full text-lg py-7 rounded-2xl bg-primary hover:bg-primary/90 shadow-[0_0_30px_rgba(173,28,154,0.4)] transition-all hover:scale-105 hover:shadow-[0_0_50px_rgba(173,28,154,0.6)] border border-white/10 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  <span className="font-semibold text-white relative z-10">
                    Tham gia ngay
                  </span>
                </Button>
              }
            />
          ) : (
            <>
              <Button
                className="w-full text-lg py-7 rounded-2xl bg-primary hover:bg-primary/90 shadow-[0_0_30px_rgba(173,28,154,0.4)] transition-all hover:scale-105 hover:shadow-[0_0_50px_rgba(173,28,154,0.6)] border border-white/10 relative overflow-hidden group"
                onClick={handleBuyNow}
                disabled={isProcessingPayment}
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="font-semibold text-white relative z-10">
                  {isProcessingPayment ? 'Đang xử lý...' : 'Đăng ký ngay'}
                </span>
              </Button>
              <Button
                variant="outline"
                className="w-full h-12 rounded-2xl text-base font-semibold border-brand-magenta/20 hover:bg-brand-magenta/5 hover:text-brand-magenta transition-colors"
                onClick={handleAddToCart}
                disabled={isAddingToCart || isInCart}
              >
                {isAddingToCart ? 'Đang thêm...' : isInCart ? 'Đã có trong giỏ hàng' : 'Thêm vào giỏ hàng'}
              </Button>
            </>
          )}
        </div>

        <Separator />

        {/* Pending Payment Dialog */}
        <PendingPaymentDialog
          open={pendingPaymentDialogOpen}
          onOpenChange={setPendingPaymentDialogOpen}
          paymentUrl={pendingPaymentUrl}
          orderNumber={pendingOrderNumber}
        />

        {/* Course Features */}
        <div className="space-y-4">
          <h3 className="font-semibold text-brand-dark">Khóa học bao gồm:</h3>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-center gap-3">
              <MonitorPlay className="w-5 h-5 text-brand-purple" />
              <span>{duration} video bài giảng</span>
            </li>
            <li className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-brand-purple" />
              <span>{totalLessons}bài học</span>
            </li>
            <li className="flex items-center gap-3">
              <Trophy className="w-5 h-5 text-brand-purple" />
              <span>Chứng chỉ hoàn thành</span>
            </li>
            <li className="flex items-center gap-3">
              <Infinity className="w-5 h-5 text-brand-purple" />
              <span>Truy cập trọn đời</span>
            </li>
            <li className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-brand-purple" />
              <span>Học trên thiết bị di động và TV</span>
            </li>
          </ul>
        </div>

        {/* Quick Stats */}
        <div className="bg-muted/30 -mx-6 -mb-6 p-4 border-t mt-6">
          <div className="flex justify-between text-center">
            <div>
              <div className="font-bold text-brand-dark">{levelText[course.level] || course.level}</div>
              <div className="text-xs text-muted-foreground">Trình độ</div>
            </div>
            <div className="w-px bg-border h-auto" />
            <div>
              <div className="font-bold text-brand-dark">{course.language || 'Tiếng Việt'}</div>
              <div className="text-xs text-muted-foreground">Ngôn ngữ</div>
            </div>
            <div className="w-px bg-border h-auto" />
            <div>
              <div className="font-bold text-brand-dark">Có</div>
              <div className="text-xs text-muted-foreground">Chứng chỉ</div>
            </div>
          </div>
        </div>
      </CardContent>
      <LoginDialog open={isLoginDialogOpen} onOpenChange={setIsLoginDialogOpen} />
    </Card>
  )
}

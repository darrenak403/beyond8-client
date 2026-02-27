
import { Badge } from '@/components/ui/badge'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { CoursePreviewDialog } from '@/components/widget/CoursePreviewDialog'
import { ConfirmDialog } from '@/components/widget/confirm-dialog'
import { useSubmitCourseForReview, usePublishCourse, useUnpublishCourse, useDeleteCourse } from '@/hooks/useCourse'
import { useGetCouponForInstructor } from '@/hooks/useCoupon'
import { useGetSubmissionSumary } from '@/hooks/useAssignment'
import {
  Star,
  Clock,
  Users,
  Eye,
  Trash2,
  MoreHorizontal,
  ClipboardCheck,
  Ticket,
  Tag,
  BookCheck
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Course, CourseLevel, CourseStatus } from '@/lib/api/services/fetchCourse'
import { formatImageUrl } from '@/lib/utils/formatImageUrl'
import SafeImage from '@/components/ui/SafeImage'

interface CourseGridItemProps {
  course: Course
  isSelected?: boolean
  onToggleSelect?: () => void
  isSelectionMode?: boolean
}

const getLevelLabel = (level: CourseLevel) => {
  switch (level) {
    case CourseLevel.Beginner: return 'Cơ bản'
    case CourseLevel.Intermediate: return 'Trung bình'
    case CourseLevel.Advanced: return 'Nâng cao'
    case CourseLevel.Expert: return 'Chuyên gia'
    case CourseLevel.All: return 'Tất cả'
    default: return 'Cơ bản'
  }
}

const getStatusLabel = (status: CourseStatus) => {
  switch (status) {
    case CourseStatus.Draft: return 'Nháp'
    case CourseStatus.PendingApproval: return 'Chờ duyệt'
    case CourseStatus.Approved: return 'Đã duyệt'
    case CourseStatus.Rejected: return 'Bị từ chối'
    case CourseStatus.Published: return 'Đang hoạt động'
    case CourseStatus.Archived: return 'Lưu trữ'
    case CourseStatus.Suspended: return 'Đình chỉ'
    default: return 'Không xác định'
  }
}

const getStatusColor = (status: CourseStatus) => {
  switch (status) {
    case CourseStatus.Published: return 'bg-emerald-500/90 hover:bg-emerald-500'
    case CourseStatus.Draft: return 'bg-slate-500/90 hover:bg-slate-500'
    case CourseStatus.PendingApproval: return 'bg-yellow-500/90 hover:bg-yellow-500'
    case CourseStatus.Rejected: return 'bg-red-500/90 hover:bg-red-500'
    default: return 'bg-slate-500/90 hover:bg-slate-500'
  }
}

export default function CourseGridItem({ course, isSelected, onToggleSelect, isSelectionMode }: CourseGridItemProps) {
  // Format currency
  const formattedPrice = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(course.price)

  const formattedFinalPrice = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(course.finalPrice)

  const isDiscounted = course.price > course.finalPrice;
  const discountDisplay = course.discountPercent
    ? `-${course.discountPercent}%`
    : course.discountAmount
      ? `-${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(course.discountAmount)}`
      : '';

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) return `${hours}h ${mins}m`
    return `${mins}m`
  }

  const router = useRouter()
  const [showPreview, setShowPreview] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const { submitCourseForReview, isPending: isSubmitting } = useSubmitCourseForReview()
  const { publishCourse, isPending: isPublishing } = usePublishCourse()
  const { unpublishCourse, isPending: isUnpublishing } = useUnpublishCourse()
  const { deleteCourse, isPending: isDeleting } = useDeleteCourse()
  const { coupons } = useGetCouponForInstructor()
  const couponCount = coupons.filter(c => c.applicableCourseId === course.id).length
  const { submissions: submissionSummary } = useGetSubmissionSumary(course.id)
  const pendingGradingCount = submissionSummary?.sections?.reduce((sum, s) => sum + (s.ungradedSubmissions || 0), 0) ?? 0

  const handlePreview = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setShowPreview(true)
  }



  return (
    <div
      className={`group flex flex-col h-full bg-white rounded-2xl overflow-hidden border transition-all duration-300 ${isSelected
        ? 'border-2 border-primary shadow-lg ring-2 ring-primary/20 scale-[0.98]'
        : 'border-slate-200/60 hover:border-primary/30 hover:translate-y-[-4px] hover:shadow-xl hover:shadow-primary/5'
        }`}
      onClick={() => isSelectionMode && onToggleSelect?.()}
      style={{ cursor: isSelectionMode ? 'pointer' : 'default' }}
    >
      {/* Image Section */}
      <div className="relative w-full aspect-4/3 overflow-hidden bg-linear-to-br from-slate-100 to-slate-50">
        <SafeImage
          src={formatImageUrl(course.thumbnailUrl) || '/images/placeholder.jpg'}
          alt={course.title}
          fill
          className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-105"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className={`absolute top-3 transition-all duration-300 left-3`}>
          <Badge className={`${getStatusColor(course.status)} text-white border-0 backdrop-blur-sm`}>
            {getStatusLabel(course.status)}
          </Badge>
        </div>

        <div className="absolute top-3 right-3">
          <Badge variant="secondary" className="backdrop-blur-lg bg-white/95 text-primary font-semibold shadow-lg border border-white/50">
            {course.categoryName}
          </Badge>
        </div>

        {/* Preview Button - Bottom Left */}
        <button
          onClick={handlePreview}
          className="absolute bottom-3 left-3 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-sm transition-all duration-300 hover:scale-110"
        >
          <Eye className="w-4 h-4" />
        </button>

        {/* Stats Overlay - Bottom Right */}
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs font-medium">
            <Users className="w-3 h-3" />
            <span>{course.totalStudents}</span>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs font-medium">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span>{course.avgRating}</span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-col flex-1 p-5 gap-4 bg-linear-to-b from-white to-slate-50/30">
        {/* Price & Title */}
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-col">
              <h3 className="font-bold text-2xl bg-linear-to-r from-primary to-purple-600 bg-clip-text text-transparent leading-none">
                {course.finalPrice === 0 ? 'Miễn phí' : formattedFinalPrice}
              </h3>
              {isDiscounted && (
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-sm text-slate-400 line-through font-medium">
                    {formattedPrice}
                  </span>
                  <span className="text-xs font-bold text-red-500">
                    {discountDisplay}
                  </span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-gradient-to-r from-emerald-50 to-teal-50 w-fit px-3 py-1 rounded-full border border-emerald-200/50 shadow-sm">
                <span>{getLevelLabel(course.level)}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-600 bg-linear-to-br from-slate-100 to-slate-50 px-3 py-1.5 rounded-lg shadow-sm border border-slate-200/50">
                <Clock className="w-4 h-4" />
                <span className="text-xs font-semibold">{formatDuration(course.totalDurationMinutes)}</span>
              </div>
            </div>
          </div>

          <h3 className="font-semibold text-base line-clamp-2 text-slate-800 group-hover:text-primary transition-colors leading-snug">
            {course.title}
          </h3>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <button
              className="flex items-center gap-1.5 hover:text-purple-600 transition-colors cursor-pointer"
              onClick={(e) => { e.stopPropagation(); router.push(`/instructor/coupon?courseId=${course.id}`) }}
            >
              <Tag className="w-3.5 h-3.5 text-purple-500 shrink-0" />
              <span>{couponCount} mã giảm giá</span>
            </button>
            {pendingGradingCount > 0 && (
              <>
                <span className="text-slate-300 mx-0.5">•</span>
                <BookCheck className="w-3.5 h-3.5 shrink-0 text-amber-500" />
                <span>{pendingGradingCount} bài cần chấm</span>
              </>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-auto pt-3 flex items-center gap-1.5 border-t border-slate-100">
          {/* Edit Button */}
          <Button
            variant="outline"
            size="default"
            className="flex-1 h-10 text-sm font-semibold rounded-xl border-slate-200 hover:bg-slate-50 hover:border-primary/30 transition-all hover:text-black"
            onClick={(e) => {
              e.stopPropagation()
              router.push(`/instructor/courses/action/${course.id}`)
            }}
          >
            Chỉnh sửa
          </Button>

          {/* Publish/Unpublish Toggle */}
          {course.status === CourseStatus.Published ? (
            <Button
              variant="outline"
              size="default"
              className="flex-1 h-10 text-sm font-semibold rounded-xl text-orange-600 border-orange-200 bg-orange-50 hover:bg-orange-100 hover:border-orange-300 transition-all hover:text-red-600"
              onClick={(e) => {
                e.stopPropagation()
                unpublishCourse({ id: course.id })
              }}
              disabled={isUnpublishing}
            >
              {isUnpublishing ? "..." : "Ẩn khóa học"}
            </Button>
          ) : course.status === CourseStatus.Approved ? (
            <Button
              variant="outline"
              size="default"
              className="flex-1 h-10 text-sm font-semibold rounded-xl text-green-600 border-green-200 bg-green-50 hover:bg-green-100 hover:border-green-300 transition-all hover:text-green-600"
              onClick={(e) => {
                e.stopPropagation()
                publishCourse({ id: course.id })
              }}
              disabled={isPublishing}
            >
              {isPublishing ? "..." : "Công khai"}
            </Button>
          ) : course.status === CourseStatus.Draft || course.status === CourseStatus.Rejected ? (
            <Button
              variant="outline"
              size="default"
              className="flex-1 h-10 text-sm font-semibold rounded-lg text-purple-600 border-purple-200 bg-purple-50 hover:bg-purple-100 hover:border-purple-300 transition-all"
              onClick={(e) => {
                e.stopPropagation()
                submitCourseForReview({ id: course.id })
              }}
              disabled={isSubmitting}
            >
              {isSubmitting ? "..." : "Nộp duyệt"}
            </Button>
          ) : null}

          {/* More Actions Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="relative h-8 w-8 p-0 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-3.5 w-3.5" />
                {pendingGradingCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                  router.push(`/instructor/grading?courseId=${course.id}`)
                }}
                className="cursor-pointer"
              >
                <ClipboardCheck className={`mr-2 h-4 w-4 ${pendingGradingCount > 0 ? 'text-red-500' : ''}`} />
                <span className="flex-1">Chấm bài</span>
                {pendingGradingCount > 0 && (
                  <span className="ml-auto text-xs font-semibold text-white bg-red-500 rounded-full px-1.5 py-0.5 leading-none">
                    {pendingGradingCount}
                  </span>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                  router.push(`/instructor/coupon?courseId=${course.id}`)
                }}
                className="cursor-pointer"
              >
                <Ticket className="mr-2 h-4 w-4" />
                Tạo mã giảm giá
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                  setShowDeleteDialog(true)
                }}
                disabled={isDeleting}
                className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Xóa khóa học
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <CoursePreviewDialog
        courseId={course.id}
        open={showPreview}
        onOpenChange={setShowPreview}
        instructor={{
          name: course.instructorName || "",
          avatar: "", // Add avatar if available in course object or fetch it
          bio: ""
        }}
      />

      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Xóa khóa học"
        description="Bạn có chắc chắn muốn xóa khóa học này? Hành động này không thể hoàn tác!"
        confirmText="Xóa"
        cancelText="Hủy"
        onConfirm={() => deleteCourse({ id: course.id })}
        variant="destructive"
      />
    </div>
  )
}

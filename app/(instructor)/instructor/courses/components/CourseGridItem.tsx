
import { Badge } from '@/components/ui/badge'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { CoursePreviewDialog } from '@/components/widget/CoursePreviewDialog'
import { ConfirmDialog } from '@/components/widget/confirm-dialog'
import { useSubmitCourseForReview, usePublishCourse, useUnpublishCourse, useDeleteCourse } from '@/hooks/useCourse'
import {
  Star,
  Clock,
  Users,
  Eye,
  Trash2
} from 'lucide-react'
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

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) return `${hours}h ${mins}m`
    return `${mins}m`
  }

  const [showPreview, setShowPreview] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const { submitCourseForReview, isPending: isSubmitting } = useSubmitCourseForReview()
  const { publishCourse, isPending: isPublishing } = usePublishCourse()
  const { unpublishCourse, isPending: isUnpublishing } = useUnpublishCourse()
  const { deleteCourse, isPending: isDeleting } = useDeleteCourse()

  const handlePreview = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setShowPreview(true)
  }

  const handleAction = (e: React.MouseEvent, action: () => void) => {
    e.preventDefault()
    e.stopPropagation()
    action()
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
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-gradient-to-br from-slate-100 to-slate-50">
        <SafeImage
          src={formatImageUrl(course.thumbnailUrl) || '/images/placeholder.jpg'}
          alt={course.title}
          fill
          className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-105"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

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
      </div>

      {/* Content Section */}
      <div className="flex flex-col flex-1 p-5 gap-4 bg-gradient-to-b from-white to-slate-50/30">
        {/* Price & Title */}
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-2xl bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              {course.price === 0 ? 'Miễn phí' : formattedPrice}
            </h3>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-gradient-to-r from-emerald-50 to-teal-50 w-fit px-3 py-1 rounded-full border border-emerald-200/50 shadow-sm">
                <span>{getLevelLabel(course.level)}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-600 bg-gradient-to-br from-slate-100 to-slate-50 px-3 py-1.5 rounded-lg shadow-sm border border-slate-200/50">
                <Clock className="w-4 h-4" />
                <span className="text-xs font-semibold">{formatDuration(course.totalDurationMinutes)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-base line-clamp-2 min-h-[3rem] text-slate-800 group-hover:text-primary transition-colors leading-snug">
              {course.title}
            </h3>
            {course.shortDescription && (
              <p className="text-xs text-muted-foreground line-clamp-2">
                {course.shortDescription}
              </p>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{course.totalStudents}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span>{course.avgRating}</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-auto pt-3 flex gap-2 border-t border-slate-100">
          {/* Edit Button - Always visible */}
          <Button
            variant="outline"
            size="sm"
            className="hover:text-black flex-1 h-9 text-sm font-medium rounded-xl border-slate-200 hover:bg-slate-50 hover:border-primary/30 transition-all shadow-sm"
            onClick={() => window.location.href = `/instructor/courses/action/${course.id}`}
          >
            Chỉnh sửa
          </Button>

          {/* Primary Status Action - Prominently displayed */}
          {course.status === CourseStatus.Published ? (
            <Button
              variant="outline"
              size="sm"
              className="flex-1 h-9 text-sm font-medium rounded-xl hover:text-red-500 bg-gradient-to-r from-red-50 to-rose-50 text-red-700 hover:from-red-100 hover:to-rose-100 border border-red-200 shadow-sm hover:shadow-md transition-all"
              onClick={(e) => handleAction(e, () => unpublishCourse({ id: course.id }))}
              disabled={isUnpublishing}
            >
              {isUnpublishing ? "Đang xử lý..." : "Ẩn khóa học"}
            </Button>
          ) : course.status === CourseStatus.Approved ? (
            <Button
              variant="default"
              size="sm"
              className="flex-1 h-9 text-sm font-medium rounded-xl bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow-md transition-all"
              onClick={(e) => handleAction(e, () => publishCourse({ id: course.id }))}
              disabled={isPublishing}
            >
              {isPublishing ? "Đang xử lý..." : "Công khai"}
            </Button>
          ) : course.status === CourseStatus.PendingApproval ? (
            <Button
              variant="outline"
              size="sm"
              className="flex-1 h-9 text-sm font-medium rounded-xl text-yellow-600 border-yellow-200 bg-yellow-50 cursor-not-allowed"
              disabled
            >
              Đang chờ duyệt
            </Button>
          ) : (
            <Button
              variant="default"
              size="sm"
              className="flex-1 h-9 text-sm font-medium rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-sm hover:shadow-md transition-all"
              onClick={(e) => handleAction(e, () => submitCourseForReview({ id: course.id }))}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Đang xử lý..." : "Nộp duyệt"}
            </Button>
          )}

          {/* Delete Button */}
          <Button
            variant="ghost"
            size="sm"
            className="h-9 w-9 p-0 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setShowDeleteDialog(true)
            }}
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
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

import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Star,
  Edit,
  Eye,
  Clock,
  Users
} from 'lucide-react'
import { Course, CourseLevel, CourseStatus } from '@/lib/api/services/fetchCourse'
import { formatImageUrl } from '@/lib/utils/formatImageUrl'

interface CourseGridItemProps {
  course: Course
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

export default function CourseGridItem({ course }: CourseGridItemProps) {
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

  return (
    <div className="group flex flex-col h-full bg-white rounded-xl overflow-hidden border border-border/40 hover:shadow-lg transition-all duration-300">
      {/* Image Section */}
      <div className="relative w-full aspect-[4/3] overflow-hidden">
        <Image
          src={formatImageUrl(course.thumbnailUrl) || '/images/placeholder.jpg'}
          alt={course.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          unoptimized
        />

        {/* Overlay Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge className={`${getStatusColor(course.status)} text-white border-0 backdrop-blur-sm`}>
            {getStatusLabel(course.status)}
          </Badge>
        </div>

        <div className="absolute top-3 right-3">
          <Badge variant="secondary" className="backdrop-blur-md bg-white/90 text-primary font-semibold shadow-sm">
            {course.categoryName}
          </Badge>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        {/* Price & Title */}
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-xl text-primary truncate">
              {course.price === 0 ? 'Miễn phí' : formattedPrice}
            </h3>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-100 w-fit px-2 py-0.5 rounded-md">
                <span>{getLevelLabel(course.level)}</span>
              </div>
              <div className="flex items-center gap-1 text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                <Clock className="w-3.5 h-3.5" />
                <span className="text-xs font-semibold">{formatDuration(course.totalDurationMinutes)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="font-semibold text-base line-clamp-2 min-h-[3rem] text-slate-800 group-hover:text-primary transition-colors">
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
        <div className="mt-auto pt-2 flex gap-2">
          <Button variant="outline" className="flex-1 h-9 rounded-xl" onClick={() => window.location.href = `/instructor/courses/action/${course.id}`}>
            Chỉnh sửa
          </Button>
          <Button className="flex-1 h-9 rounded-xl">
            Xem
          </Button>
        </div>
      </div>
    </div>
  )
}

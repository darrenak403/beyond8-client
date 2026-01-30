import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Star,
  Edit,
  Home,
  Clock,
  Eye,
  Users
} from 'lucide-react'
import { Course, CourseLevel, CourseStatus } from '@/lib/api/services/fetchCourse'

interface CourseListItemProps {
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

export default function CourseListItem({ course }: CourseListItemProps) {
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
    <div className="group flex bg-white rounded-xl overflow-hidden border border-border/40 hover:border-primary/50 hover:shadow-lg transition-all duration-300 p-3 gap-4">
      {/* Image Section */}
      <div className="relative w-72 shrink-0 aspect-[16/9] rounded-lg overflow-hidden">
        <Image
          src={course.thumbnailUrl || '/images/placeholder.jpg'}
          alt={course.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          unoptimized
        />

        {/* Overlay Badges */}
        <div className="absolute top-2 left-2 flex gap-2">
          <Badge className={`${getStatusColor(course.status)} text-white border-0 backdrop-blur-sm text-xs h-5 px-1.5`}>
            {getStatusLabel(course.status)}
          </Badge>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col justify-between py-1">
        <div className="flex justify-between items-start">
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <h3 className="font-bold text-xl text-primary">
                {course.price === 0 ? 'Miễn phí' : formattedPrice}
              </h3>
              <div className="flex items-center gap-1 text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                <Clock className="w-3.5 h-3.5" />
                <span className="text-xs font-semibold">{formatDuration(course.totalDurationMinutes)}</span>
              </div>
              <Badge variant="outline" className="text-xs font-normal text-slate-500 border-slate-200">
                {course.categoryName}
              </Badge>
              <Badge variant="secondary" className="text-xs font-normal bg-slate-100 text-slate-600 hover:bg-slate-200">
                {getLevelLabel(course.level)}
              </Badge>
            </div>



            <div className="space-y-1">
              <h3 className="font-semibold text-base text-slate-800 group-hover:text-primary transition-colors">
                {course.title}
              </h3>
              <p className="text-sm text-slate-500">
                {course.instructorName}
              </p>
              <p className="text-sm text-slate-500">
                {course.shortDescription}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex items-center gap-6 mt-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4" />
            <span>{course.totalStudents}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span>{course.avgRating}</span>
          </div>
        </div>
      </div>

      {/* Action Section (Right) */}
      <div className="flex flex-col justify-center gap-2 shrink-0 w-auto pl-4 border-l border-border/50 my-1">
        <Button variant="outline" className="h-8 text-xs px-3 rounded-xl">
          <Edit className="w-3.5 h-3.5 mr-1.5" />
          Chỉnh sửa
        </Button>
        <Button variant="default" className="h-8 text-xs px-3 rounded-xl">
          <Eye className="w-3.5 h-3.5 mr-1.5" />
          Xem chi tiết
        </Button>
      </div>
    </div>
  )
}

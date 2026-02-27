
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Star,
    Clock,
    Users,
} from 'lucide-react'
import { Course, CourseLevel, CourseStatus } from '@/lib/api/services/fetchCourse'
import { formatImageUrl } from '@/lib/utils/formatImageUrl'
import SafeImage from '@/components/ui/SafeImage'

interface GradingCourseGridItemProps {
    course: Course
    onSelect: (courseId: string) => void
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

export default function GradingCourseGridItem({ course, onSelect }: GradingCourseGridItemProps) {
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
        <div
            className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-slate-200/60 transition-all duration-300 hover:border-brand-magenta/30 hover:translate-y-[-4px] hover:shadow-xl hover:shadow-brand-magenta/5 cursor-pointer"
            onClick={() => onSelect(course.id)}
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
                    <Badge variant="secondary" className="backdrop-blur-lg bg-white/95 text-brand-magenta font-semibold shadow-lg border border-white/50">
                        {course.categoryName}
                    </Badge>
                </div>
            </div>

            {/* Content Section */}
            <div className="flex flex-col flex-1 p-5 gap-4 bg-linear-to-b from-white to-slate-50/30">
                {/* Price & Title */}
                <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                        <h3 className="font-bold text-2xl bg-linear-to-r from-brand-magenta to-purple-600 bg-clip-text text-transparent">
                            {course.price === 0 ? 'Miễn phí' : formattedPrice}
                        </h3>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-linear-to-r from-emerald-50 to-teal-50 w-fit px-3 py-1 rounded-full border border-emerald-200/50 shadow-sm">
                                <span>{getLevelLabel(course.level)}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-600 bg-linear-to-br from-slate-100 to-slate-50 px-3 py-1.5 rounded-lg shadow-sm border border-slate-200/50">
                                <Clock className="w-4 h-4" />
                                <span className="text-xs font-semibold">{formatDuration(course.totalDurationMinutes)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h3 className="font-semibold text-base line-clamp-2 min-h-12 text-slate-800 group-hover:text-brand-magenta transition-colors leading-snug">
                            {course.title}
                        </h3>

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
                    <Button
                        className="w-full rounded-xl bg-brand-magenta text-white shadow-lg shadow-brand-magenta/20 hover:bg-brand-magenta/90"
                        onClick={(e) => {
                            e.stopPropagation()
                            onSelect(course.id)
                        }}
                    >
                        Chấm bài ngay
                    </Button>
                </div>
            </div>
        </div>
    )
}

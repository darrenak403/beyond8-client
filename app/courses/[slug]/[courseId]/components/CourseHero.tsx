'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import {
  Star,
  Users,
  Clock,
  BookOpen,
  Calendar,
  Share2,
  Heart,
  MessageSquare
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import SafeImage from '@/components/ui/SafeImage'
import { formatNumber } from '@/lib/utils/formatCurrency'
import { CourseSummary, CourseDetail as CourseDetailType } from '@/lib/api/services/fetchCourse'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { formatImageUrl } from '@/lib/utils/formatImageUrl'
import { useUserById } from '@/hooks/useUserProfile'
import CourseReviewDialog from '@/components/widget/CourseReviewDialog'

interface CourseHeroProps {
  course: CourseSummary | CourseDetailType
  instructor?: {
    name: string
    avatar?: string
    bio?: string
  }
  enrollmentId?: string
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

export default function CourseHero({ course, instructor, enrollmentId }: CourseHeroProps) {
  const params = useParams()
  const { user: instructorUser } = useUserById(course.instructorId)
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false)
  // Ensure we have params before constructing URL, fallback to '#' if not
  const profileUrl = params?.slug && params?.courseId
    ? `/courses/${params.slug}/${params.courseId}/instructor/${course.instructorId}`
    : '#'

  const levelColors: Record<string, string> = {
    Beginner: 'bg-green-500/10 text-green-500 border-green-500/20',
    Intermediate: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    Advanced: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    Expert: 'bg-red-500/10 text-red-500 border-red-500/20',
  }

  const levelText: Record<string, string> = {
    Beginner: 'Cơ bản',
    Intermediate: 'Trung bình',
    Advanced: 'Nâng cao',
    Expert: 'Chuyên gia',
  }

  const levelColor = levelColors[course.level] || 'bg-white/10 text-white border-white/20'

  // Parse rating from string to number
  const rating = course.avgRating ? parseFloat(course.avgRating) : 0
  const displayRating = rating > 0 ? rating.toFixed(1) : '0.0'

  // Format duration
  const duration = formatDuration(course.totalDurationMinutes)

  // Format updated date
  const updatedDate = course.updatedAt
    ? formatDateForDisplay(course.updatedAt)
    : course.createdAt
      ? formatDateForDisplay(course.createdAt)
      : 'Th11 2025'

  // Format date helper
  function formatDateForDisplay(dateString: string): string {
    try {
      const date = new Date(dateString)
      const months = ['Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7', 'Th8', 'Th9', 'Th10', 'Th11', 'Th12']
      return `${months[date.getMonth()]} ${date.getFullYear()}`
    } catch {
      return 'Th11 2025'
    }
  }

  return (
    <div className="relative w-full overflow-hidden bg-brand-dark min-h-[500px] flex items-center">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <SafeImage
          src={course.thumbnailUrl}
          alt={course.title}
          fill
          className="object-cover opacity-100 scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-r from-brand-dark via-brand-dark/95 to-brand-dark/40" />
        <div className="absolute inset-0 bg-linear-to-t from-brand-dark via-transparent to-transparent" />
      </div>

      <div className="container relative z-10 mx-auto px-4 py-12 md:py-16">
        <div className="max-w-3xl space-y-6">
          {/* Breadcrumb / Category */}
          <div className="flex items-center gap-3 text-sm font-medium text-brand-pink/90">
            <span className="uppercase tracking-wider">Khóa học</span>
            <span>/</span>
            <span className="uppercase tracking-wider text-white/80">{course.categoryName}</span>
          </div>

          {/* Title and Badges */}
          <div className="space-y-4">
            <Badge className={`${levelColor} backdrop-blur-sm`} variant="outline">
              {levelText[course.level] || course.level}
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              {course.title}
            </h1>
            <p className="text-lg md:text-xl text-white/80 line-clamp-2 max-w-2xl leading-relaxed">
              {course.shortDescription || 'Khóa học chất lượng cao'}
            </p>
          </div>

          {/* Stats & Info */}
          <div className="flex flex-wrap items-center gap-y-4 gap-x-8 text-white/90">
            <div className="flex items-center gap-2">
              <span className="bg-yellow-500/20 p-1.5 rounded-lg">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              </span>
              <div>
                <div className="font-bold flex items-center gap-1">
                  {displayRating}
                  <span className="text-xs text-white/50 font-normal">/ 5.0</span>
                </div>
                <div className="text-xs text-white/60">Đánh giá ({formatNumber(course.totalReviews)})</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="bg-blue-500/20 p-1.5 rounded-lg">
                <Users className="w-5 h-5 text-blue-400" />
              </span>
              <div>
                <div className="font-bold">{formatNumber(course.totalStudents)}</div>
                <div className="text-xs text-white/60">Học viên</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="bg-purple-500/20 p-1.5 rounded-lg">
                <Clock className="w-5 h-5 text-purple-400" />
              </span>
              <div>
                <div className="font-bold">{duration}</div>
                <div className="text-xs text-white/60">Thời lượng</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="bg-pink-500/20 p-1.5 rounded-lg">
                <Calendar className="w-5 h-5 text-pink-400" />
              </span>
              <div>
                <div className="font-bold">Cập nhật</div>
                <div className="text-xs text-white/60">{updatedDate}</div>
              </div>
            </div>

            {course.language && (
              <div className="flex items-center gap-2">
                <span className="bg-orange-500/20 p-1.5 rounded-lg">
                  <BookOpen className="w-5 h-5 text-orange-400" />
                </span>
                <div>
                  <div className="font-bold">{course.language}</div>
                  <div className="text-xs text-white/60">Ngôn ngữ</div>
                </div>
              </div>
            )}
          </div>

          {/* Instructor Mini Preview */}
          <div className="flex items-center gap-4 pt-4 border-t border-white/10">
            <div className="flex items-center gap-3">
              <Link href={profileUrl}>
                <Avatar className="h-10 w-10 ring-2 ring-brand-purple/50 cursor-pointer hover:ring-brand-pink transition-all">
                  <SafeImage
                    src={formatImageUrl(instructorUser?.avatarUrl || '') || "/bg-web.jpg"}
                    alt={instructorUser?.fullName || course.instructorName}
                    fill
                    className="object-cover"
                  />
                  <AvatarFallback>{(instructorUser?.fullName || course.instructorName).charAt(0)}</AvatarFallback>
                </Avatar>
              </Link>
              <div>
                <div className="text-xs text-white/50">Được tạo bởi</div>
                <Link href={profileUrl}>
                  <div className="text-sm font-semibold text-white hover:text-brand-pink cursor-pointer transition-colors">
                    {instructor?.name || course.instructorName}
                  </div>
                </Link>
              </div>
            </div>

            <div className="flex-1" />

            <div className="flex gap-2">
              {enrollmentId && (
                <Button
                  variant="outline"
                  onClick={() => setIsReviewDialogOpen(true)}
                  className="h-9 bg-white/5 border-white/10 hover:bg-white/10 text-white hover:text-brand-pink transition-colors"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Viết đánh giá
                </Button>
              )}
              <Button variant="outline" size="icon" className="h-9 w-9 bg-white/5 border-white/10 hover:bg-white/10 text-white hover:text-brand-pink transition-colors">
                <Heart className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-9 w-9 bg-white/5 border-white/10 hover:bg-white/10 text-white hover:text-brand-pink transition-colors">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Review Dialog */}
      {enrollmentId && (
        <CourseReviewDialog
          open={isReviewDialogOpen}
          onOpenChange={setIsReviewDialogOpen}
          courseId={course.id}
          enrollmentId={enrollmentId}
        />
      )}
    </div>
  )
}

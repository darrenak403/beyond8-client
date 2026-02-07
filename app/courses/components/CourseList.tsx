'use client'

import { Course } from '@/lib/api/services/fetchCourse'
import CourseCard from './CourseCard'
import { Skeleton } from '@/components/ui/skeleton'
import { useIsMobile } from '@/hooks/useMobile'

interface CourseListProps {
  courses: Course[]
  isLoading?: boolean
}

export default function CourseList({ courses, isLoading }: CourseListProps) {
  const isMobile = useIsMobile()
  const skeletonCount = isMobile ? 4 : 10

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-40 w-full rounded-lg" />
            <Skeleton className="h-3 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-5 w-1/3" />
          </div>
        ))}
      </div>
    )
  }

  if (courses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold mb-2">Không tìm thấy khóa học</h3>
        <p className="text-muted-foreground">
          Thử điều chỉnh bộ lọc để tìm thêm khóa học khác
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  )
}

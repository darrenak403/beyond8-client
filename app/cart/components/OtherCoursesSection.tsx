'use client'

import { useGetCourses } from '@/hooks/useCourse'
import CourseList from '@/app/courses/components/CourseList'
import { useIsMobile } from '@/hooks/useMobile'

export default function OtherCoursesSection() {
  const isMobile = useIsMobile()
  const { courses, isLoading } = useGetCourses({
    pageNumber: 1,
    pageSize: isMobile ? 4 : 10,
    isRandom: true,
  })

  if (!courses || courses.length === 0) {
    return null
  }

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6 text-foreground">Khóa học khác bạn có thể quan tâm</h2>
        <CourseList courses={courses} isLoading={isLoading} />
      </div>
    </section>
  )
}

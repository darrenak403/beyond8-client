'use client'

import { BookOpen } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { useGetMostPopularCourses } from '@/hooks/useCourse'
import CourseCard from '@/app/courses/components/CourseCard'
import { Skeleton } from '@/components/ui/skeleton'
import { useMemo } from 'react'

interface InstructorCoursesSectionProps {
  instructorId?: string
}

export default function InstructorCoursesSection({ instructorId }: InstructorCoursesSectionProps) {
  const { courses, isLoading } = useGetMostPopularCourses()

  // Filter courses by instructorId if provided
  const instructorCourses = useMemo(() => {
    if (!instructorId) return courses
    return courses.filter(course => course.instructorId === instructorId)
  }, [courses, instructorId])

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <div className="p-2 bg-purple-50 rounded-lg">
          <BookOpen className="w-6 h-6 text-purple-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">
          Các khóa học {instructorCourses.length > 0 && `(${instructorCourses.length})`}
        </h2>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="border-2 border-purple-100 rounded-4xl overflow-hidden">
              <Skeleton className="w-full aspect-square" />
              <CardContent className="p-3 space-y-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-3/4" />
                <Skeleton className="h-2 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : instructorCourses.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {instructorCourses.map((course) => (
            <div key={course.id} className="h-full">
              <CourseCard course={course} />
            </div>
          ))}
        </div>
      ) : (
        <Card className="border-2 border-purple-100 hover:border-purple-300 transition-colors rounded-4xl">
          <CardContent className="py-12 text-center">
            <div className="space-y-3">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-100">
                <BookOpen className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {instructorId ? 'Chưa có khóa học nào' : 'Chưa có khóa học phổ biến'}
                </h3>
                <p className="text-gray-500 mt-1">
                  {instructorId 
                    ? 'Giảng viên này chưa có khóa học nào trong top phổ biến'
                    : 'Hiện tại chưa có khóa học phổ biến nào'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

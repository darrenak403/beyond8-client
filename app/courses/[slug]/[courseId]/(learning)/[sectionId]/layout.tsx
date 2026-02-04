'use client'

import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useGetCourseDetails, useGetCourseSummary } from '@/hooks/useCourse'
import { useAuth } from '@/hooks/useAuth'
import { useCheckEnrollment } from '@/hooks/useEnroll'
import LearningLayoutClient from './components/LearningLayoutClient'
import { Skeleton } from '@/components/ui/skeleton'

export default function Layout({ children }: { children: React.ReactNode }) {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const courseId = params?.courseId as string
  const slug = params?.slug as string
  const sectionId = params?.sectionId as string
  const { isAuthenticated } = useAuth()
  const mode = searchParams.get('source') === 'summary' ? 'summary' : 'details'

  // Fetch course data từ API cho layout learning (dùng cho cả preview và học viên đã enroll).
  // Hook phải được gọi trước mọi early return khác.
  const {
    courseDetails,
    isLoading: isLoadingDetails,
    isError: isErrorDetails,
  } = useGetCourseDetails(courseId, {
    enabled: !!courseId && mode === 'details',
  })

  const {
    courseSummary,
    isLoading: isLoadingSummary,
    isError: isErrorSummary,
  } = useGetCourseSummary(courseId)

  // Kiểm tra enrollment (dùng cho sidebar / quyền truy cập lesson), nhưng
  // KHÔNG chặn xem video preview nếu chưa enroll.
  const {
    isEnrolled,
  } = useCheckEnrollment(courseId, {
    enabled: !!courseId && isAuthenticated,
  })

  // Check if params exist
  if (!courseId || !slug || !sectionId) {
    router.push('/courses')
    return null
  }

  const isLoading = mode === 'details' ? isLoadingDetails : isLoadingSummary
  const isError = mode === 'details' ? isErrorDetails : isErrorSummary
  const course = (mode === 'details' ? courseDetails : courseSummary)

  if (isLoading) {
    return (
      <div className="flex h-screen w-full bg-[#0a0a0f] text-white overflow-hidden">
        <div className="flex-1 flex flex-col min-w-0 h-full">
          <Skeleton className="h-16 w-full" />
          <div className="flex-1 overflow-y-auto p-6">
            <Skeleton className="w-full aspect-video mb-8" />
            <Skeleton className="w-full h-64" />
          </div>
        </div>
      </div>
    )
  }

  if (isError || !course) {
    router.push('/courses')
    return null
  }

  return (
    <LearningLayoutClient 
      courseId={courseId}
      slug={slug}
      course={course}
      isEnrolled={!!isEnrolled}
      params={{
        slug,
        courseId,
        sectionId
      }}
    >
      {children}
    </LearningLayoutClient>
  )
}

'use client'

import { useParams, useRouter } from 'next/navigation'
import { useGetCourseDetails, useGetCourseSummary } from '@/hooks/useCourse'
import { useAuth } from '@/hooks/useAuth'
import { useCheckEnrollment } from '@/hooks/useEnroll'
import LearningLayoutClient from './components/LearningLayoutClient'
import { Skeleton } from '@/components/ui/skeleton'

export default function Layout({ children }: { children: React.ReactNode }) {
  const params = useParams()
  const router = useRouter()
  const courseId = params?.courseId as string
  const slug = params?.slug as string
  const sectionId = params?.sectionId as string
  const { isAuthenticated } = useAuth()

  // 1. Kiểm tra enrollment trước
  const {
    isEnrolled,
    isLoading: isCheckingEnroll
  } = useCheckEnrollment(courseId, {
    enabled: !!courseId && isAuthenticated,
  })

  // 2. Xác định mode dựa trên enrollment
  // Nếu chưa login -> summary
  // Nếu đang check enroll -> chưa quyết định (đợi)
  // Nếu đã enroll -> details
  // Nếu chưa enroll -> summary
  const shouldFetchDetails = isAuthenticated && !isCheckingEnroll && isEnrolled
  const shouldFetchSummary = !isAuthenticated || (!isCheckingEnroll && !isEnrolled)

  // 3. Fetch data tương ứng
  const {
    courseDetails,
    isLoading: isLoadingDetails,
    isError: isErrorDetails,
  } = useGetCourseDetails(courseId, {
    enabled: !!courseId && shouldFetchDetails,
  })

  const {
    courseSummary,
    isLoading: isLoadingSummary,
    isError: isErrorSummary,
  } = useGetCourseSummary(courseId, {
    enabled: !!courseId && shouldFetchSummary,
  })

  // Check if params exist
  if (!courseId || !slug || !sectionId) {
    router.push('/courses')
    return null
  }

  // 4. Determine final state
  // Nếu đang check enroll hoặc đang fetch data tương ứng -> Loading
  const isLoading = isCheckingEnroll || (shouldFetchDetails ? isLoadingDetails : isLoadingSummary)
  const isError = shouldFetchDetails ? isErrorDetails : isErrorSummary
  const course = shouldFetchDetails ? courseDetails : courseSummary

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

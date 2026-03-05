'use client'

import { useParams, useSearchParams, useRouter } from 'next/navigation'
import { useGetCourseDetails, useGetCourseSummary } from '@/hooks/useCourse'
import { useAuth } from '@/hooks/useAuth'
import { useCheckEnrollment } from '@/hooks/useEnroll'
import LearningLayoutClient from '../[courseId]/(learning)/[sectionId]/components/LearningLayoutClient'
import { Skeleton } from '@/components/ui/skeleton'
import { decodeCompoundId } from '@/utils/crypto'

export default function LearningLayout({ children }: { children: React.ReactNode }) {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const slug = params?.slug as string

  const ids = decodeCompoundId(searchParams.get('id') || '')
  const courseId = ids[0] || ''
  const sectionId = ids[1] || ''

  const { isAuthenticated } = useAuth()

  const {
    isEnrolled,
    isLoading: isCheckingEnroll,
  } = useCheckEnrollment(courseId, {
    enabled: !!courseId && isAuthenticated,
  })

  const shouldFetchDetails = isAuthenticated && !isCheckingEnroll && isEnrolled
  const shouldFetchSummary = !isAuthenticated || (!isCheckingEnroll && !isEnrolled)

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

  if (!courseId || !slug || !sectionId) {
    router.push('/courses')
    return null
  }

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

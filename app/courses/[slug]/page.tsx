'use client'

import { useParams, useSearchParams } from 'next/navigation'
import CourseDetail from './[courseId]/components/CourseDetail'
import NotFound from './[courseId]/not-found'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { useGetCourseSummary, useGetCourseDetails } from '@/hooks/useCourse'
import { useAuth } from '@/hooks/useAuth'
import { Skeleton } from '@/components/ui/skeleton'
import { useCheckEnrollment, useGetMyEnrollments } from '@/hooks/useEnroll'
import { decodeCompoundId } from '@/utils/crypto'

export default function CourseDetailPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const slug = params?.slug as string

  // Decode courseId from compound query param
  const ids = decodeCompoundId(searchParams.get('id') || '')
  const courseId = ids[0] || ''

  const { isAuthenticated } = useAuth()

  const {
    isEnrolled,
    isLoading: isCheckingEnroll,
  } = useCheckEnrollment(courseId, {
    enabled: !!courseId && isAuthenticated,
  })

  if (!courseId || !slug) {
    return <NotFound />
  }

  if (!isAuthenticated) {
    return (
      <PageLayout>
        <CourseSummarySection courseId={courseId} slug={slug} />
      </PageLayout>
    )
  }

  if (isCheckingEnroll) {
    return (
      <PageLayout>
        <CourseContentSkeleton />
      </PageLayout>
    )
  }

  const showDetails = isEnrolled

  return (
    <PageLayout>
      {showDetails ? (
        <CourseDetailsSection courseId={courseId} slug={slug} />
      ) : (
        <CourseSummarySection courseId={courseId} slug={slug} />
      )}
    </PageLayout>
  )
}

function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="flex-1">
        {children}
      </div>
      <Footer />
    </div>
  )
}

function CourseContentSkeleton() {
  return (
    <div>
      <Skeleton className="h-96 w-full mb-8" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
        <div className="lg:col-span-1">
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    </div>
  )
}

function CourseSummarySection({ courseId, slug }: { courseId: string; slug: string }) {
  const {
    courseSummary,
    isLoading,
    isError,
  } = useGetCourseSummary(courseId)

  if (isLoading) {
    return <CourseContentSkeleton />
  }

  if (isError || !courseSummary) {
    return <NotFound />
  }

  return <CourseDetail courseData={courseSummary} mode="summary" />
}

function CourseDetailsSection({ courseId, slug }: { courseId: string; slug: string }) {
  const {
    courseDetails,
    isLoading,
    isError,
  } = useGetCourseDetails(courseId)

  const { enrollments } = useGetMyEnrollments()
  const enrollment = enrollments.find(e => e.courseId === courseId)
  const enrollmentId = enrollment?.id

  if (isLoading) {
    return <CourseContentSkeleton />
  }

  if (isError || !courseDetails) {
    return <NotFound />
  }

  return <CourseDetail courseData={courseDetails} mode="details" enrollmentId={enrollmentId} />
}

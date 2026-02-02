'use client'

import { useParams } from 'next/navigation'
import CourseDetail from './components/CourseDetail'
import NotFound from './not-found'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { useGetCourseSummary, useGetCourseDetails } from '@/hooks/useCourse'
import { useAuth } from '@/hooks/useAuth'
import { Skeleton } from '@/components/ui/skeleton'

export default function CourseDetailPage() {
  const params = useParams()
  const courseId = params?.courseId as string
  const slug = params?.slug as string
  const { isAuthenticated } = useAuth()

  // Always call hooks, but conditionally use results
  const {
    courseSummary,
    isLoading: isLoadingSummary,
    isError: isErrorSummary,
  } = useGetCourseSummary(courseId)

  const {
    courseDetails,
    isLoading: isLoadingDetails,
    isError: isErrorDetails,
  } = useGetCourseDetails(courseId)

  // Check if params exist
  if (!courseId || !slug) {
    return <NotFound />
  }

  const isLoading = isAuthenticated ? isLoadingDetails : isLoadingSummary
  const isError = isAuthenticated ? isErrorDetails : isErrorSummary
  const courseData = isAuthenticated ? courseDetails : courseSummary

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 w-full container mx-auto px-4 py-8">
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
        <Footer />
      </div>
    )
  }

  if (isError || !courseData) {
    return <NotFound />
  }

  // Verify slug matches
  if (courseData.slug && courseData.slug !== slug) {
    // Slug doesn't match, but we'll still show the course if ID matches
    // In production, you might want to redirect to correct slug
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="flex-1 w-full">
        <CourseDetail courseData={courseData} />
      </div>
      <Footer />
    </div>
  )
}

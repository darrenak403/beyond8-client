'use client'

import { useParams, useRouter } from 'next/navigation'
import { useGetCourseDetails } from '@/hooks/useCourse'
import { useAuth } from '@/hooks/useAuth'
import LearningLayoutClient from './components/LearningLayoutClient'
import { Skeleton } from '@/components/ui/skeleton'

export default function Layout({ children }: { children: React.ReactNode }) {
  const params = useParams()
  const router = useRouter()
  const courseId = params?.courseId as string
  const slug = params?.slug as string
  const sectionId = params?.sectionId as string
  const { isAuthenticated } = useAuth()

  // Check if params exist
  if (!courseId || !slug || !sectionId) {
    router.push('/courses')
    return null
  }

  // Fetch course data from API
  const {
    courseDetails,
    isLoading,
    isError,
  } = useGetCourseDetails(courseId)

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

  if (isError || !courseDetails) {
    router.push('/courses')
    return null
  }

  return (
    <LearningLayoutClient 
      courseId={courseId}
      slug={slug}
      course={courseDetails}
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

'use client'

import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useGetCourseDetails, useGetCourseSummary } from '@/hooks/useCourse'
import type { CourseDetail, CourseSummary, LessonSummary, SectionSummary, SectionDetail } from '@/lib/api/services/fetchCourse'
import type { Lesson } from '@/lib/api/services/fetchLesson'
import { useAuth } from '@/hooks/useAuth'
import { useCheckEnrollment } from '@/hooks/useEnroll'
import VideoLesson from './components/VideoLesson'
import TextLesson from './components/TextLesson'
import LessonInfo from './components/LessonInfo'
import { Skeleton } from '@/components/ui/skeleton'
import { formatHls, getResolvedHlsVariants } from '@/lib/utils/formatHls'
import { useUserById } from '@/hooks/useUserProfile'
import { useGetVideoByLessonId } from '@/hooks/useLesson'


import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const NavigationButton = ({
  direction,
  lesson,
  baseUrl
}: {
  direction: 'prev' | 'next'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  lesson?: any
  baseUrl: string
}) => {
  if (!lesson) {
    return <div className="w-10 md:w-12 shrink-0" /> // Spacer
  }

  const Icon = direction === 'prev' ? ChevronLeft : ChevronRight
  const href = `${baseUrl}/${lesson.sectionId}/${lesson.id}`

  return (
    <Link
      href={href}
      className="w-10 md:w-12 h-10 md:h-12 shrink-0 flex items-center justify-center rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50 hover:border-brand-purple/50 cursor-pointer transition-all group"
      title={lesson.title}
    >
      <Icon className="w-5 h-5 md:w-6 md:h-6 text-gray-500 group-hover:text-brand-purple transition-colors" />
    </Link>
  )
}

export default function LessonPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params?.courseId as string
  const slug = params?.slug as string
  const sectionId = params?.sectionId as string
  const lessonId = params?.lessonId as string
  const { isAuthenticated } = useAuth()
  // 1. Kiểm tra enrollment
  const {
    isEnrolled,
    isLoading: isCheckingEnroll
  } = useCheckEnrollment(courseId, {
    enabled: !!courseId && isAuthenticated,
  })

  // 2. Xác định mode tương tự layout
  const shouldFetchDetails = isAuthenticated && !isCheckingEnroll && isEnrolled
  const shouldFetchSummary = !isAuthenticated || (!isCheckingEnroll && !isEnrolled)

  // 3. Fetch data tương ứng
  const {
    courseDetails,
    isLoading: isLoadingDetails,
    isError: isErrorDetails,
  } = useGetCourseDetails(courseId || "", {
    enabled: !!courseId && shouldFetchDetails,
  })

  const {
    courseSummary,
    isLoading: isLoadingSummary,
    isError: isErrorSummary,
  } = useGetCourseSummary(courseId || "", {
    enabled: !!courseId && shouldFetchSummary,
  })

  // Check if params exist
  if (!courseId || !slug || !sectionId || !lessonId) {
    router.push('/courses')
    return null
  }

  // 4. Determine final state
  const mode = shouldFetchDetails ? 'details' : 'summary'
  const isLoading = isCheckingEnroll || (shouldFetchDetails ? isLoadingDetails : isLoadingSummary)
  const isError = shouldFetchDetails ? isErrorDetails : isErrorSummary
  const course = (shouldFetchDetails ? courseDetails : courseSummary) as CourseDetail | CourseSummary | undefined

  // Find current section and lesson safely
  type AnySection = SectionSummary | SectionDetail
  type AnyLesson = LessonSummary | Lesson

  // Use optional chaining to avoid crashes if course is not yet loaded
  const section = (course?.sections as AnySection[])?.find((s) => s.id === sectionId)
  const lesson = section?.lessons?.find((l) => l.id === lessonId) as AnyLesson | undefined

  // 5. Fetch video data if lesson is video
  // Hook must be called unconditionally at top level
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { video: videoData, isLoading: isLoadingVideo } = useGetVideoByLessonId(lessonId, {
    enabled: !!lesson && lesson.type === 'Video'
  })

  if (isLoading) {
    return (
      <div className="w-full max-w-[1600px] mx-auto p-0 lg:p-6">
        <Skeleton className="w-full aspect-video" />
        <Skeleton className="w-full h-64" />
      </div>
    )
  }

  if (isError || !course) {
    router.push('/courses')
    return null
  }

  if (!section || !lesson) {
    router.push(`/courses/${slug}/${courseId}`)
    return null
  }

  if (mode === 'details' && (!isAuthenticated || !isEnrolled) && !lesson.isPreview) {
    router.push(`/courses/${slug}/${courseId}`)
    return null
  }

  // Resolve video URL from hook data
  const rawHlsVariants = videoData?.hlsVariants
  const originalUrl = videoData?.videoOriginalUrl

  const resolvedFromHls = formatHls(rawHlsVariants ?? null)
  const variants = getResolvedHlsVariants(rawHlsVariants ?? null)

  const videoUrl = resolvedFromHls ?? originalUrl

  if (lesson.type === 'Video' && isLoadingVideo) {
    return (
      <div className="w-full max-w-[1600px] mx-auto p-0 lg:p-6">
        <Skeleton className="w-full aspect-video" />
        <Skeleton className="w-full h-20 mt-4" />
      </div>
    )
  }

  // Flatten lessons for navigation
  const allLessons = (course.sections as AnySection[]).flatMap((s) =>
    s.lessons.map((l) => ({ ...l, sectionId: s.id }))
  )

  const currentIndex = allLessons.findIndex((l) => l.id === lessonId)
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null

  const baseUrl = `/courses/${slug}/${courseId}`

  return (
    <div className="w-full max-w-[1550px] mx-auto p-0 lg:p-6">
      <div className="flex items-start gap-2 md:gap-4 mb-2">
        <div className="flex-1 min-w-0">
          <div className="w-full max-w-6xl mx-auto">
            {lesson.type === 'Video' && (
              <VideoLesson
                title={lesson.title}
                description={lesson.description}
                videoUrl={videoUrl}
                thumbnailUrl={'videoThumbnailUrl' in lesson ? lesson.videoThumbnailUrl : null}
                variants={variants}
                durationSeconds={
                  'durationSeconds' in lesson ? lesson.durationSeconds : null
                }
                originVideoUrl={videoData?.videoOriginalUrl || ''}
                isDownloadable={'isDownloadable' in lesson ? lesson.isDownloadable : false}
              />
            )}
            {lesson.type === 'Text' && (
              <TextLesson
                title={lesson.title}
                content={'textContent' in lesson ? lesson.textContent : null}
              />
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation (Bottom) */}
      <div className="md:hidden flex justify-between gap-4 px-4 pb-8">
        <NavigationButton direction="prev" lesson={prevLesson} baseUrl={baseUrl} />
        <NavigationButton direction="next" lesson={nextLesson} baseUrl={baseUrl} />
      </div>

      {/* LessonInfo - Separated Area */}
      <div className="mt-2 border-t border-gray-200 pt-4">
        <LessonInfo
          course={course}
          currentLesson={lesson as Lesson}
          slug={slug}
          courseId={courseId}
        />
      </div>
    </div>
  )
}

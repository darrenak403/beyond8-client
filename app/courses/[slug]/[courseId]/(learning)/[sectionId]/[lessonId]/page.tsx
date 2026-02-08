'use client'

import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useGetCourseDetails, useGetCourseSummary } from '@/hooks/useCourse'
import type { CourseDetail, CourseSummary, LessonSummary, SectionSummary, SectionDetail } from '@/lib/api/services/fetchCourse'
import type { Lesson } from '@/lib/api/services/fetchLesson'
import { useAuth } from '@/hooks/useAuth'
import { useCheckEnrollment } from '@/hooks/useEnroll'
import VideoLesson from './components/VideoLesson'
import LessonInfo from './components/LessonInfo'
import { Skeleton } from '@/components/ui/skeleton'
import { formatHls } from '@/lib/utils/formatHls'


export default function LessonPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const courseId = params?.courseId as string
  const slug = params?.slug as string
  const sectionId = params?.sectionId as string
  const lessonId = params?.lessonId as string
  const { isAuthenticated } = useAuth()
  const mode = searchParams.get('source') === 'summary' ? 'summary' : 'details'

  // Kiểm tra enrollment (để chặn xem bài không phải preview nếu chưa enroll)
  const {
    isEnrolled,
  } = useCheckEnrollment(courseId, {
    enabled: !!courseId && isAuthenticated,
  })

  // Fetch course data cho màn học bài
  const {
    courseDetails,
    isLoading: isLoadingDetails,
    isError: isErrorDetails,
  } = useGetCourseDetails(courseId || "", {
    enabled: !!courseId && mode === 'details',
  })

  const {
    courseSummary,
    isLoading: isLoadingSummary,
    isError: isErrorSummary,
  } = useGetCourseSummary(courseId || "")

  // Check if params exist
  if (!courseId || !slug || !sectionId || !lessonId) {
    router.push('/courses')
    return null
  }

  const isLoading = mode === 'details' ? isLoadingDetails : isLoadingSummary
  const isError = mode === 'details' ? isErrorDetails : isErrorSummary
  const course = (mode === 'details' ? courseDetails : courseSummary) as CourseDetail | CourseSummary

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

  // Find current section and lesson
  type AnySection = SectionSummary | SectionDetail
  type AnyLesson = LessonSummary | Lesson

  const section = (course.sections as AnySection[]).find((s) => s.id === sectionId)
  const lesson = section?.lessons.find((l) => l.id === lessonId) as AnyLesson | undefined

  if (!section || !lesson) {
    router.push(`/courses/${slug}/${courseId}`)
    return null
  }

  if (mode === 'details' && (!isAuthenticated || !isEnrolled) && !lesson.isPreview) {
    router.push(`/courses/${slug}/${courseId}`)
    return null
  }

  // Resolve video URL from lesson (support hlsVariants & original URL, nhiều dạng dữ liệu)
  const resolveVideoUrlFromLesson = (lesson: AnyLesson): string | undefined => {
    // Chỉ xử lý cho bài học video
    if (lesson.type !== 'Video') return undefined

    // Ưu tiên dùng hlsVariants nếu có
    let rawHlsVariants: string | null | undefined = null
    if ('hlsVariants' in lesson) {
      rawHlsVariants = lesson.hlsVariants
    }

    // Fallback sang videoOriginalUrl nếu có
    let originalUrl: string | undefined
    if ('videoOriginalUrl' in lesson && lesson.videoOriginalUrl) {
      originalUrl = lesson.videoOriginalUrl
    }

    const resolvedFromHls = formatHls(rawHlsVariants ?? null)

    const final = resolvedFromHls ?? originalUrl

    return final
  }

  const videoUrl = resolveVideoUrlFromLesson(lesson)

  return (
    <div className="w-full max-w-[1450px] mx-auto p-0 lg:p-6">
      {lesson.type === 'Video' && (
        <VideoLesson
          title={lesson.title}
          description={lesson.description}
          videoUrl={videoUrl}
          durationSeconds={
            'durationSeconds' in lesson ? lesson.durationSeconds : null
          }
        />
      )}
      {mode === 'details' && courseDetails && (
        <LessonInfo
          course={courseDetails}
          currentLesson={lesson as Lesson}
          slug={slug}
          courseId={courseId}
        />
      )}
    </div>
  )
}

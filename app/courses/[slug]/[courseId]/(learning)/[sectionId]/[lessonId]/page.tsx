'use client'

import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useGetCourseDetails, useGetCourseSummary } from '@/hooks/useCourse'
import type { CourseDetail, CourseSummary, Lesson, LessonDetail, Section, SectionDetail } from '@/lib/api/services/fetchCourse'
import { useAuth } from '@/hooks/useAuth'
import { useCheckEnrollment } from '@/hooks/useEnroll'
import VideoLesson from './components/VideoLesson'
import LessonInfo from './components/LessonInfo'
import { Skeleton } from '@/components/ui/skeleton'

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
        <Skeleton className="w-full aspect-video mb-8" />
        <Skeleton className="w-full h-64" />
      </div>
    )
  }

  if (isError || !course) {
    router.push('/courses')
    return null
  }

  // Find current section and lesson
  type AnySection = Section | SectionDetail
  type AnyLesson = Lesson | LessonDetail

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

    let resolvedFromHls: string | undefined

    if (rawHlsVariants) {
      try {
        // Backend có thể trả JSON string (array/object) hoặc URL thẳng
        const parsed = JSON.parse(rawHlsVariants)

        if (Array.isArray(parsed) && parsed.length > 0) {
          const first = parsed[0]
          if (typeof first === 'string') {
            resolvedFromHls = first
          } else if (first && typeof first === 'object') {
            const firstObj = first as Record<string, unknown>
            const fromObject =
              (typeof firstObj.url === 'string' && firstObj.url) ||
              (typeof firstObj.src === 'string' && firstObj.src) ||
              (typeof firstObj.playlistUrl === 'string' && firstObj.playlistUrl) ||
              (typeof firstObj.hlsUrl === 'string' && firstObj.hlsUrl) ||
              undefined
            resolvedFromHls = fromObject
          }
        } else if (parsed && typeof parsed === 'object') {
          const parsedObj = parsed as Record<string, unknown>
          const directFromObject =
            (typeof parsedObj.url === 'string' && parsedObj.url) ||
            (typeof parsedObj.src === 'string' && parsedObj.src) ||
            (typeof parsedObj.playlistUrl === 'string' && parsedObj.playlistUrl) ||
            (typeof parsedObj.hlsUrl === 'string' && parsedObj.hlsUrl) ||
            undefined

          if (directFromObject) {
            resolvedFromHls = directFromObject
          } else {
            const [firstKey] = Object.keys(parsedObj)
            const firstVal = parsedObj[firstKey]
            if (typeof firstVal === 'string') {
              resolvedFromHls = firstVal
            }
          }
        } else if (typeof parsed === 'string') {
          resolvedFromHls = parsed
        }
      } catch {
        // Không phải JSON → coi như URL trực tiếp
        resolvedFromHls = rawHlsVariants
      }
    }

    const final = resolvedFromHls ?? originalUrl

    return final
  }

  const videoUrl = resolveVideoUrlFromLesson(lesson)

  return (
    <div className="w-full max-w-[1600px] mx-auto p-0 lg:p-6">
      <VideoLesson 
        title={lesson.title}
        description={lesson.description}
        videoUrl={videoUrl}
        durationSeconds={
          'durationSeconds' in lesson ? lesson.durationSeconds : null
        }
      />
      {mode === 'details' && courseDetails && (
        <LessonInfo
          course={courseDetails}
          currentLesson={lesson as LessonDetail}
          slug={slug}
          courseId={courseId}
        />
      )}
    </div>
  )
}

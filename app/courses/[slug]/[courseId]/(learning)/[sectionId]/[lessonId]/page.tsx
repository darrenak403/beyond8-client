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

  return (
    <div className="w-full max-w-[1600px] mx-auto p-0 lg:p-6">
      <VideoLesson 
        title={lesson.title}
        description={lesson.description}
        videoUrl={
          'hlsVariants' in lesson
            ? lesson.hlsVariants || lesson.videoOriginalUrl || undefined
            : undefined
        }
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

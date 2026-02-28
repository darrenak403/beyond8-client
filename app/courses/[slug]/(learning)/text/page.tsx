'use client'

import { useParams, useSearchParams, useRouter } from 'next/navigation'
import { useGetCourseDetails, useGetCourseSummary } from '@/hooks/useCourse'
import type { CourseDetail, CourseSummary, LessonSummary, SectionSummary, SectionDetail } from '@/lib/api/services/fetchCourse'
import type { Lesson } from '@/lib/api/services/fetchLesson'
import { useAuth } from '@/hooks/useAuth'
import { useCheckEnrollment, useUpdateLearning, useGetCurriculumProgress } from '@/hooks/useEnroll'
import { useState, useMemo, useEffect } from 'react'
import TextLesson from '../../[courseId]/(learning)/[sectionId]/[lessonId]/components/TextLesson'
import LessonInfo from '../../[courseId]/(learning)/[sectionId]/[lessonId]/components/LessonInfo'
import { Skeleton } from '@/components/ui/skeleton'
import { decodeCompoundId } from '@/utils/crypto'
import { courseUrl, nextLessonUrl, asmAttemptUrl } from '@/utils/courseUrls'

export default function TextPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const slug = params?.slug as string

  const ids = decodeCompoundId(searchParams.get('id') || '')
  const courseId = ids[0] || ''
  const sectionId = ids[1] || ''
  const lessonId = ids[2] || ''

  const { isAuthenticated } = useAuth()
  const { isEnrolled, isLoading: isCheckingEnroll } = useCheckEnrollment(courseId, { enabled: !!courseId && isAuthenticated })
  const { enrollmentId: userEnrollmentId } = useCheckEnrollment(courseId, { enabled: !!courseId && isAuthenticated })
  const { curriculumProgress } = useGetCurriculumProgress(userEnrollmentId || undefined, { enabled: !!userEnrollmentId })
  const { updateLearning, isPending: isUpdatingLearning } = useUpdateLearning()

  const [hasScrolled, setHasScrolled] = useState(false)
  const [isNavigating, setIsNavigating] = useState(false)

  useEffect(() => {
    setHasScrolled(false)
    setIsNavigating(false)
  }, [lessonId])

  const shouldFetchDetails = isAuthenticated && !isCheckingEnroll && isEnrolled
  const shouldFetchSummary = !isAuthenticated || (!isCheckingEnroll && !isEnrolled)

  const { courseDetails, isLoading: isLoadingDetails, isError: isErrorDetails } = useGetCourseDetails(courseId || '', { enabled: !!courseId && shouldFetchDetails })
  const { courseSummary, isLoading: isLoadingSummary, isError: isErrorSummary } = useGetCourseSummary(courseId || '', { enabled: !!courseId && shouldFetchSummary })

  const isLessonCompleted = useMemo(() => {
    if (!curriculumProgress) return false
    for (const s of curriculumProgress.sections) {
      const l = s.lessons.find((item) => item.lessonId === lessonId)
      if (l) return l.isCompleted
    }
    return false
  }, [curriculumProgress, lessonId])

  if (!courseId || !slug || !sectionId || !lessonId) {
    router.push('/courses')
    return null
  }

  const mode = shouldFetchDetails ? 'details' : 'summary'
  const isLoading = isCheckingEnroll || (shouldFetchDetails ? isLoadingDetails : isLoadingSummary)
  const isError = shouldFetchDetails ? isErrorDetails : isErrorSummary
  const course = (shouldFetchDetails ? courseDetails : courseSummary) as CourseDetail | CourseSummary | undefined

  type AnySection = SectionSummary | SectionDetail
  type AnyLesson = LessonSummary | Lesson

  const section = (course?.sections as AnySection[])?.find((s) => s.id === sectionId)
  const lesson = section?.lessons?.find((l) => l.id === lessonId) as AnyLesson | undefined

  if (isLoading) {
    return (
      <div className="w-full max-w-[1600px] mx-auto p-0 lg:p-6">
        <Skeleton className="w-full aspect-video" />
        <Skeleton className="w-full h-64" />
      </div>
    )
  }

  if (isError || !course) { router.push('/courses'); return null }

  if (!section || !lesson) {
    router.push(courseUrl(slug, courseId))
    return null
  }

  if (mode === 'details' && (!isAuthenticated || !isEnrolled) && !lesson.isPreview) {
    router.push(courseUrl(slug, courseId))
    return null
  }

  const allLessons = (course.sections as AnySection[]).flatMap((s) => s.lessons.map((l) => ({ ...l, sectionId: s.id })))
  const currentIndex = allLessons.findIndex((l) => l.id === lessonId)
  const nextLessonItem = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null

  const isNextDisabled = !isLessonCompleted && !hasScrolled

  const handleNextLesson = async () => {
    if (isNavigating) return

    if (!isLessonCompleted && !isUpdatingLearning) {
      try {
        await updateLearning({ lessonId, data: { lastPositionSeconds: 0, markComplete: true } })
      } catch (error) { console.error('Failed to mark lesson as complete', error) }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const currentSectionAssignmentId = (section as any)?.assignmentId
    const isLastLesson = section && section.lessons[section.lessons.length - 1].id === lessonId

    if (isLastLesson && currentSectionAssignmentId) {
      router.push(asmAttemptUrl(slug, courseId, sectionId, currentSectionAssignmentId))
      return
    }

    if (nextLessonItem) {
      setIsNavigating(true)
      router.push(nextLessonUrl(slug, courseId, nextLessonItem))
    } else {
      router.push(courseUrl(slug, courseId))
    }
  }

  return (
    <div className="w-full max-w-[1550px] mx-auto p-0 lg:p-6">
      <div className="flex items-start gap-2 md:gap-4 mb-2">
        <div className="flex-1 min-w-0">
          <div className="w-full max-w-6xl mx-auto">
            <TextLesson
              key={lesson.id}
              lessonId={lesson.id}
              title={lesson.title}
              content={'textContent' in lesson ? lesson.textContent : null}
              onScrollToBottom={() => setHasScrolled(true)}
            />
          </div>
        </div>
      </div>

      <div className="mt-2 border-t border-gray-200 pt-4">
        <LessonInfo
          course={course}
          currentLesson={lesson as Lesson}
          slug={slug}
          courseId={courseId}
          onNavigate={(navSectionId, navLessonId) => {
            if ((nextLessonItem && nextLessonItem.id === navLessonId) || (!nextLessonItem && navLessonId === lessonId)) {
              handleNextLesson()
            } else {
              const targetSection = (course.sections as AnySection[]).find(s => s.id === navSectionId)
              const targetLesson = targetSection?.lessons.find(l => l.id === navLessonId)
              if (targetLesson) {
                router.push(nextLessonUrl(slug, courseId, { ...targetLesson, sectionId: navSectionId }))
              }
            }
          }}
          isNextDisabled={isNextDisabled}
          progressPercent={curriculumProgress?.progressPercent}
        />
      </div>
    </div>
  )
}

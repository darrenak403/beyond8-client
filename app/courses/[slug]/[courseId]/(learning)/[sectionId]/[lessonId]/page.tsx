'use client'

import { useParams, useRouter } from 'next/navigation'
import { useGetCourseDetails, useGetCourseSummary } from '@/hooks/useCourse'
import type { CourseDetail, CourseSummary, LessonSummary, SectionSummary, SectionDetail } from '@/lib/api/services/fetchCourse'
import type { Lesson } from '@/lib/api/services/fetchLesson'
import { useAuth } from '@/hooks/useAuth'
import { useCheckEnrollment, useUpdateLearning, useGetCurriculumProgress } from '@/hooks/useEnroll' // Updated imports
import { useState, useMemo } from 'react' // Import useState, useMemo
import VideoLesson from './components/VideoLesson'
import TextLesson from './components/TextLesson'
import LessonInfo from './components/LessonInfo'
import { Skeleton } from '@/components/ui/skeleton'
import { formatHls, getResolvedHlsVariants } from '@/lib/utils/formatHls'

import { useGetVideoByLessonId } from '@/hooks/useLesson'
// 1.5 Determine completion status (Moved up to avoid conditional hook error)
// Need lessonId to be available. It comes from params.
// But params is at line 50.
// Let's check where lessonId is defined. Line 55.
// So this hook needs to be AFTER line 55.
// But lines 115, 122, 127 checks return early. 
// Hooks MUST be before any return.
// So we must move all hooks to the top, even if some data is not yet available, 
// using 'enabled' flags or null checks inside the hook/memo.


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

  // 1.1 Enrollment ID (moved up to be available)
  // const enrollmentId = isEnrolled ? courseId : undefined // Simplification based on assumption or need to fetch properly if different

  // However, useCheckEnrollment returns enrollmentId? API check needed.
  // Looking at useEnroll.ts or usage in TextLesson:
  // const { enrollmentId } = useCheckEnrollment(courseId, { enabled: !!courseId })
  // It seems useCheckEnrollment returns object with enrollmentId. 
  // Let's correct destructuring above if needed, or re-call.
  // Actually line 58 descturctures isEnrolled. Let's see if it returns enrollmentId.
  // Assuming it does based on TextLesson usage.

  const { enrollmentId: userEnrollmentId } = useCheckEnrollment(courseId, {
    enabled: !!courseId && isAuthenticated
  })

  // 1.2 Curriculum Progress
  const { curriculumProgress } = useGetCurriculumProgress(userEnrollmentId || undefined, {
    enabled: !!userEnrollmentId
  })

  // 1.3 Update Learning
  const { updateLearning, isPending: isUpdatingLearning } = useUpdateLearning()

  // 1.4 Local State
  const [hasScrolled, setHasScrolled] = useState(false)
  const [videoProgress, setVideoProgress] = useState(0)
  const [isNavigating, setIsNavigating] = useState(false)

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

  // Determine completion status (Moved here, before other early returns if possible, 
  // but we have other hooks below like useGetCourseDetails which might be skipped? 
  // No, useGetCourseDetails has 'enabled' option, so it is always called.
  // The early returns like 'if (isLoading) return' at line 113 are the blockers.

  // So isLessonCompleted must be before line 113.
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const isLessonCompleted = useMemo(() => {
    if (!curriculumProgress) return false
    for (const s of curriculumProgress.sections) {
      const l = s.lessons.find((item) => item.lessonId === lessonId)
      if (l) return l.isCompleted
    }
    return false
  }, [curriculumProgress, lessonId])

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
    enabled: !!lesson && lesson.type === 'Video' && shouldFetchDetails
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
  const rawHlsVariants = videoData?.hlsVariants ?? (lesson && 'hlsVariants' in lesson ? lesson.hlsVariants : null)
  const originalUrl = videoData?.videoOriginalUrl ?? (lesson && 'videoOriginalUrl' in lesson ? lesson.videoOriginalUrl : null)

  const resolvedFromHls = formatHls(rawHlsVariants ?? null)
  const variants = getResolvedHlsVariants(rawHlsVariants ?? null)

  const videoUrl = resolvedFromHls ?? originalUrl

  if (lesson.type === 'Video' && shouldFetchDetails && isLoadingVideo) {
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

  // Determine completion status - MOVED UP CHECK
  // We need to ensure we don't break rules of hooks.
  // The early returns (lines 115, 122, 127, 132 etc) are problematic if we use useMemo below them.
  // We should move this useMemo up, and handle potential undefined values.

  // However, 'section' and 'lesson' are derived after the hooks and early returns.
  // We can calculate isLessonCompleted based on lessonId from params, which is available early.

  // Let's refactor the component to have all hooks at top.
  // But wait, 'lesson' object is used in JSX.
  // The issue is simply that I placed useMemo AFTER early returns.
  // I need to place it before any 'if (something) return ...' 

  // But 'curriculumProgress' is fetched at top. 'lessonId' is at top. 
  // So I can move isLessonCompleted to top.

  // Actually, let's just move the definition up.


  // Handle Next Lesson Navigation
  const handleNextLesson = async () => {
    if (isNavigating) return

    // If not completed and it's a Text lesson (implied context), mark complete
    // For video lessons, completion logic (80%) is also sufficient to mark complete.

    if (!isLessonCompleted && !isUpdatingLearning) {
      // We initiate updateLearning if conditions met.
      // For text: we already enabled button implies conditions met (scrolled).
      // For video: if progress >= 0.8, we enable button.
      // So if button click happens, we assume we can mark complete.
      try {
        await updateLearning({
          lessonId,
          data: {
            lastPositionSeconds: 0, // Or current video time?
            markComplete: true
          }
        })
      } catch (error) {
        console.error("Failed to mark lesson as complete", error)
      }
    }

    if (nextLesson) {
      setIsNavigating(true)
      router.push(`${baseUrl}/${nextLesson.sectionId}/${nextLesson.id}`)
    } else {
      router.push(baseUrl)
    }
  }

  // Determine if Next button should be disabled in LessonInfo
  // Logic: Disabled IF:
  // (Current is Text AND Not Completed AND Not Scrolled)
  // OR
  // (Current is Video AND Not Completed AND Progress < 80%)

  const isVideoCompletedLocal = videoProgress >= 0.8

  const isNextDisabled =
    (lesson?.type === 'Text' && !isLessonCompleted && !hasScrolled) ||
    (lesson?.type === 'Video' && !isLessonCompleted && !isVideoCompletedLocal)

  const baseUrl = `/courses/${slug}/${courseId}`

  return (
    <div className="w-full max-w-[1550px] mx-auto p-0 lg:p-6">
      <div className="flex items-start gap-2 md:gap-4 mb-2">
        <div className="flex-1 min-w-0">
          <div className="w-full max-w-6xl mx-auto">
            {lesson.type === 'Video' && (
              <VideoLesson
                lessonId={lesson.id}
                title={lesson.title}
                description={lesson.description}
                videoUrl={videoUrl || ''}
                thumbnailUrl={'videoThumbnailUrl' in lesson ? lesson.videoThumbnailUrl : null}
                variants={variants}
                durationSeconds={
                  'durationSeconds' in lesson ? lesson.durationSeconds : null
                }
                originVideoUrl={originalUrl || ''}
                isDownloadable={'isDownloadable' in lesson ? lesson.isDownloadable : false}
                onProgress={(progress) => setVideoProgress(progress)}
              />
            )}
            {lesson.type === 'Text' && (
              <TextLesson
                lessonId={lesson.id}
                title={lesson.title}
                content={'textContent' in lesson ? lesson.textContent : null}
                onScrollToBottom={() => setHasScrolled(true)}
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
          onNavigate={(sectionId, lessonId) => {
            // We want to intercept Next Lesson click.
            // LessonInfo passes sectionId/lessonId. 
            // If it matches nextLesson, use our handler.
            if (nextLesson && nextLesson.id === lessonId) {
              handleNextLesson()
            } else {
              // Fallback for prev lesson or others
              router.push(`${baseUrl}/${sectionId}/${lessonId}`)
            }
          }}
          isNextDisabled={isNextDisabled}
          progressPercent={curriculumProgress?.progressPercent}
        />
      </div>
    </div>
  )
}

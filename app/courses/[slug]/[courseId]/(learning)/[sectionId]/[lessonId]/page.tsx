'use client'

import { useParams, useRouter } from 'next/navigation'
import { useGetCourseDetails } from '@/hooks/useCourse'
import VideoLesson from './components/VideoLesson'
import LessonInfo from './components/LessonInfo'
import { Skeleton } from '@/components/ui/skeleton'

export default function LessonPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params?.courseId as string
  const slug = params?.slug as string
  const sectionId = params?.sectionId as string
  const lessonId = params?.lessonId as string

  // Fetch course data from API (hooks must be called before early returns)
  const {
    courseDetails,
    isLoading,
    isError,
  } = useGetCourseDetails(courseId || "")

  // Check if params exist
  if (!courseId || !slug || !sectionId || !lessonId) {
    router.push('/courses')
    return null
  }

  if (isLoading) {
    return (
      <div className="w-full max-w-[1600px] mx-auto p-0 lg:p-6">
        <Skeleton className="w-full aspect-video mb-8" />
        <Skeleton className="w-full h-64" />
      </div>
    )
  }

  if (isError || !courseDetails) {
    router.push('/courses')
    return null
  }

  // Find current section and lesson
  const section = courseDetails.sections.find(s => s.id === sectionId)
  const lesson = section?.lessons.find(l => l.id === lessonId)

  if (!section || !lesson) {
    router.push(`/courses/${slug}/${courseId}`)
    return null
  }

  return (
    <div className="w-full max-w-[1600px] mx-auto p-0 lg:p-6">
      <VideoLesson 
        title={lesson.title}
        description={lesson.description}
        videoUrl={lesson.hlsVariants || lesson.videoOriginalUrl || undefined}
        durationSeconds={lesson.durationSeconds}
      />
      <LessonInfo course={courseDetails} currentLesson={lesson} slug={slug} courseId={courseId} />
    </div>
  )
}

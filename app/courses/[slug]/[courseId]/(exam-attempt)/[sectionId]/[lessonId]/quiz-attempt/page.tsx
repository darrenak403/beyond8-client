'use client'

import { useParams, useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useGetQuizOverview, useGetMyQuizAttempts, useStartQuizAttempt, useCheckQuizInProgress } from '@/hooks/useQuiz'
import { useGetCourseDetails } from '@/hooks/useCourse'
import { useCheckEnrollment, useGetCurriculumProgress } from '@/hooks/useEnroll'
import QuizOverview from './components/QuizOverview'
import { QuizOverviewSkeleton } from './components/QuizOverviewSkeleton'
import { toast } from 'sonner'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import QuizAttemptFooter from './[quizId]/components/QuizAttemptFooter'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { LessonType } from '@/lib/api/services/fetchLesson'
import Link from 'next/link'

export default function QuizAttemptOverviewPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const quizId = searchParams.get('quizId')

  const slug = params?.slug as string
  const courseId = params?.courseId as string
  const sectionId = params?.sectionId as string
  const lessonId = params?.lessonId as string

  const { quizOverview, isLoading: isLoadingOverview } = useGetQuizOverview(quizId || '')
  const { myQuizAttempts, isLoading: isLoadingAttempts } = useGetMyQuizAttempts(quizId || '')
  const { courseDetails, isLoading: isLoadingCourse } = useGetCourseDetails(courseId || '')
  const course = courseDetails
  const { startQuizAttempt, isPending: isStarting } = useStartQuizAttempt()
  const { refetch: checkInProgress } = useCheckQuizInProgress(quizId || '')
  const [showInProgressDialog, setShowInProgressDialog] = useState(false)

  // 1. Kiểm tra enrollment để lấy enrollmentId
  const { enrollmentId: userEnrollmentId } = useCheckEnrollment(courseId, {
    enabled: !!courseId,
  })

  // 1.2 Curriculum Progress
  const { curriculumProgress } = useGetCurriculumProgress(userEnrollmentId || undefined, {
    enabled: !!userEnrollmentId
  })

  const progressPercent = curriculumProgress?.progressPercent || 0

  useEffect(() => {
    const handlePopState = () => {
      router.push(`/courses/${slug}/${courseId}`)
    }

    window.addEventListener('popstate', handlePopState)
    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [router, slug, courseId])

  useEffect(() => {
    if (!quizId) {
      toast.error('Không tìm thấy bài kiểm tra')
      router.push(`/courses/${slug}/${courseId}`)
    }
  }, [quizId, router, slug, courseId])

  const handleStartQuiz = async () => {
    if (!quizId) return

    try {
      const inProgressResult = await checkInProgress()

      if (inProgressResult.data?.hasInProgress) {
        setShowInProgressDialog(true)
        return
      }

      const result = await startQuizAttempt(quizId)
      if (result.isSuccess && result.data) {
        router.push(`/courses/${slug}/${courseId}/${sectionId}/${lessonId}/quiz-attempt/${quizId}`)
      }
    } catch (error) {
      console.error('Error starting quiz:', error)
      toast.error('Có lỗi xảy ra khi bắt đầu làm bài')
    }
  }

  const handleContinueQuiz = () => {
    if (!quizId) return
    setShowInProgressDialog(false)
    router.push(`/courses/${slug}/${courseId}/${sectionId}/${lessonId}/quiz-attempt/${quizId}`)
  }

  const handleBack = () => {
    // Check if user came from a result page
    const isFromResult = typeof document !== 'undefined' && document.referrer && document.referrer.includes('/result')

    if (isFromResult || window.history.length <= 1) {
      router.push(`/courses/${slug}/${courseId}/${sectionId}/${lessonId}`)
    } else {
      router.back()
    }
  }

  if (!quizId || isLoadingOverview || isLoadingCourse) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <QuizOverviewSkeleton />
        <Footer />
      </div>
    )
  }

  if (!quizOverview || !course) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-muted-foreground">Không tìm thấy thông tin bài kiểm tra</p>
      </div>
    )
  }



  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      {/* Back to lesson button */}
      <div className="container mx-auto py-4">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            className="rounded-2xl border-brand-magenta/20 text-brand-magenta hover:bg-brand-magenta/10 hover:text-brand-magenta"
            onClick={handleBack}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>

          {course && (() => {
            const allLessons = course.sections.flatMap(s => s.lessons.map(l => ({ ...l, sectionId: s.id })))
            const currentIndex = allLessons.findIndex(l => l.id === lessonId)
            const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null

            const currentSection = course.sections.find(s => s.id === sectionId)
            const isLastLessonOfSection = currentSection && currentSection.lessons.length > 0
              && currentSection.lessons[currentSection.lessons.length - 1].id === lessonId
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const sectionAssignmentId = (currentSection as any)?.assignmentId
            const isQuizPassed = myQuizAttempts?.attempts?.some(attempt => attempt.isPassed)

            const activeBtn = "rounded-full bg-linear-to-r from-purple-900 to-purple-700 hover:opacity-90 text-white border-none shadow-lg px-6 h-10 transition-all font-medium"
            const disabledBtn = "rounded-full bg-gray-300 text-gray-500 cursor-not-allowed border-none shadow-none px-6 h-10 font-medium"

            // Case 1: Last lesson of section AND section has assignment → Bài tập Cuối Chương
            if (isLastLessonOfSection && sectionAssignmentId) {
              if (!isQuizPassed) {
                return (
                  <Button disabled className={disabledBtn}>
                    Bài tập Cuối Chương <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                )
              }
              return (
                <Link href={`/courses/${slug}/${courseId}/${sectionId}/asm-attempt/${sectionAssignmentId}`}>
                  <Button className={activeBtn}>
                    Bài tập Cuối Chương <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              )
            }

            // Case 2: Last lesson of section, no assignment, no next lesson → Hoàn thành khóa học
            if (isLastLessonOfSection && !sectionAssignmentId && !nextLesson) {
              return (
                <Button
                  className={`rounded-full px-6 h-10 font-medium border-none ${progressPercent === 100
                    ? 'bg-green-600 hover:bg-green-700 text-white cursor-pointer'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  disabled={progressPercent !== 100}
                  onClick={() => {
                    if (progressPercent === 100) {
                      window.location.href = `/courses/${slug}/${courseId}`
                    }
                  }}
                >
                  Hoàn thành khóa học
                </Button>
              )
            }

            // Case 3: Last lesson of section, no assignment, has next lesson → Chương tiếp theo
            if (isLastLessonOfSection && !sectionAssignmentId && nextLesson) {
              const nextChapterUrl = nextLesson.type === LessonType.Quiz
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ? `/courses/${slug}/${courseId}/${nextLesson.sectionId}/${nextLesson.id}/quiz-attempt?quizId=${(nextLesson as any).quizId}`
                : `/courses/${slug}/${courseId}/${nextLesson.sectionId}/${nextLesson.id}`

              if (!isQuizPassed) {
                return (
                  <Button disabled className={disabledBtn}>
                    Chương tiếp theo <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                )
              }
              return (
                <Link href={nextChapterUrl}>
                  <Button className={activeBtn}>
                    Chương tiếp theo <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              )
            }

            // Case 4: Not last lesson of section, no next lesson (shouldn't happen but guard)
            if (!nextLesson) {
              return (
                <Button
                  className={`rounded-full px-6 h-10 font-medium border-none ${progressPercent === 100
                    ? 'bg-green-600 hover:bg-green-700 text-white cursor-pointer'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  disabled={progressPercent !== 100}
                  onClick={() => {
                    if (progressPercent === 100) {
                      window.location.href = `/courses/${slug}/${courseId}`
                    }
                  }}
                >
                  Hoàn thành khóa học
                </Button>
              )
            }

            // Case 5: Next lesson in same section
            const buttonText = nextLesson.type === LessonType.Quiz ? "Bài kiểm tra" : "Bài tiếp theo"
            const targetUrl = nextLesson.type === LessonType.Quiz
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              ? `/courses/${slug}/${courseId}/${nextLesson.sectionId}/${nextLesson.id}/quiz-attempt?quizId=${(nextLesson as any).quizId}`
              : `/courses/${slug}/${courseId}/${nextLesson.sectionId}/${nextLesson.id}`

            if (!isQuizPassed) {
              return (
                <Button disabled className={disabledBtn}>
                  {buttonText} <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              )
            }
            return (
              <Link href={targetUrl}>
                <Button className={activeBtn}>
                  {buttonText} <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            )
          })()}
        </div>
      </div>

      <div className="flex-1 flex relative">
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto relative z-10">
          <QuizOverview
            quizOverview={quizOverview}
            myQuizAttempts={myQuizAttempts}
            isLoadingAttempts={isLoadingAttempts}
            onStartQuiz={handleStartQuiz}
            isStarting={isStarting}
            quizId={quizId}
          />
        </div>
      </div>

      <QuizAttemptFooter />

      {/* In-Progress Quiz Dialog */}
      <AlertDialog open={showInProgressDialog} onOpenChange={setShowInProgressDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bài kiểm tra đang làm dở</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có một bài kiểm tra đang làm dở. Bạn có muốn tiếp tục làm bài kiểm tra này không?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-2xl cursor-pointer hover:bg-gray-100 hover:text-black">
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleContinueQuiz}
              className="bg-brand-magenta hover:bg-brand-magenta/90 rounded-2xl"
            >
              Tiếp tục làm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

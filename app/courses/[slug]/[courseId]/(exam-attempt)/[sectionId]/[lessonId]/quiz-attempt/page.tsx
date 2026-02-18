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
            // Find next lesson logic
            const allLessons = course.sections.flatMap(s => s.lessons.map(l => ({ ...l, sectionId: s.id })))
            const currentIndex = allLessons.findIndex(l => l.id === lessonId)
            const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null

            // Find current section
            const currentSection = course.sections.find(s => s.id === sectionId)

            // Check if current lesson is the last lesson of the current section
            const isLastLessonOfSection = currentSection && currentSection.lessons.length > 0 && currentSection.lessons[currentSection.lessons.length - 1].id === lessonId
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const sectionAssignmentId = (currentSection as any)?.assignmentId

            if (isLastLessonOfSection && sectionAssignmentId) {
              return (
                <Link href={`/courses/${slug}/${courseId}/${sectionId}/asm-attempt/${sectionAssignmentId}`}>
                  <Button className="rounded-full bg-linear-to-r from-purple-900 to-purple-700 hover:opacity-90 text-white border-none shadow-lg px-6 h-10 transition-all font-medium">
                    Bài tập Cuối Chương <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              )
            }

            if (!nextLesson) {
              return (
                <Button
                  className={`rounded-full px-6 h-10 font-medium border-none ${(progressPercent === 100)
                    ? 'bg-green-600 hover:bg-green-700 text-white cursor-pointer'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  disabled={progressPercent !== 100}
                  onClick={() => {
                    if (progressPercent === 100) {
                      // Navigate to course home
                      window.location.href = `/courses/${slug}/${courseId}`
                    }
                  }}
                >
                  Hoàn thành khóa học
                </Button>
              )
            }

            const getNextButtonText = () => {
              // const section = course.sections.find(s => s.id === nextLesson.sectionId)
              if (nextLesson.type === LessonType.Quiz) {
                return "Bài kiểm tra"
              }
              // Previous logic for assignment check is now handled above for the *current* section.
              // We keep this just in case nextLesson points to an assignment in a weird way, but unlikely if structures are standard.
              // Actually, LessonInfo logic had this:
              /*
              if (section) {
                const lastLesson = section.lessons[section.lessons.length - 1]
                if (lastLesson.id === nextLesson.id) {
                   return "Bài tập Cuối Chương"
                }
              }
              */
              // But here nextLesson is strictly from the lessons array.
              return "Bài tiếp theo"
            }

            const getNextLessonUrl = () => {
              // const section = course.sections.find(s => s.id === nextLesson.sectionId)
              if (nextLesson.type === LessonType.Quiz) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const quizId = (nextLesson as any).quizId
                return `/courses/${slug}/${courseId}/${nextLesson.sectionId}/${nextLesson.id}/quiz-attempt?quizId=${quizId}`
              }
              /*
              if (section) {
                 const lastLesson = section.lessons[section.lessons.length - 1]
                 if (lastLesson.id === nextLesson.id) {
                   const assignmentId = (section as any).assignmentId
                   if (assignmentId) {
                     return `/courses/${slug}/${courseId}/${nextLesson.sectionId}/asm-attempt/${assignmentId}`
                   }
                 }
              }
              */
              return `/courses/${slug}/${courseId}/${nextLesson.sectionId}/${nextLesson.id}`
            }

            const buttonText = getNextButtonText()
            const targetUrl = getNextLessonUrl()

            return (
              <Link href={targetUrl}>
                <Button className="rounded-full bg-linear-to-r from-purple-900 to-purple-700 hover:opacity-90 text-white border-none shadow-lg px-6 h-10 transition-all font-medium">
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

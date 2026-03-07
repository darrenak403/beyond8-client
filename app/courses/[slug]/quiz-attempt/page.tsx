'use client'

import { useParams, useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useGetQuizOverview, useGetMyQuizAttempts, useStartQuizAttempt, useCheckQuizInProgress } from '@/hooks/useQuiz'
import { useGetCourseDetails } from '@/hooks/useCourse'
import { useCheckEnrollment, useGetCurriculumProgress } from '@/hooks/useEnroll'
import QuizOverview from '../[courseId]/(exam-attempt)/[sectionId]/[lessonId]/quiz-attempt/components/QuizOverview'
import { QuizOverviewSkeleton } from '../[courseId]/(exam-attempt)/[sectionId]/[lessonId]/quiz-attempt/components/QuizOverviewSkeleton'
import { toast } from 'sonner'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import QuizAttemptFooter from '../[courseId]/(exam-attempt)/[sectionId]/[lessonId]/quiz-attempt/[quizId]/components/QuizAttemptFooter'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { LessonType } from '@/lib/api/services/fetchLesson'
import Link from 'next/link'
import { decodeCompoundId } from '@/utils/crypto'
import { courseUrl, quizTakeUrl, quizOverviewUrl, asmAttemptUrl, nextLessonUrl } from '@/utils/courseUrls'

export default function QuizAttemptOverviewPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const slug = params?.slug as string

  // id = enc(courseId|sectionId|lessonId|quizId)
  const ids = decodeCompoundId(searchParams.get('id') || '')
  const courseId = ids[0] || ''
  const sectionId = ids[1] || ''
  const lessonId = ids[2] || ''
  const quizId = ids[3] || ''

  const { quizOverview, isLoading: isLoadingOverview } = useGetQuizOverview(quizId || '')
  const { myQuizAttempts, isLoading: isLoadingAttempts } = useGetMyQuizAttempts(quizId || '')
  const { courseDetails, isLoading: isLoadingCourse } = useGetCourseDetails(courseId || '')
  const course = courseDetails
  const { startQuizAttempt, isPending: isStarting } = useStartQuizAttempt()
  const { refetch: checkInProgress } = useCheckQuizInProgress(quizId || '')
  const [showInProgressDialog, setShowInProgressDialog] = useState(false)

  const { enrollmentId: userEnrollmentId } = useCheckEnrollment(courseId, { enabled: !!courseId })
  const { curriculumProgress } = useGetCurriculumProgress(userEnrollmentId || undefined, { enabled: !!userEnrollmentId })
  const progressPercent = curriculumProgress?.progressPercent || 0

  useEffect(() => {
    const handlePopState = () => { router.push(courseUrl(slug, courseId)) }
    window.addEventListener('popstate', handlePopState)
    return () => { window.removeEventListener('popstate', handlePopState) }
  }, [router, slug, courseId])

  useEffect(() => {
    if (!quizId) {
      toast.error('Đối tượng không tìm thấy bài kiểm tra')
      router.push(courseUrl(slug, courseId))
    }
  }, [quizId, router, slug, courseId])

  const handleStartQuiz = async () => {
    if (!quizId) return
    try {
      const inProgressResult = await checkInProgress()
      if (inProgressResult.data?.hasInProgress) { setShowInProgressDialog(true); return }
      const result = await startQuizAttempt(quizId)
      if (result.isSuccess && result.data) {
        router.push(quizTakeUrl(slug, courseId, sectionId, lessonId, quizId))
      }
    } catch (error) {
      console.error('Error starting quiz:', error)
      toast.error('Có lỗi xảy ra khi bắt đầu làm bài')
    }
  }

  const handleContinueQuiz = () => {
    if (!quizId) return
    setShowInProgressDialog(false)
    router.push(quizTakeUrl(slug, courseId, sectionId, lessonId, quizId))
  }

  const handleBack = () => {
    const isFromResult = typeof document !== 'undefined' && document.referrer && document.referrer.includes('/result')
    if (isFromResult || window.history.length <= 1) {
      router.push(courseUrl(slug, courseId))
    } else {
      router.back()
    }
  }

  if (!quizId || isLoadingOverview || isLoadingCourse) {
    return (<div className="min-h-screen flex flex-col"><Header /><QuizOverviewSkeleton /><Footer /></div>)
  }
  if (!quizOverview || !course) {
    return (<div className="min-h-screen bg-white flex items-center justify-center"><p className="text-muted-foreground">Không tìm thấy thông tin bài kiểm tra</p></div>)
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <div className="container mx-auto py-4">
        <div className="flex items-center justify-between">
          <Button variant="outline" className="rounded-2xl border-brand-magenta/20 text-brand-magenta hover:bg-brand-magenta/10 hover:text-brand-magenta" onClick={handleBack}>
            <ChevronLeft className="w-4 h-4 mr-2" /> Quay lại
          </Button>

          {course && (() => {
            const allLessons = course.sections.flatMap(s => s.lessons.map(l => ({ ...l, sectionId: s.id })))
            const currentIndex = allLessons.findIndex(l => l.id === lessonId)
            const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null

            const currentSection = course.sections.find(s => s.id === sectionId)
            const isLastLessonOfSection = currentSection && currentSection.lessons.length > 0 && currentSection.lessons[currentSection.lessons.length - 1].id === lessonId
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const sectionAssignmentId = (currentSection as any)?.assignmentId
            const isQuizPassed = myQuizAttempts?.attempts?.some(attempt => attempt.isPassed)

            const activeBtn = "rounded-full bg-linear-to-r from-purple-900 to-purple-700 hover:opacity-90 text-white border-none shadow-lg px-6 h-10 transition-all font-medium"
            const disabledBtn = "rounded-full bg-gray-300 text-gray-500 cursor-not-allowed border-none shadow-none px-6 h-10 font-medium"

            if (isLastLessonOfSection && sectionAssignmentId) {
              if (!isQuizPassed) return <Button disabled className={disabledBtn}>Bài tập Cuối Chương <ChevronRight className="w-4 h-4 ml-1" /></Button>
              return <Link href={asmAttemptUrl(slug, courseId, sectionId, sectionAssignmentId)}><Button className={activeBtn}>Bài tập Cuối Chương <ChevronRight className="w-4 h-4 ml-1" /></Button></Link>
            }

            if (isLastLessonOfSection && !sectionAssignmentId && !nextLesson) {
              return (
                <Button className={`rounded-full px-6 h-10 font-medium border-none ${progressPercent === 100 ? 'bg-green-600 hover:bg-green-700 text-white cursor-pointer' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                  disabled={progressPercent !== 100} onClick={() => { if (progressPercent === 100) window.location.href = courseUrl(slug, courseId) }}>
                  Hoàn thành khóa học
                </Button>
              )
            }

            if (isLastLessonOfSection && !sectionAssignmentId && nextLesson) {
              const nextChapterUrl = nextLessonUrl(slug, courseId, nextLesson)
              if (!isQuizPassed) return <Button disabled className={disabledBtn}>Chương tiếp theo <ChevronRight className="w-4 h-4 ml-1" /></Button>
              return <Link href={nextChapterUrl}><Button className={activeBtn}>Chương tiếp theo <ChevronRight className="w-4 h-4 ml-1" /></Button></Link>
            }

            if (!nextLesson) {
              return (
                <Button className={`rounded-full px-6 h-10 font-medium border-none ${progressPercent === 100 ? 'bg-green-600 hover:bg-green-700 text-white cursor-pointer' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                  disabled={progressPercent !== 100} onClick={() => { if (progressPercent === 100) window.location.href = courseUrl(slug, courseId) }}>
                  Hoàn thành khóa học
                </Button>
              )
            }

            const buttonText = nextLesson.type === LessonType.Quiz ? "Bài kiểm tra" : "Bài tiếp theo"
            const targetUrl = nextLessonUrl(slug, courseId, nextLesson)
            if (!isQuizPassed) return <Button disabled className={disabledBtn}>{buttonText} <ChevronRight className="w-4 h-4 ml-1" /></Button>
            return <Link href={targetUrl}><Button className={activeBtn}>{buttonText} <ChevronRight className="w-4 h-4 ml-1" /></Button></Link>
          })()}
        </div>
      </div>

      <div className="flex-1 flex relative">
        <div className="flex-1 overflow-y-auto relative z-10">
          <QuizOverview quizOverview={quizOverview} myQuizAttempts={myQuizAttempts} isLoadingAttempts={isLoadingAttempts} onStartQuiz={handleStartQuiz} isStarting={isStarting} quizId={quizId} courseId={courseId} sectionId={sectionId} lessonId={lessonId} />
        </div>
      </div>

      <QuizAttemptFooter />

      <AlertDialog open={showInProgressDialog} onOpenChange={setShowInProgressDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bài kiểm tra đang làm dở</AlertDialogTitle>
            <AlertDialogDescription>Bạn có một bài kiểm tra đang làm dở. Bạn có muốn tiếp tục làm bài kiểm tra này không?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-2xl cursor-pointer hover:bg-gray-100 hover:text-black">Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleContinueQuiz} className="bg-brand-magenta hover:bg-brand-magenta/90 rounded-2xl">Tiếp tục làm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

'use client'

import { useParams, useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useGetQuizOverview, useGetMyQuizAttempts, useStartQuizAttempt, useCheckQuizInProgress } from '@/hooks/useQuiz'
import { useGetCourseDetails } from '@/hooks/useCourse'
import QuizOverview from './components/QuizOverview'
import { QuizOverviewSkeleton } from './components/QuizOverviewSkeleton'
import { toast } from 'sonner'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import QuizAttemptFooter from './[quizId]/components/QuizAttemptFooter'

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

  useEffect(() => {
    if (!quizId) {
      toast.error('Không tìm thấy bài kiểm tra')
      router.back()
    }
  }, [quizId, router])

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
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-white flex items-center justify-center">
        <p className="text-muted-foreground">Không tìm thấy thông tin bài kiểm tra</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      
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

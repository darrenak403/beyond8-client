'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { useGetCurrentQuizAttempt, useSubmitQuizAttempt, useFlagQuizQuestion, useAutoSaveQuizAttempt } from '@/hooks/useQuiz'
import QuizAttemptSidebar from './components/QuizAttemptSidebar'
import QuestionCard from './components/QuestionCard'
import QuizAttemptHeader from './components/QuizAttemptHeader'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'

export default function QuizAttemptPage() {
  const params = useParams()
  const router = useRouter()
  const quizId = params?.quizId as string

  const { currentQuizAttempt, isLoading } = useGetCurrentQuizAttempt(quizId)
  const { submitQuizAttempt, isPending: isSubmitting } = useSubmitQuizAttempt()
  const { flagQuizQuestion } = useFlagQuizQuestion()
  const { autoSaveQuizAttempt } = useAutoSaveQuizAttempt()

  const [answers, setAnswers] = useState<Record<string, string[]>>(() => 
    currentQuizAttempt?.savedAnswers || {}
  )
  const [flaggedQuestions, setFlaggedQuestions] = useState<string[]>(() =>
    currentQuizAttempt?.flaggedQuestions || []
  )
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [timeSpentSeconds, setTimeSpentSeconds] = useState(() => 
    currentQuizAttempt?.timeSpentSeconds || 0
  )
  const [showSubmitDialog, setShowSubmitDialog] = useState(false)
  const questionRefs = useRef<(HTMLDivElement | null)[]>([])
  const scrollContainerRef = useRef<HTMLDivElement | null>(null)
  const isScrollingRef = useRef(false)
  const currentQuestionIndexRef = useRef<number>(0)
  
  // Store the base time spent from server and when we last synced with server
  const baseTimeSpentRef = useRef<number>(currentQuizAttempt?.timeSpentSeconds || 0)
  const lastSyncTimeRef = useRef<number>(Date.now())

  useEffect(() => {
    if (currentQuizAttempt?.savedAnswers) {
      setAnswers(currentQuizAttempt.savedAnswers)
    }
    if (currentQuizAttempt?.flaggedQuestions) {
      setFlaggedQuestions(currentQuizAttempt.flaggedQuestions)
    }
    if (currentQuizAttempt?.timeSpentSeconds !== undefined) {
      // When we get new data from server, update base time and sync time
      baseTimeSpentRef.current = currentQuizAttempt.timeSpentSeconds
      lastSyncTimeRef.current = Date.now()
      setTimeSpentSeconds(currentQuizAttempt.timeSpentSeconds)
    }
    if (currentQuizAttempt?.questions) {
      questionRefs.current = new Array(currentQuizAttempt.questions.length).fill(null)
      currentQuestionIndexRef.current = 0
      setCurrentQuestionIndex(0)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuizAttempt?.attemptId])

  useEffect(() => {
    if (!currentQuizAttempt || currentQuizAttempt.timeSpentSeconds === undefined) return

    const interval = setInterval(() => {
      // Calculate elapsed time since last sync with server data
      const elapsedSinceSync = Math.floor((Date.now() - lastSyncTimeRef.current) / 1000)
      // Total time spent = base time from server + elapsed time since sync
      setTimeSpentSeconds(baseTimeSpentRef.current + elapsedSinceSync)
    }, 1000)

    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuizAttempt?.attemptId, currentQuizAttempt?.timeSpentSeconds])

  useEffect(() => {
    if (!currentQuizAttempt || !currentQuizAttempt.attemptId) return

    const autoSaveInterval = setInterval(async () => {
      try {
        const currentTimeSpent = baseTimeSpentRef.current + Math.floor((Date.now() - lastSyncTimeRef.current) / 1000)
        await autoSaveQuizAttempt({
          attemptId: currentQuizAttempt.attemptId,
          body: {
            answers,
            timeSpentSeconds: currentTimeSpent,
            flaggedQuestions,
          },
        })
        // After successful save, update refs to reflect the saved state
        baseTimeSpentRef.current = currentTimeSpent
        lastSyncTimeRef.current = Date.now()
      } catch (error) {
        console.error('Auto-save failed:', error)
      }
    }, 300000)

    return () => clearInterval(autoSaveInterval)
  }, [currentQuizAttempt, answers, flaggedQuestions, autoSaveQuizAttempt])

  useEffect(() => {
    if (!currentQuizAttempt || questionRefs.current.length === 0 || !scrollContainerRef.current) return

    const observerOptions = {
      root: scrollContainerRef.current,
      rootMargin: '-120px 0px -10% 0px',
      threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
    }

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      if (isScrollingRef.current) return 

      const intersectingQuestions: Array<{ index: number; topDistance: number; intersectionRatio: number; visibleTop: number }> = []

      for (const entry of entries) {
        if (entry.isIntersecting && scrollContainerRef.current && entry.target instanceof HTMLElement) {
          const rect = entry.boundingClientRect
          const containerRect = scrollContainerRef.current.getBoundingClientRect()
          const topDistance = rect.top - containerRect.top
          const index = parseInt(entry.target.getAttribute('data-question-index') || '0')
          
          const visibleTop = Math.max(0, containerRect.top + 120 - rect.top)
          const visibleBottom = Math.min(rect.height, containerRect.bottom - rect.top)
          const visibleInUpperPortion = Math.max(0, Math.min(visibleTop, visibleBottom))
          
          intersectingQuestions.push({
            index,
            topDistance,
            intersectionRatio: entry.intersectionRatio,
            visibleTop: visibleInUpperPortion
          })
        }
      }

      if (intersectingQuestions.length > 0) {
        intersectingQuestions.sort((a, b) => {
          if (Math.abs(b.visibleTop - a.visibleTop) > 50) {
            return b.visibleTop - a.visibleTop
          }
          if (Math.abs(b.intersectionRatio - a.intersectionRatio) > 0.1) {
            return b.intersectionRatio - a.intersectionRatio
          }
          return a.topDistance - b.topDistance
        })
        
        const selectedIndex = intersectingQuestions[0].index
        if (selectedIndex !== currentQuestionIndexRef.current) {
          currentQuestionIndexRef.current = selectedIndex
          setCurrentQuestionIndex(selectedIndex)
        }
      }
    }

    const observer = new IntersectionObserver(observerCallback, observerOptions)

    questionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    let scrollTimeout: NodeJS.Timeout | null = null
    const handleScroll = () => {
      if (isScrollingRef.current || !scrollContainerRef.current) return

      if (scrollTimeout) return
      
      scrollTimeout = setTimeout(() => {
        scrollTimeout = null
        
        const visibleQuestions: Array<{ index: number; topDistance: number; visibility: number; visibleTop: number }> = []

        questionRefs.current.forEach((ref, index) => {
          if (ref && scrollContainerRef.current) {
            const rect = ref.getBoundingClientRect()
            const containerRect = scrollContainerRef.current.getBoundingClientRect()
            const topDistance = rect.top - containerRect.top
            
            const isVisible = rect.top < containerRect.bottom && rect.bottom > containerRect.top
            if (isVisible) {
              const visibleHeight = Math.min(rect.bottom, containerRect.bottom) - Math.max(rect.top, containerRect.top)
              const visibility = visibleHeight / rect.height
              
              // Calculate how much is visible in the upper portion (first 400px from top)
              const upperViewportTop = containerRect.top + 120
              const upperViewportBottom = containerRect.top + 400
              const visibleTop = Math.max(0, Math.min(rect.bottom, upperViewportBottom) - Math.max(rect.top, upperViewportTop))
              
              visibleQuestions.push({
                index,
                topDistance,
                visibility,
                visibleTop
              })
            }
          }
        })

        if (visibleQuestions.length > 0) {
          // Sort by: 1) visibility in upper portion, 2) overall visibility, 3) top distance
          visibleQuestions.sort((a, b) => {
            // Prefer questions with more visible content in upper portion
            if (Math.abs(b.visibleTop - a.visibleTop) > 50) {
              return b.visibleTop - a.visibleTop
            }
            // Then by overall visibility
            if (Math.abs(b.visibility - a.visibility) > 0.2) {
              return b.visibility - a.visibility
            }
            // Finally by top distance
            return a.topDistance - b.topDistance
          })
          
          const closestIndex = visibleQuestions[0].index
          
          // Special handling for last question when near bottom
          if (scrollContainerRef.current) {
            const container = scrollContainerRef.current
            const isAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100
            if (isAtBottom && questionRefs.current.length > 0) {
              const lastIndex = questionRefs.current.length - 1
              const lastQuestion = visibleQuestions.find(q => q.index === lastIndex)
              if (lastQuestion && lastQuestion.visibleTop > 0) {
                // If last question is visible, prioritize it when at bottom
                const lastVisibleTop = lastQuestion.visibleTop
                const currentVisibleTop = visibleQuestions[0].visibleTop
                if (lastVisibleTop >= currentVisibleTop * 0.7) {
                  // If last question has at least 70% of the visibility of current best, select it
                  if (closestIndex !== lastIndex) {
                    currentQuestionIndexRef.current = lastIndex
                    setCurrentQuestionIndex(lastIndex)
                    return
                  }
                }
              }
            }
          }
          
          if (closestIndex !== currentQuestionIndexRef.current) {
            currentQuestionIndexRef.current = closestIndex
            setCurrentQuestionIndex(closestIndex)
          }
        }
      }, 100) 
    }

    const scrollContainer = scrollContainerRef.current
    scrollContainer?.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      observer.disconnect()
      scrollContainer?.removeEventListener('scroll', handleScroll)
      if (scrollTimeout) clearTimeout(scrollTimeout)
    }
  }, [currentQuizAttempt])

  const handleQuestionSelect = (index: number) => {
    const questionRef = questionRefs.current[index]
    if (questionRef) {
      isScrollingRef.current = true
      currentQuestionIndexRef.current = index
      questionRef.scrollIntoView({ behavior: 'smooth', block: 'center' })
      setCurrentQuestionIndex(index)
      
      setTimeout(() => {
        isScrollingRef.current = false
      }, 1000)
    }
  }

  const handleAnswerChange = (questionId: string, selectedOptions: string[]) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: selectedOptions,
    }))
  }

  const handleFlagQuestion = async (questionId: string, isFlagged: boolean) => {
    if (!currentQuizAttempt?.attemptId) return

    try {
      const result = await flagQuizQuestion({
        attemptId: currentQuizAttempt.attemptId,
        body: { questionId, isFlagged },
      })

      if (result.isSuccess && result.data) {
        setFlaggedQuestions(result.data)
      }
    } catch (error) {
      console.error('Error flagging question:', error)
      toast.error('Không thể đánh dấu câu hỏi')
    }
  }

  const handleSubmitQuiz = async () => {
    if (!currentQuizAttempt?.attemptId) return

    try {
      const result = await submitQuizAttempt({
        attemptId: currentQuizAttempt.attemptId,
        body: {
          answers,
          timeSpentSeconds,
        },
      })

      if (result.isSuccess) {
        toast.success('Nộp bài thành công!')
        // Navigate back to overview
        const slug = params?.slug as string
        const courseId = params?.courseId as string
        const sectionId = params?.sectionId as string
        const lessonId = params?.lessonId as string
        router.push(`/courses/${slug}/${courseId}/${sectionId}/${lessonId}/quiz-attempt?quizId=${quizId}`)
      }
    } catch (error) {
      console.error('Error submitting quiz:', error)
      toast.error('Không thể nộp bài')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-purple" />
      </div>
    )
  }

  if (!currentQuizAttempt) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Không tìm thấy bài kiểm tra</p>
      </div>
    )
  }

  const answeredCount = Object.keys(answers).filter(
    qId => answers[qId] && answers[qId].length > 0
  ).length

  const timeRemaining = currentQuizAttempt.timeLimitMinutes 
    ? Math.max(0, (currentQuizAttempt.timeLimitMinutes * 60) - timeSpentSeconds)
    : null

  const handleExit = () => {
    const slug = params?.slug as string
    const courseId = params?.courseId as string
    const sectionId = params?.sectionId as string
    const lessonId = params?.lessonId as string
    router.push(`/courses/${slug}/${courseId}/${sectionId}/${lessonId}/quiz-attempt?quizId=${quizId}`)
  }

  return (
    <div className="h-screen bg-white flex flex-col relative overflow-hidden">
      
      {/* Header */}
      <QuizAttemptHeader 
        quizTitle={currentQuizAttempt.quizTitle}
        timeRemaining={timeRemaining}
        onExit={handleExit}
      />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden relative z-10 h-full">
        {/* Quiz Attempt Sidebar */}
        <QuizAttemptSidebar
          quizTitle={currentQuizAttempt.quizTitle}
          timeSpentSeconds={timeSpentSeconds}
          timeLimitMinutes={currentQuizAttempt.timeLimitMinutes}
          questions={currentQuizAttempt.questions}
          answers={answers}
          flaggedQuestions={flaggedQuestions}
          currentQuestionIndex={currentQuestionIndex}
          onQuestionSelect={handleQuestionSelect}
          onSubmitQuiz={() => setShowSubmitDialog(true)}
          isSubmitting={isSubmitting}
          answeredCount={answeredCount}
          totalQuestions={currentQuizAttempt.totalQuestions}
        />

        {/* Question Content */}
        <div ref={scrollContainerRef} className="flex flex-col w-full overflow-y-auto h-full">
          <div className="px-14 py-6 mb-20 w-full">
            {/* All Questions */}
            <div className="space-y-8">
              {currentQuizAttempt.questions.map((question, index) => (
                <div
                  key={question.questionId}
                  ref={(el) => {
                    questionRefs.current[index] = el
                  }}
                  data-question-index={index}
                  className="scroll-mt-20"
                >
                  <QuestionCard
                    question={question}
                    currentIndex={index}
                    totalQuestions={currentQuizAttempt.totalQuestions}
                    selectedAnswers={answers[question.questionId] || []}
                    isFlagged={flaggedQuestions.includes(question.questionId)}
                    onAnswerChange={(selectedOptions: string[]) => 
                      handleAnswerChange(question.questionId, selectedOptions)
                    }
                    onFlagChange={(isFlagged: boolean) => 
                      handleFlagQuestion(question.questionId, isFlagged)
                    }
                    onPrevious={() => {}}
                    onNext={() => {}}
                    canGoPrevious={false}
                    canGoNext={false}
                    hideNavigation={true}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      {/* <QuizAttemptFooter /> */}

      {/* Submit Confirmation Dialog */}
      <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận nộp bài</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn nộp bài không? Sau khi nộp bài, bạn sẽ không thể chỉnh sửa câu trả lời nữa.
              <br />
              <br />
              Đã trả lời: {answeredCount}/{currentQuizAttempt.totalQuestions} câu hỏi
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSubmitQuiz}
              disabled={isSubmitting}
              className="bg-brand-magenta hover:bg-brand-magenta/80"
            >
              {isSubmitting ? 'Đang nộp...' : 'Nộp bài'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

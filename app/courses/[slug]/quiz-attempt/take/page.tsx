'use client'

import { useParams, useSearchParams, useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { useGetCurrentQuizAttempt, useSubmitQuizAttempt, useFlagQuizQuestion, useAutoSaveQuizAttempt } from '@/hooks/useQuiz'
import QuizAttemptSidebar from '../../[courseId]/(exam-attempt)/[sectionId]/[lessonId]/quiz-attempt/[quizId]/components/QuizAttemptSidebar'
import QuestionCard from '../../[courseId]/(exam-attempt)/[sectionId]/[lessonId]/quiz-attempt/[quizId]/components/QuestionCard'
import QuizAttemptHeader from '../../[courseId]/(exam-attempt)/[sectionId]/[lessonId]/quiz-attempt/[quizId]/components/QuizAttemptHeader'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { decodeCompoundId } from '@/utils/crypto'
import { quizOverviewUrl } from '@/utils/courseUrls'

export default function QuizTakePage() {
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

  const { currentQuizAttempt, isLoading } = useGetCurrentQuizAttempt(quizId)
  const { submitQuizAttempt, isPending: isSubmitting } = useSubmitQuizAttempt()
  const { flagQuizQuestion } = useFlagQuizQuestion()
  const { autoSaveQuizAttempt } = useAutoSaveQuizAttempt()

  const [answers, setAnswers] = useState<Record<string, string[]>>(() => currentQuizAttempt?.savedAnswers || {})
  const [flaggedQuestions, setFlaggedQuestions] = useState<string[]>(() => currentQuizAttempt?.flaggedQuestions || [])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [timeSpentSeconds, setTimeSpentSeconds] = useState(() => currentQuizAttempt?.timeSpentSeconds || 0)
  const [showSubmitDialog, setShowSubmitDialog] = useState(false)
  const questionRefs = useRef<(HTMLDivElement | null)[]>([])
  const scrollContainerRef = useRef<HTMLDivElement | null>(null)
  const isScrollingRef = useRef(false)
  const currentQuestionIndexRef = useRef<number>(0)
  const baseTimeSpentRef = useRef<number>(currentQuizAttempt?.timeSpentSeconds || 0)
  const lastSyncTimeRef = useRef<number>(Date.now())

  useEffect(() => {
    if (currentQuizAttempt?.savedAnswers) setAnswers(currentQuizAttempt.savedAnswers)
    if (currentQuizAttempt?.flaggedQuestions) setFlaggedQuestions(currentQuizAttempt.flaggedQuestions)
    if (currentQuizAttempt?.timeSpentSeconds !== undefined) {
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
      const elapsedSinceSync = Math.floor((Date.now() - lastSyncTimeRef.current) / 1000)
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
          body: { answers, timeSpentSeconds: currentTimeSpent, flaggedQuestions },
        })
        baseTimeSpentRef.current = currentTimeSpent
        lastSyncTimeRef.current = Date.now()
      } catch (error) { console.error('Auto-save failed:', error) }
    }, 300000)
    return () => clearInterval(autoSaveInterval)
  }, [currentQuizAttempt, answers, flaggedQuestions, autoSaveQuizAttempt])

  // Scroll tracking for question index
  useEffect(() => {
    if (!currentQuizAttempt || questionRefs.current.length === 0 || !scrollContainerRef.current) return
    const observerOptions = { root: scrollContainerRef.current, rootMargin: '-120px 0px -10% 0px', threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1] }
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      if (isScrollingRef.current) return
      const intersecting: Array<{ index: number; topDistance: number; ratio: number; visibleTop: number }> = []
      for (const entry of entries) {
        if (entry.isIntersecting && scrollContainerRef.current && entry.target instanceof HTMLElement) {
          const rect = entry.boundingClientRect
          const cRect = scrollContainerRef.current.getBoundingClientRect()
          const idx = parseInt(entry.target.getAttribute('data-question-index') || '0')
          const vTop = Math.max(0, cRect.top + 120 - rect.top)
          const vBottom = Math.min(rect.height, cRect.bottom - rect.top)
          intersecting.push({ index: idx, topDistance: rect.top - cRect.top, ratio: entry.intersectionRatio, visibleTop: Math.max(0, Math.min(vTop, vBottom)) })
        }
      }
      if (intersecting.length > 0) {
        intersecting.sort((a, b) => Math.abs(b.visibleTop - a.visibleTop) > 50 ? b.visibleTop - a.visibleTop : Math.abs(b.ratio - a.ratio) > 0.1 ? b.ratio - a.ratio : a.topDistance - b.topDistance)
        const sel = intersecting[0].index
        if (sel !== currentQuestionIndexRef.current) { currentQuestionIndexRef.current = sel; setCurrentQuestionIndex(sel) }
      }
    }
    const observer = new IntersectionObserver(observerCallback, observerOptions)
    questionRefs.current.forEach(ref => { if (ref) observer.observe(ref) })
    const scrollContainer = scrollContainerRef.current
    return () => { observer.disconnect(); scrollContainer?.removeEventListener('scroll', () => {}) }
  }, [currentQuizAttempt])

  const handleQuestionSelect = (index: number) => {
    const ref = questionRefs.current[index]
    if (ref) { isScrollingRef.current = true; currentQuestionIndexRef.current = index; ref.scrollIntoView({ behavior: 'smooth', block: 'center' }); setCurrentQuestionIndex(index); setTimeout(() => { isScrollingRef.current = false }, 1000) }
  }

  const handleAnswerChange = (questionId: string, selectedOptions: string[]) => setAnswers(prev => ({ ...prev, [questionId]: selectedOptions }))

  const handleFlagQuestion = async (questionId: string, isFlagged: boolean) => {
    if (!currentQuizAttempt?.attemptId) return
    try {
      const result = await flagQuizQuestion({ attemptId: currentQuizAttempt.attemptId, body: { questionId, isFlagged } })
      if (result.isSuccess && result.data) setFlaggedQuestions(result.data)
    } catch (error) { console.error('Error flagging question:', error); toast.error('Không thể đánh dấu câu hỏi') }
  }

  const handleSubmitQuiz = async () => {
    if (!currentQuizAttempt?.attemptId) return
    try {
      const result = await submitQuizAttempt({ attemptId: currentQuizAttempt.attemptId, body: { answers, timeSpentSeconds } })
      if (result.isSuccess) {
        toast.success('Nộp bài thành công!')
        router.replace(quizOverviewUrl(slug, courseId, sectionId, lessonId, quizId))
      }
    } catch (error) { console.error('Error submitting quiz:', error); toast.error('Không thể nộp bài') }
  }

  useEffect(() => {
    if (!isLoading && !currentQuizAttempt && quizId) {
      router.replace(quizOverviewUrl(slug, courseId, sectionId, lessonId, quizId))
    }
  }, [isLoading, currentQuizAttempt, quizId, router, slug, courseId, sectionId, lessonId])

  const isRedirectingToOverview = !isLoading && !currentQuizAttempt
  if (isRedirectingToOverview) return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-brand-purple" /></div>

  const answeredCount = Object.keys(answers).filter(qId => answers[qId] && answers[qId].length > 0).length
  const timeRemaining = currentQuizAttempt?.timeLimitMinutes ? Math.max(0, (currentQuizAttempt.timeLimitMinutes * 60) - timeSpentSeconds) : null
  const handleExit = () => router.replace(quizOverviewUrl(slug, courseId, sectionId, lessonId, quizId))

  return (
    <div className="h-screen bg-white flex flex-col relative overflow-hidden">
      <QuizAttemptHeader quizTitle={currentQuizAttempt?.quizTitle ?? ''} timeRemaining={timeRemaining} onExit={handleExit} />
      <div className="flex flex-1 overflow-hidden relative z-10 h-full">
        <QuizAttemptSidebar quizTitle={currentQuizAttempt?.quizTitle ?? ''} timeSpentSeconds={timeSpentSeconds} timeLimitMinutes={currentQuizAttempt?.timeLimitMinutes ?? null} questions={currentQuizAttempt?.questions ?? []} answers={answers} flaggedQuestions={flaggedQuestions} currentQuestionIndex={currentQuestionIndex} onQuestionSelect={handleQuestionSelect} onSubmitQuiz={() => setShowSubmitDialog(true)} isSubmitting={isSubmitting} answeredCount={answeredCount} totalQuestions={currentQuizAttempt?.totalQuestions ?? 0} />
        <div ref={scrollContainerRef} className="flex flex-col w-full overflow-y-auto h-full">
          <div className="px-14 py-6 mb-20 w-full">
            <div className="space-y-8">
              {currentQuizAttempt?.questions?.map((question, index) => (
                <div key={question.questionId} ref={(el) => { questionRefs.current[index] = el }} data-question-index={index} className="scroll-mt-20">
                  <QuestionCard question={question} currentIndex={index} totalQuestions={currentQuizAttempt?.totalQuestions ?? 0} selectedAnswers={answers[question.questionId] || []} isFlagged={flaggedQuestions.includes(question.questionId)} onAnswerChange={(sel: string[]) => handleAnswerChange(question.questionId, sel)} onFlagChange={(f: boolean) => handleFlagQuestion(question.questionId, f)} onPrevious={() => {}} onNext={() => {}} canGoPrevious={false} canGoNext={false} hideNavigation={true} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Xác nhận nộp bài</AlertDialogTitle><AlertDialogDescription>Bạn có chắc chắn muốn nộp bài không?<br /><br />Đã trả lời: {answeredCount}/{currentQuizAttempt?.totalQuestions ?? 0} câu hỏi</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Hủy</AlertDialogCancel><AlertDialogAction onClick={handleSubmitQuiz} disabled={isSubmitting} className="bg-brand-magenta hover:bg-brand-magenta/80">{isSubmitting ? 'Đang nộp...' : 'Nộp bài'}</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

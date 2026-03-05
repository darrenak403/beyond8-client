'use client'

import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { useGetQuizAttemptResult } from '@/hooks/useQuiz'
import ResultSummary from '../../[courseId]/(exam-attempt)/[sectionId]/[lessonId]/quiz-attempt/result/components/ResultSummary'
import QuestionResultCard from '../../[courseId]/(exam-attempt)/[sectionId]/[lessonId]/quiz-attempt/result/components/QuestionResultCard'
import QuizAttemptHeader from '../../[courseId]/(exam-attempt)/[sectionId]/[lessonId]/quiz-attempt/[quizId]/components/QuizAttemptHeader'
import { Loader2 } from 'lucide-react'
import { decodeCompoundId } from '@/utils/crypto'
import { quizOverviewUrl } from '@/utils/courseUrls'

export default function QuizResultPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const slug = params?.slug as string

  // id = enc(courseId|sectionId|lessonId|quizId|attemptId)
  const ids = decodeCompoundId(searchParams.get('id') || '')
  const courseId = ids[0] || ''
  const sectionId = ids[1] || ''
  const lessonId = ids[2] || ''
  const quizId = ids[3] || ''
  const attemptId = ids[4] || ''

  const { quizAttemptResult, isLoading } = useGetQuizAttemptResult(attemptId)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const questionRefs = useRef<(HTMLDivElement | null)[]>([])
  const scrollContainerRef = useRef<HTMLDivElement | null>(null)
  const isScrollingRef = useRef(false)
  const currentQuestionIndexRef = useRef<number>(0)

  const handleBack = () => {
    router.push(quizOverviewUrl(slug, courseId, sectionId, lessonId, quizId))
  }

  useEffect(() => {
    if (quizAttemptResult?.questionResults) {
      const newLength = quizAttemptResult.questionResults.length
      questionRefs.current = new Array(newLength).fill(null)
      if (currentQuestionIndexRef.current >= newLength) {
        currentQuestionIndexRef.current = 0
        setTimeout(() => setCurrentQuestionIndex(0), 0)
      }
    }
  }, [quizAttemptResult?.questionResults])

  // Scroll-synced question tracking
  useEffect(() => {
    if (!quizAttemptResult || questionRefs.current.length === 0 || !scrollContainerRef.current) return

    const observerOptions = {
      root: scrollContainerRef.current,
      rootMargin: '-120px 0px -10% 0px',
      threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
    }

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
        let selectedIndex: number

        if (scrollContainerRef.current && questionRefs.current.length > 0) {
          const container = scrollContainerRef.current
          const scrollBottom = container.scrollHeight - container.scrollTop - container.clientHeight
          const isNearBottom = scrollBottom < 200

          if (isNearBottom) {
            const lastIndex = questionRefs.current.length - 1
            const lastRef = questionRefs.current[lastIndex]
            if (lastRef) {
              const lastRect = lastRef.getBoundingClientRect()
              const containerRect = container.getBoundingClientRect()
              const isLastVisible = lastRect.top < containerRect.bottom && lastRect.bottom > containerRect.top
              if (isLastVisible) { selectedIndex = lastIndex } else { intersecting.sort((a, b) => Math.abs(b.visibleTop - a.visibleTop) > 50 ? b.visibleTop - a.visibleTop : Math.abs(b.ratio - a.ratio) > 0.1 ? b.ratio - a.ratio : a.topDistance - b.topDistance); selectedIndex = intersecting[0].index }
            } else { intersecting.sort((a, b) => Math.abs(b.visibleTop - a.visibleTop) > 50 ? b.visibleTop - a.visibleTop : Math.abs(b.ratio - a.ratio) > 0.1 ? b.ratio - a.ratio : a.topDistance - b.topDistance); selectedIndex = intersecting[0].index }
          } else { intersecting.sort((a, b) => Math.abs(b.visibleTop - a.visibleTop) > 50 ? b.visibleTop - a.visibleTop : Math.abs(b.ratio - a.ratio) > 0.1 ? b.ratio - a.ratio : a.topDistance - b.topDistance); selectedIndex = intersecting[0].index }
        } else { intersecting.sort((a, b) => Math.abs(b.visibleTop - a.visibleTop) > 50 ? b.visibleTop - a.visibleTop : Math.abs(b.ratio - a.ratio) > 0.1 ? b.ratio - a.ratio : a.topDistance - b.topDistance); selectedIndex = intersecting[0].index }

        if (selectedIndex !== currentQuestionIndexRef.current) {
          currentQuestionIndexRef.current = selectedIndex
          setCurrentQuestionIndex(selectedIndex)
        }
      }
    }

    const observer = new IntersectionObserver(observerCallback, observerOptions)
    questionRefs.current.forEach(ref => { if (ref) observer.observe(ref) })

    let scrollTimeout: NodeJS.Timeout | null = null
    const handleScroll = () => {
      if (isScrollingRef.current || !scrollContainerRef.current) return
      if (scrollTimeout) return
      scrollTimeout = setTimeout(() => {
        scrollTimeout = null
        const visible: Array<{ index: number; topDistance: number; visibility: number; visibleTop: number }> = []
        questionRefs.current.forEach((ref, index) => {
          if (ref && scrollContainerRef.current) {
            const rect = ref.getBoundingClientRect()
            const cRect = scrollContainerRef.current.getBoundingClientRect()
            const isVis = rect.top < cRect.bottom && rect.bottom > cRect.top
            if (isVis) {
              const vh = Math.min(rect.bottom, cRect.bottom) - Math.max(rect.top, cRect.top)
              const upperTop = cRect.top + 120
              const upperBottom = cRect.top + 400
              const vt = Math.max(0, Math.min(rect.bottom, upperBottom) - Math.max(rect.top, upperTop))
              visible.push({ index, topDistance: rect.top - cRect.top, visibility: vh / rect.height, visibleTop: vt })
            }
          }
        })
        if (visible.length > 0) {
          let closest = visible[0].index
          if (scrollContainerRef.current && questionRefs.current.length > 0) {
            const container = scrollContainerRef.current
            const scrollBot = container.scrollHeight - container.scrollTop - container.clientHeight
            if (scrollBot < 200) {
              const lastIdx = questionRefs.current.length - 1
              const lastRef = questionRefs.current[lastIdx]
              if (lastRef) {
                const lr = lastRef.getBoundingClientRect()
                const cr = container.getBoundingClientRect()
                if (lr.top < cr.bottom && lr.bottom > cr.top) closest = lastIdx
                else { visible.sort((a, b) => Math.abs(b.visibleTop - a.visibleTop) > 50 ? b.visibleTop - a.visibleTop : Math.abs(b.visibility - a.visibility) > 0.2 ? b.visibility - a.visibility : a.topDistance - b.topDistance); closest = visible[0].index }
              }
            } else { visible.sort((a, b) => Math.abs(b.visibleTop - a.visibleTop) > 50 ? b.visibleTop - a.visibleTop : Math.abs(b.visibility - a.visibility) > 0.2 ? b.visibility - a.visibility : a.topDistance - b.topDistance); closest = visible[0].index }
          }
          if (closest !== currentQuestionIndexRef.current) { currentQuestionIndexRef.current = closest; setCurrentQuestionIndex(closest) }
        }
      }, 100)
    }

    const scrollContainer = scrollContainerRef.current
    scrollContainer?.addEventListener('scroll', handleScroll, { passive: true })
    return () => { observer.disconnect(); scrollContainer?.removeEventListener('scroll', handleScroll); if (scrollTimeout) clearTimeout(scrollTimeout) }
  }, [quizAttemptResult])

  const handleQuestionSelect = (index: number) => {
    const ref = questionRefs.current[index]
    if (ref) { isScrollingRef.current = true; currentQuestionIndexRef.current = index; ref.scrollIntoView({ behavior: 'smooth', block: 'center' }); setCurrentQuestionIndex(index); setTimeout(() => { isScrollingRef.current = false }, 1000) }
  }

  if (isLoading) return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-brand-purple" /></div>
  if (!quizAttemptResult) return <div className="min-h-screen bg-background flex items-center justify-center"><p className="text-muted-foreground">Không tìm thấy kết quả bài kiểm tra</p></div>

  return (
    <div className="h-screen bg-white flex flex-col relative overflow-hidden">
      <QuizAttemptHeader quizTitle={quizAttemptResult.quizTitle} timeRemaining={null} onBack={handleBack} />
      <div className="flex flex-1 overflow-hidden relative z-10 h-full">
        <ResultSummary result={quizAttemptResult} currentQuestionIndex={currentQuestionIndex} onQuestionSelect={handleQuestionSelect} />
        <div ref={scrollContainerRef} className="flex flex-col w-full overflow-y-auto h-full">
          <div className="px-14 py-6 w-full">
            <div className="space-y-8">
              {quizAttemptResult.questionResults.map((question, index) => (
                <div key={question.questionId} ref={(el) => { questionRefs.current[index] = el }} data-question-index={index} className="scroll-mt-20">
                  <QuestionResultCard question={question} currentIndex={index} totalQuestions={quizAttemptResult.totalQuestions} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

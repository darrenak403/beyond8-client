'use client'

import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { useGetQuizAttemptResult } from '@/hooks/useQuiz'
import ResultSummary from '../components/ResultSummary'
import QuestionResultCard from '../components/QuestionResultCard'
import QuizAttemptHeader from '../../[quizId]/components/QuizAttemptHeader'
import { Loader2 } from 'lucide-react'

export default function QuizResultPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const attemptId = params?.attemptId as string
  const quizId = searchParams.get('quizId') || ''

  const { quizAttemptResult, isLoading } = useGetQuizAttemptResult(attemptId)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const questionRefs = useRef<(HTMLDivElement | null)[]>([])
  const scrollContainerRef = useRef<HTMLDivElement | null>(null)
  const isScrollingRef = useRef(false)
  const currentQuestionIndexRef = useRef<number>(0)

  const handleBack = () => {
    const slug = params?.slug as string
    const courseId = params?.courseId as string
    const sectionId = params?.sectionId as string
    const lessonId = params?.lessonId as string
    router.push(`/courses/${slug}/${courseId}/${sectionId}/${lessonId}/quiz-attempt?quizId=${quizId}`)
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

  useEffect(() => {
    if (!quizAttemptResult || questionRefs.current.length === 0 || !scrollContainerRef.current) return

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
              
              if (isLastVisible) {
                selectedIndex = lastIndex
              } else {
                intersectingQuestions.sort((a, b) => {
                  if (Math.abs(b.visibleTop - a.visibleTop) > 50) {
                    return b.visibleTop - a.visibleTop
                  }
                  if (Math.abs(b.intersectionRatio - a.intersectionRatio) > 0.1) {
                    return b.intersectionRatio - a.intersectionRatio
                  }
                  return a.topDistance - b.topDistance
                })
                selectedIndex = intersectingQuestions[0].index
              }
            } else {
              intersectingQuestions.sort((a, b) => {
                if (Math.abs(b.visibleTop - a.visibleTop) > 50) {
                  return b.visibleTop - a.visibleTop
                }
                if (Math.abs(b.intersectionRatio - a.intersectionRatio) > 0.1) {
                  return b.intersectionRatio - a.intersectionRatio
                }
                return a.topDistance - b.topDistance
              })
              selectedIndex = intersectingQuestions[0].index
            }
          } else {
            intersectingQuestions.sort((a, b) => {
              if (Math.abs(b.visibleTop - a.visibleTop) > 50) {
                return b.visibleTop - a.visibleTop
              }
              if (Math.abs(b.intersectionRatio - a.intersectionRatio) > 0.1) {
                return b.intersectionRatio - a.intersectionRatio
              }
              return a.topDistance - b.topDistance
            })
            selectedIndex = intersectingQuestions[0].index
          }
        } else {
          intersectingQuestions.sort((a, b) => {
            if (Math.abs(b.visibleTop - a.visibleTop) > 50) {
              return b.visibleTop - a.visibleTop
            }
            if (Math.abs(b.intersectionRatio - a.intersectionRatio) > 0.1) {
              return b.intersectionRatio - a.intersectionRatio
            }
            return a.topDistance - b.topDistance
          })
          selectedIndex = intersectingQuestions[0].index
        }
        
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
          let closestIndex = visibleQuestions[0].index
          
          if (scrollContainerRef.current && questionRefs.current.length > 0) {
            const container = scrollContainerRef.current
            const scrollBottom = container.scrollHeight - container.scrollTop - container.clientHeight
            const isAtBottom = scrollBottom < 200 
            
            if (isAtBottom) {
              const lastIndex = questionRefs.current.length - 1
              const lastRef = questionRefs.current[lastIndex]
              
              if (lastRef) {
                const lastRect = lastRef.getBoundingClientRect()
                const containerRect = container.getBoundingClientRect()
                
                const isLastVisible = lastRect.top < containerRect.bottom && lastRect.bottom > containerRect.top
                
                if (isLastVisible) {
                  closestIndex = lastIndex
                }
              }
            } else {
              visibleQuestions.sort((a, b) => {
                if (Math.abs(b.visibleTop - a.visibleTop) > 50) {
                  return b.visibleTop - a.visibleTop
                }
                if (Math.abs(b.visibility - a.visibility) > 0.2) {
                  return b.visibility - a.visibility
                }
                return a.topDistance - b.topDistance
              })
              closestIndex = visibleQuestions[0].index
            }
          } else {
            visibleQuestions.sort((a, b) => {
              if (Math.abs(b.visibleTop - a.visibleTop) > 50) {
                return b.visibleTop - a.visibleTop
              }
              if (Math.abs(b.visibility - a.visibility) > 0.2) {
                return b.visibility - a.visibility
              }
              return a.topDistance - b.topDistance
            })
            closestIndex = visibleQuestions[0].index
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
  }, [quizAttemptResult])

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-purple" />
      </div>
    )
  }

  if (!quizAttemptResult) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Không tìm thấy kết quả bài kiểm tra</p>
      </div>
    )
  }

  return (
    <div className="h-screen bg-white flex flex-col relative overflow-hidden">
      {/* Header */}
      <QuizAttemptHeader 
        quizTitle={quizAttemptResult.quizTitle}
        timeRemaining={null}
        onBack={handleBack}
      />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden relative z-10 h-full">
        {/* Result Summary Sidebar */}
        <ResultSummary 
          result={quizAttemptResult} 
          currentQuestionIndex={currentQuestionIndex}
          onQuestionSelect={handleQuestionSelect}
        />

        {/* Question Content - Scrollable */}
        <div ref={scrollContainerRef} className="flex flex-col w-full overflow-y-auto h-full">
          <div className="px-14 py-6 w-full">
            <div className="space-y-8">
              {quizAttemptResult.questionResults.map((question, index) => (
                <div
                  key={question.questionId}
                  ref={(el) => {
                    questionRefs.current[index] = el
                  }}
                  data-question-index={index}
                  className="scroll-mt-20"
                >
                  <QuestionResultCard
                    question={question}
                    currentIndex={index}
                    totalQuestions={quizAttemptResult.totalQuestions}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

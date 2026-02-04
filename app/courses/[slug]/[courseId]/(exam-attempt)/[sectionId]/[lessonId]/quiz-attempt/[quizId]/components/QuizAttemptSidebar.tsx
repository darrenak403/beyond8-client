'use client'

import { Button } from '@/components/ui/button'
import { Flag, Loader2, Sparkles } from 'lucide-react'
import { QuizQuestion } from '@/lib/api/services/fetchQuiz'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface QuizAttemptSidebarProps {
  quizTitle: string

  timeSpentSeconds: number
  timeLimitMinutes: number | null
  questions: QuizQuestion[]
  answers: Record<string, string[]>
  flaggedQuestions: string[]
  currentQuestionIndex: number
  onQuestionSelect: (index: number) => void
  onSubmitQuiz: () => void
  isSubmitting: boolean
}

export default function QuizAttemptSidebar({
  quizTitle,
  timeSpentSeconds,
  timeLimitMinutes,
  questions,
  answers,
  flaggedQuestions,
  currentQuestionIndex,
  onQuestionSelect,
  onSubmitQuiz,
  isSubmitting,
}: QuizAttemptSidebarProps) {
  const getRemainingTime = () => {
    if (!timeLimitMinutes) return null
    const totalSeconds = timeLimitMinutes * 60
    const remaining = totalSeconds - timeSpentSeconds
    return Math.max(0, remaining)
  }

  const remainingTime = getRemainingTime()
  const isTimeUp = remainingTime !== null && remainingTime === 0

  return (
    <div className="w-[320px] sticky top-0 h-[calc(100vh-64px)] flex flex-col shrink-0 border-r bg-white shadow-sm">
      {/* Header */}
      <div className="relative p-4 border-b shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-brand-magenta" />
          <h3 className="font-bold text-base line-clamp-2 text-foreground">
            {quizTitle}
          </h3>
        </div>
      </div>

      {/* Questions Grid */}
      <div className="flex-1 overflow-y-auto p-4 relative min-h-0">
        <div className="text-sm font-semibold mb-3 text-foreground flex items-center gap-2">
          <span>Danh sách câu hỏi</span>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {questions.map((question, index) => {
            const isAnswered = answers[question.questionId] && answers[question.questionId].length > 0
            const isFlagged = flaggedQuestions.includes(question.questionId)
            const isCurrent = index === currentQuestionIndex

            return (
              <motion.button
                key={question.questionId}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onQuestionSelect(index)}
                className={cn(
                  "relative aspect-square rounded-lg flex items-center justify-center text-sm font-bold transition-all border-2",
                  isCurrent
                    ? "bg-brand-magenta text-white border-brand-magenta shadow-md"
                    : isAnswered
                    ? "bg-green-50 text-green-700 border-green-200 hover:border-green-300"
                    : "bg-gray-50 text-gray-600 border-gray-200 hover:border-brand-magenta hover:bg-brand-magenta/5"
                )}
              >

                
                <span className="relative z-10">{index + 1}</span>
                
                {isFlagged && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 z-20"
                  >
                    <Flag className="w-3 h-3 text-yellow-600 fill-yellow-400 drop-shadow-lg" />
                  </motion.div>
                )}
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Submit Button */}
      <div className="relative p-4 border-t shrink-0">
        <Button
          onClick={onSubmitQuiz}
          disabled={isSubmitting}
          className="w-full bg-brand-magenta text-white font-bold shadow-lg"
          size="lg"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Đang nộp...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Nộp bài
              </>
            )}
          </span>
        </Button>
        {isTimeUp && (
          <p className="text-xs text-red-600 mt-2 text-center font-medium">
            Thời gian đã hết, vui lòng nộp bài
          </p>
        )}
      </div>
    </div>
  )
}

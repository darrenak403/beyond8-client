'use client'

import { QuizAttemptQuestionResult } from '@/lib/api/services/fetchQuiz'
import { cn } from '@/lib/utils'

interface QuestionsListProps {
  questions: QuizAttemptQuestionResult[]
  currentQuestionIndex: number
  onQuestionSelect: (index: number) => void
}

export default function QuestionsList({ 
  questions, 
  currentQuestionIndex, 
  onQuestionSelect 
}: QuestionsListProps) {
  return (
    <div className="space-y-2 px-6 pb-6">
      <h4 className="font-semibold text-sm text-foreground mb-2">Danh sách câu hỏi</h4>
      <div className="grid grid-cols-5 gap-2">
        {questions.map((q, index) => (
          <button
            key={q.questionId}
            onClick={() => onQuestionSelect(index)}
            className={cn(
              "w-10 h-10 rounded-lg border-2 flex items-center justify-center text-sm font-semibold transition-all",
              currentQuestionIndex === index
                ? "border-brand-magenta bg-brand-magenta text-white"
                : q.isCorrect
                ? "border-green-500 bg-green-100 text-green-700 hover:border-green-600"
                : "border-red-500 bg-red-100 text-red-700 hover:border-red-600"
            )}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  )
}

'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, XCircle } from 'lucide-react'
import { QuizAttemptResult } from '@/lib/api/services/fetchQuiz'
import QuestionsList from './QuestionsList'

interface ResultSummaryProps {
  result: QuizAttemptResult
  currentQuestionIndex: number
  onQuestionSelect: (index: number) => void
}

export default function ResultSummary({ 
  result, 
  currentQuestionIndex, 
  onQuestionSelect 
}: ResultSummaryProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="w-100 border-r border-gray-200 bg-white overflow-y-auto">
      <div className="py-6 px-4 space-y-6">
        {/* Result Summary */}
        <Card className="border-2">
          <CardContent className="p-6 space-y-4">
            <div className="text-center">
              <div className={result.isPassed ? "text-green-600" : "text-red-600"}>
                {result.isPassed ? (
                  <CheckCircle2 className="w-16 h-16 mx-auto mb-2" />
                ) : (
                  <XCircle className="w-16 h-16 mx-auto mb-2" />
                )}
              </div>
              <h3 className="text-2xl font-bold mb-2">
                {result.scorePercent}%
              </h3>
              <Badge className={result.isPassed ? "bg-green-500" : "bg-red-500"}>
                {result.isPassed ? 'Đạt' : 'Chưa đạt'}
              </Badge>
            </div>

            <div className="space-y-3 pt-4 border-t">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Điểm số:</span>
                <span className="font-semibold">{result.score}/{result.totalPoints}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Thời gian:</span>
                <span className="font-semibold">{formatTime(result.timeSpentSeconds)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Đúng:</span>
                <span className="font-semibold text-green-600">{result.correctAnswers}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Sai:</span>
                <span className="font-semibold text-red-600">{result.wrongAnswers}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Lần làm:</span>
                <span className="font-semibold">{result.attemptNumber}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Questions List */}
        <QuestionsList 
          questions={result.questionResults}
          currentQuestionIndex={currentQuestionIndex}
          onQuestionSelect={onQuestionSelect}
        />
      </div>
    </div>
  )
}

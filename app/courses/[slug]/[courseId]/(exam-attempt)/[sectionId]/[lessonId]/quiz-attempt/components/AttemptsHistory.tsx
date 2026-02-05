'use client'

import { useParams, useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, XCircle, FileQuestion } from 'lucide-react'
import { QuizAttemptSummaryItem } from '@/lib/api/services/fetchQuiz'
import { cn } from '@/lib/utils'

interface AttemptsHistoryProps {
  attempts: QuizAttemptSummaryItem[]
  quizId: string
}

export default function AttemptsHistory({ attempts, quizId }: AttemptsHistoryProps) {
  const params = useParams()
  const router = useRouter()

  const handleViewResult = (attemptId: string) => {
    const slug = params?.slug as string
    const courseId = params?.courseId as string
    const sectionId = params?.sectionId as string
    const lessonId = params?.lessonId as string
    router.push(`/courses/${slug}/${courseId}/${sectionId}/${lessonId}/quiz-attempt/result/${attemptId}?quizId=${quizId}`)
  }

  if (attempts.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-8">
        <div className="text-center py-8">
          <div className="w-16 h-16 rounded-full bg-brand-magenta/10 flex items-center justify-center mx-auto mb-3">
            <FileQuestion className="w-8 h-8 text-brand-magenta" />
          </div>
          <p className="text-muted-foreground font-medium">
            Chưa có lịch sử làm bài
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Hãy bắt đầu làm bài để xem kết quả
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <h3 className="text-lg font-bold text-foreground mb-4">Lịch sử làm bài</h3>
      
      <div className="space-y-3">
        {attempts.map((attempt) => (
          <div 
            key={attempt.attemptId} 
            onClick={() => attempt.submittedAt && handleViewResult(attempt.attemptId)}
            className={cn(
              "flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl transition-all",
              attempt.submittedAt 
                ? "cursor-pointer hover:border-brand-magenta/30 hover:bg-brand-magenta/5" 
                : ""
            )}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand-magenta/10 flex items-center justify-center text-brand-magenta font-bold text-lg border border-brand-magenta/20">
                {attempt.attemptNumber}
              </div>
              <div>
                <p className="font-semibold text-foreground">
                  Lần {attempt.attemptNumber}
                </p>
                <p className="text-sm text-muted-foreground">
                  {new Date(attempt.startedAt).toLocaleString('vi-VN')}
                </p>
              </div>
            </div>
            
            <div>
              {attempt.submittedAt ? (
                <>
                  {attempt.isPassed ? (
                    <Badge className="bg-green-50 text-green-700 border border-green-200 px-4 py-1.5 hover:text-green-700 hover:bg-green-50">
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                      Đạt {attempt.scorePercent}%
                    </Badge>
                  ) : (
                    <Badge className="bg-red-50 text-red-700 border border-red-200 px-4 py-1.5 hover:text-red-700 hover:bg-red-50">
                      <XCircle className="w-4 h-4 mr-1" />
                      Chưa đạt {attempt.scorePercent}%
                    </Badge>
                  )}
                </>
              ) : (
                <Badge className="bg-brand-magenta/10 text-brand-magenta border border-brand-magenta/20 px-4 py-1.5 hover:text-brand-magenta hover:bg-brand-magenta/20">
                  Đang làm
                </Badge>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
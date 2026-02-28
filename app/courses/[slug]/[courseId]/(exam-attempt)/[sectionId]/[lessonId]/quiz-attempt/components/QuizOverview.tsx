'use client'

import { Button } from '@/components/ui/button'
import { Sparkles, Clock, FileQuestion, Target, Loader2 } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { QuizOverview as QuizOverviewType, QuizMyAttemptsSummary } from '@/lib/api/services/fetchQuiz'
import { motion } from 'framer-motion'
import AttemptsHistory from './AttemptsHistory'
import { useState } from 'react'
import { useRequestQuizReassign } from '@/hooks/useReassign'
import { RequestReassignDialog } from '@/components/widget/reassign/RequestReassignDialog'

interface QuizOverviewProps {
  quizOverview: QuizOverviewType
  myQuizAttempts: QuizMyAttemptsSummary | null
  isLoadingAttempts: boolean
  onStartQuiz: () => void
  isStarting: boolean
  quizId: string
  courseId?: string
  sectionId?: string
  lessonId?: string
}

export default function QuizOverview({
  quizOverview,
  myQuizAttempts,
  isLoadingAttempts,
  onStartQuiz,
  isStarting,
  quizId,
  courseId,
  sectionId,
  lessonId,
}: QuizOverviewProps) {
  const [showRequestDialog, setShowRequestDialog] = useState(false)
  const { requestQuizReassign, isPending: isRequesting } = useRequestQuizReassign()

  const isPassed = myQuizAttempts?.bestScore !== null &&
    myQuizAttempts?.bestScore !== undefined &&
    myQuizAttempts.bestScore >= quizOverview.passScorePercent

  const canStartQuiz = myQuizAttempts
    ? myQuizAttempts.remainingAttempts > 0 && !isPassed
    : true

  const formatTime = (minutes: number | null) => {
    if (!minutes) return 'Không giới hạn'
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0 && mins > 0) {
      return `${hours} giờ ${mins} phút`
    } else if (hours > 0) {
      return `${hours} giờ`
    }
    return `${mins} phút`
  }

  return (
    <div className="container w-full mx-auto py-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Quiz Info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl border border-gray-200 p-8 space-y-6"
        >
          {/* Quiz Title */}
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-3">
              {quizOverview.title}
            </h1>
            {quizOverview.description && (
              <p className="text-muted-foreground leading-relaxed">
                {quizOverview.description}
              </p>
            )}
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 border border-gray-200">
              <div className="p-2 rounded-lg bg-brand-magenta/10">
                <FileQuestion className="w-5 h-5 text-brand-magenta" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Số câu</p>
                <p className="text-xl font-bold text-brand-magenta">{quizOverview.questionCount}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 border border-gray-200">
              <div className="p-2 rounded-lg bg-brand-purple/10">
                <Clock className="w-5 h-5 text-brand-purple" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Thời gian</p>
                <p className="text-xl font-bold text-brand-purple">{formatTime(quizOverview.timeLimitMinutes)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 border border-gray-200">
              <div className="p-2 rounded-lg bg-brand-pink/10">
                <Target className="w-5 h-5 text-brand-pink" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Điểm đạt</p>
                <p className="text-xl font-bold text-brand-pink">{quizOverview.passScorePercent}%</p>
              </div>
            </div>
          </div>

          {/* Description/Info Section */}
          <div className="flex-1 p-6 rounded-xl bg-gray-50 border border-gray-200">
            <h3 className="font-semibold text-foreground mb-2">Hướng dẫn làm bài</h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• Đọc kỹ câu hỏi trước khi trả lời</li>
              <li>• Bạn có thể đánh dấu câu hỏi để xem lại sau</li>
              <li>• Kiểm tra kỹ trước khi nộp bài</li>
              <li>• Điểm đạt yêu cầu: {quizOverview.passScorePercent}%</li>
            </ul>
          </div>

          {/* Start Button - Bottom Right */}
          <div className="flex justify-end">
            <Button
              onClick={onStartQuiz}
              disabled={!canStartQuiz || isStarting}
              className="h-12 px-8 text-base font-bold bg-brand-magenta hover:bg-brand-magenta/90 text-white shadow-md rounded-xl"
              size="lg"
            >
              {isStarting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Đang khởi tạo...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Bắt đầu làm bài
                </>
              )}
            </Button>
          </div>
          {!canStartQuiz && !isPassed && (
            <div className="flex flex-col items-end gap-2">
              <p className="text-sm text-destructive font-medium">
                Bạn đã hết lượt làm bài
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowRequestDialog(true)}
                className="text-brand-magenta border-brand-magenta/20 hover:bg-brand-magenta/10 hover:text-brand-magenta"
              >
                Yêu cầu thêm lượt làm bài
              </Button>
            </div>
          )}

          {isPassed && (
            <div className="flex flex-col items-end gap-2">
              <p className="text-sm text-green-600 font-medium">
                Bạn đã đạt yêu cầu bài kiểm tra này
              </p>
            </div>
          )}

          <RequestReassignDialog
            open={showRequestDialog}
            onOpenChange={setShowRequestDialog}
            title="Yêu cầu thêm lượt làm bài"
            description="Bạn đã hết lượt làm bài kiểm tra này. Vui lòng gửi yêu cầu để giảng viên cấp thêm lượt cho bạn."
            isPending={isRequesting}
            onSubmit={async (reason, note) => {
              await requestQuizReassign({
                quizId,
                request: { reason, note: note || null }
              })
            }}
          />
        </motion.div>

        {/* Right Column - Stats + History */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-6"
        >
          {isLoadingAttempts ? (
            <div className="space-y-6">
              {/* Stats Skeleton */}
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="text-center p-4 rounded-xl bg-white border border-gray-200">
                    <Skeleton className="h-3 w-16 mx-auto mb-2" />
                    <Skeleton className="h-8 w-12 mx-auto mb-1" />
                    <Skeleton className="h-3 w-20 mx-auto" />
                  </div>
                ))}
              </div>

              {/* History Skeleton */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
                <Skeleton className="h-6 w-32" />
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl">
                    <div className="flex items-center gap-4">
                      <Skeleton className="w-12 h-12 rounded-xl" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                    </div>
                    <Skeleton className="h-8 w-24 rounded-lg" />
                  </div>
                ))}
              </div>
            </div>
          ) : myQuizAttempts ? (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-xl bg-white border border-gray-200">
                  <p className="text-sm text-muted-foreground mb-1">Đã làm</p>
                  <p className="text-3xl font-bold text-brand-purple">{myQuizAttempts.usedAttempts}</p>
                  <p className="text-xs text-muted-foreground mt-1">/ {myQuizAttempts.maxAttempts} lần</p>
                </div>

                <div className="text-center p-4 rounded-xl bg-brand-magenta/5 border border-brand-magenta/20">
                  <p className="text-sm text-muted-foreground mb-1">Còn lại</p>
                  <p className="text-3xl font-bold text-brand-magenta">{myQuizAttempts.remainingAttempts}</p>
                  <p className="text-xs text-muted-foreground mt-1">lượt</p>
                </div>

                <div className="text-center p-4 rounded-xl bg-white border border-gray-200">
                  <p className="text-sm text-muted-foreground mb-1">Cao nhất</p>
                  <p className="text-3xl font-bold text-brand-pink">
                    {myQuizAttempts.bestScore !== null
                      ? `${myQuizAttempts.bestScore}%`
                      : '--'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {myQuizAttempts.bestScore !== null ? 'điểm' : 'chưa có'}
                  </p>
                </div>
              </div>

              {/* Attempts History */}
              <AttemptsHistory attempts={myQuizAttempts.attempts} quizId={quizId} courseId={courseId} sectionId={sectionId} lessonId={lessonId} />
            </>
          ) : null}
        </motion.div>
      </div>
    </div>
  )
}

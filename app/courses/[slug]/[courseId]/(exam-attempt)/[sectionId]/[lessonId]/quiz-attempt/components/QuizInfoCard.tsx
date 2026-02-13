'use client'

import { Clock, FileQuestion, Target } from 'lucide-react'
import { QuizOverview } from '@/lib/api/services/fetchQuiz'

interface QuizInfoCardProps {
  quizOverview: QuizOverview
}

export default function QuizInfoCard({ quizOverview }: QuizInfoCardProps) {
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
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 space-y-6">
      {/* Title & Description */}
      <div className="space-y-3">
        <h1 className="text-3xl font-bold text-foreground">
          {quizOverview.title}
        </h1>
        {quizOverview.description && (
          <p className="text-muted-foreground leading-relaxed">
            {quizOverview.description}
          </p>
        )}
      </div>

      {/* Stats */}
      <div className="space-y-4 pt-4 border-t">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-brand-magenta/10">
            <FileQuestion className="w-5 h-5 text-brand-magenta" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Số câu hỏi</p>
            <p className="text-2xl font-bold text-brand-magenta">{quizOverview.questionCount || 0}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-brand-purple/10">
            <Clock className="w-5 h-5 text-brand-purple" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Thời gian</p>
            <p className="text-2xl font-bold text-brand-purple">{formatTime(quizOverview.timeLimitMinutes)}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-brand-pink/10">
            <Target className="w-5 h-5 text-brand-pink" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Điểm đạt</p>
            <p className="text-2xl font-bold text-brand-pink">{quizOverview.passScorePercent}%</p>
          </div>
        </div>
      </div>
    </div>
  )
}

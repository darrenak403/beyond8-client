import { SubmissionAssigment } from '@/lib/api/services/fetchAssignment'
import { Badge } from '@/components/ui/badge'
import { Clock, CheckCircle2, FileText } from 'lucide-react'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { cn } from '@/lib/utils'

interface SubmissionHistoryProps {
    submissions: SubmissionAssigment[]
    selectedSubmissionId?: string
    onSelectSubmission: (submission: SubmissionAssigment) => void
}

export default function SubmissionHistory({
    submissions,
    selectedSubmissionId,
    onSelectSubmission
}: SubmissionHistoryProps) {
    if (!submissions || submissions.length === 0) {
        return null
    }

    // Sort submissions by submittedAt (newest first)
    const sortedSubmissions = [...submissions].sort((a, b) =>
        new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    )

    return (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Lịch sử nộp bài</h3>
                <Badge variant="secondary" className="bg-brand-purple/10 text-brand-purple border-brand-purple/20">
                    {submissions.length} lần nộp
                </Badge>
            </div>

            <div className="space-y-3">
                {sortedSubmissions.map((submission, index) => {
                    const isSelected = selectedSubmissionId === submission.id
                    const isLatest = index === 0
                    const isGraded = submission.status === 'Graded'

                    return (
                        <button
                            key={submission.id}
                            onClick={() => onSelectSubmission(submission)}
                            className={cn(
                                "w-full text-left p-4 rounded-xl border-2 transition-all hover:shadow-md",
                                isSelected
                                    ? "border-brand-purple bg-brand-purple/5 shadow-sm"
                                    : "border-gray-200 hover:border-brand-purple/30 bg-white"
                            )}
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="font-semibold text-gray-900">
                                            Lần {submissions.length - index}
                                        </span>
                                        {isLatest && (
                                            <Badge variant="outline" className="text-[10px] border-blue-500 text-blue-600 bg-blue-50">
                                                Mới nhất
                                            </Badge>
                                        )}
                                        <Badge
                                            variant={isGraded ? "default" : "secondary"}
                                            className={cn(
                                                "text-[10px]",
                                                isGraded
                                                    ? "bg-green-100 text-green-700 border-green-200"
                                                    : "bg-yellow-100 text-yellow-700 border-yellow-200"
                                            )}
                                        >
                                            {isGraded ? 'Đã chấm' : 'Chưa chấm'}
                                        </Badge>
                                    </div>

                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="w-3.5 h-3.5" />
                                            <span>{format(new Date(submission.submittedAt), "dd/MM/yyyy HH:mm", { locale: vi })}</span>
                                        </div>

                                        {isGraded && submission.finalScore !== null && (
                                            <div className="flex items-center gap-1.5 font-semibold text-brand-purple">
                                                <CheckCircle2 className="w-3.5 h-3.5" />
                                                <span>{submission.finalScore} điểm</span>
                                            </div>
                                        )}
                                    </div>

                                    {submission.textContent && (
                                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                            <FileText className="w-3 h-3" />
                                            <span className="truncate">
                                                {submission.textContent.substring(0, 50)}
                                                {submission.textContent.length > 50 ? '...' : ''}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {isSelected && (
                                    <div className="shrink-0">
                                        <div className="w-6 h-6 rounded-full bg-brand-purple flex items-center justify-center">
                                            <CheckCircle2 className="w-4 h-4 text-white" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}


import { CheckCircle2, AlertCircle, Lightbulb, ListChecks } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface AiFeedback {
    summary?: string
    strengths?: string[]
    suggestions?: string[]
    improvements?: string[]
    criteriaFeedbacks?: {
        criteriaName: string
        score: number
        maxScore: number
        level: string
        feedback: string
    }[]
}

export function AiFeedbackDisplay({ feedbackJson }: { feedbackJson: string }) {
    let feedback: AiFeedback | null = null
    try {
        feedback = JSON.parse(feedbackJson)
    } catch {
        return <div className="text-muted-foreground italic">Không thể đọc dữ liệu đánh giá chi tiết.</div>
    }

    if (!feedback) return null

    return (
        <div className="space-y-4">
            {feedback.summary && (
                <div className="bg-slate-50 p-3 rounded-md border text-slate-700 italic">
                    &quot;{feedback.summary}&quot;
                </div>
            )}

            {feedback.criteriaFeedbacks && feedback.criteriaFeedbacks.length > 0 && (
                <div className="space-y-2">
                    <h5 className="font-medium flex items-center gap-1.5 text-slate-900">
                        <ListChecks className="w-4 h-4 text-blue-500" />
                        Chi tiết tiêu chí
                    </h5>
                    <div className="grid gap-2">
                        {feedback.criteriaFeedbacks.map((criteria, idx) => (
                            <div key={idx} className="border rounded-md p-2.5 bg-white text-sm">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="font-semibold text-slate-800">{criteria.criteriaName}</span>
                                    <Badge variant="outline" className={`${getLevelColor(criteria.level)}`}>
                                        {criteria.score}/{criteria.maxScore}
                                    </Badge>
                                </div>
                                <p className="text-slate-600 mb-1">{criteria.feedback}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 gap-4">
                {feedback.strengths && feedback.strengths.length > 0 && (
                    <div className="space-y-1">
                        <h5 className="font-medium flex items-center gap-1.5 text-green-700 text-xs uppercase tracking-wide">
                            <CheckCircle2 className="w-4 h-4" />
                            Điểm mạnh
                        </h5>
                        <ul className="list-disc list-inside text-slate-600 pl-1 space-y-0.5">
                            {feedback.strengths.map((s, i) => (
                                <li key={i}>{s}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {feedback.improvements && feedback.improvements.length > 0 && (
                    <div className="space-y-1">
                        <h5 className="font-medium flex items-center gap-1.5 text-amber-700 text-xs uppercase tracking-wide">
                            <AlertCircle className="w-4 h-4" />
                            Cần cải thiện
                        </h5>
                        <ul className="list-disc list-inside text-slate-600 pl-1 space-y-0.5">
                            {feedback.improvements.map((s, i) => (
                                <li key={i}>{s}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {feedback.suggestions && feedback.suggestions.length > 0 && (
                    <div className="space-y-1">
                        <h5 className="font-medium flex items-center gap-1.5 text-blue-700 text-xs uppercase tracking-wide">
                            <Lightbulb className="w-4 h-4" />
                            Gợi ý
                        </h5>
                        <ul className="list-disc list-inside text-slate-600 pl-1 space-y-0.5">
                            {feedback.suggestions.map((s, i) => (
                                <li key={i}>{s}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    )
}

function getLevelColor(level: string) {
    const l = level.toLowerCase()
    if (l.includes('giỏi') || l.includes('xuất sắc') || l.includes('tốt')) return 'bg-green-50 text-green-700 border-green-200'
    if (l.includes('khá')) return 'bg-blue-50 text-blue-700 border-blue-200'
    if (l.includes('trung bình')) return 'bg-yellow-50 text-yellow-700 border-yellow-200'
    return 'bg-slate-50 text-slate-700 border-slate-200'
}

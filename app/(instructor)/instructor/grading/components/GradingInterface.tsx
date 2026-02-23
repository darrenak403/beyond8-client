import { useState } from "react"
import { useGradeAssignment, useResetSubmission } from "@/hooks/useAssignment"
import { Assignment, SubmissionAssigment } from "@/lib/api/services/fetchAssignment"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FileIcon, Loader2, Download, RefreshCw } from "lucide-react"
import { AiFeedbackDisplay } from "./AiFeedbackDisplay"
import { formatImageUrl } from "@/lib/utils/formatImageUrl"
import DownloadableFileItem from "@/components/widget/assignment/DownloadableFileItem"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface GradingInterfaceProps {
    submission: SubmissionAssigment
    assignment: Assignment
    onGraded: () => void
}

export function GradingInterface({ submission, assignment, onGraded }: GradingInterfaceProps) {
    const [score, setScore] = useState<string>(submission.finalScore?.toString() || "")
    const [feedback, setFeedback] = useState<string>(submission.instructorFeedback || "")

    const { gradeAssignment, isPending } = useGradeAssignment(submission.id)
    const { resetSubmission, isPending: isResetting } = useResetSubmission(assignment.id)

    const hasExceededSubmissions = assignment.maxSubmissions > 0 && submission.submissionNumber >= assignment.maxSubmissions

    const handleSubmit = () => {
        const numScore = parseFloat(score)
        if (isNaN(numScore)) {
            // Validate
            return
        }

        gradeAssignment({
            finalScore: numScore,
            instructorFeedback: feedback
        }, {
            onSuccess: () => {
                onGraded()
            }
        })
    }

    return (
        <div className="flex flex-col lg:flex-row gap-6 lg:h-full h-auto">
            {/* Column 1: Submission Content */}
            <div className="flex-1 flex flex-col border rounded-2xl bg-slate-50 overflow-hidden min-h-[500px] lg:min-h-0">
                <div className="p-4 border-b bg-white">
                    <h3 className="font-semibold text-lg">Nội dung bài làm</h3>
                </div>

                <div className="p-4 overflow-y-auto flex-1 space-y-6">
                    {/* Text Content */}
                    {submission.textContent && (
                        <div>
                            <Label className="mb-2 block text-muted-foreground font-medium">Văn bản:</Label>
                            <div className="p-4 bg-white rounded-xl border min-h-[100px] whitespace-pre-wrap text-sm leading-relaxed shadow-sm">
                                {submission.textContent}
                            </div>
                        </div>
                    )}

                    {/* Files */}
                    {submission.fileUrls && submission.fileUrls.length > 0 && (
                        <div>
                            <Label className="mb-2 block text-muted-foreground font-medium">Tệp đính kèm ({submission.fileUrls.length}):</Label>
                            <div className="grid grid-cols-1 gap-3">
                                {submission.fileUrls.map((url, index) => {
                                    const fileName = decodeURIComponent(url.split('/').pop() || `File ${index + 1}`)
                                    // Simple extension check
                                    const ext = fileName.split('.').pop()?.toLowerCase() || ''

                                    return (
                                        <DownloadableFileItem key={index} url={formatImageUrl(url) || url}>
                                            {({ signedUrl, isLoading }) => (
                                                <a
                                                    href={isLoading ? undefined : (signedUrl || formatImageUrl(url) || url)}
                                                    target={isLoading ? undefined : "_blank"}
                                                    rel="noreferrer"
                                                    className={`group flex items-center gap-3 p-3 bg-white border rounded-xl transition-all ${isLoading ? 'opacity-70 cursor-wait' : 'hover:border-brand-magenta/50 hover:shadow-md'}`}
                                                    onClick={(e) => {
                                                        if (isLoading || (!signedUrl && !formatImageUrl(url))) {
                                                            e.preventDefault()
                                                        }
                                                    }}
                                                >
                                                    <div className="p-3 bg-brand-light/30 rounded-lg text-brand-magenta group-hover:bg-brand-magenta group-hover:text-white transition-colors">
                                                        {isLoading ? (
                                                            <Loader2 className="w-6 h-6 animate-spin" />
                                                        ) : (
                                                            <FileIcon className="w-6 h-6" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1 overflow-hidden">
                                                        <div className="truncate font-medium text-gray-900 group-hover:text-brand-magenta transition-colors">
                                                            {fileName}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground uppercase">{ext} File</div>
                                                    </div>
                                                    <div className="p-2 text-muted-foreground group-hover:text-brand-magenta transition-colors">
                                                        <Download className="w-4 h-4" />
                                                    </div>
                                                </a>
                                            )}
                                        </DownloadableFileItem>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {!submission.textContent && (!submission.fileUrls || submission.fileUrls.length === 0) && (
                        <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                            <FileText className="w-10 h-10 mb-2 opacity-20" />
                            <p>Không có nội dung bài nộp</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Column 2: AI Details */}
            <div className="flex-1 flex flex-col border rounded-2xl bg-white overflow-hidden min-h-[500px] lg:min-h-0">
                <div className="p-4 border-b bg-white flex justify-between items-center">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                        <span className="bg-linear-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">AI Đánh giá & Gợi ý</span>
                    </h3>
                    {submission.aiScore !== null && (
                        <span className="text-sm font-bold px-3 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-100">
                            {submission.aiScore} / {assignment.totalPoints}
                        </span>
                    )}
                </div>

                <div className="p-4 overflow-y-auto flex-1 space-y-6">
                    {(submission.aiScore !== null || submission.aiFeedback) ? (
                        <>
                            {submission.aiFeedback && (
                                <div className="space-y-4 text-sm">
                                    <AiFeedbackDisplay feedbackJson={submission.aiFeedback} />
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                            <p>Chưa có đánh giá từ AI</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Column 3: Grading Form */}
            <div className="flex-1 flex flex-col border rounded-2xl bg-white overflow-hidden min-h-[500px] lg:min-h-0">
                <div className="p-4 border-b">
                    <h3 className="font-semibold text-lg">Kết quả & Nhận xét</h3>
                </div>

                <div className="p-4 flex-1 flex flex-col gap-6 overflow-y-auto">
                    <div className="space-y-3">
                        <Label className="text-base">Điểm số (Thang điểm {assignment.totalPoints})</Label>
                        <div className="flex items-center gap-3">
                            <div className="relative w-full">
                                <Input
                                    type="number"
                                    min="0"
                                    max={assignment.totalPoints}
                                    value={score}
                                    onChange={(e) => setScore(e.target.value)}
                                    className="pr-12 text-lg font-semibold h-12 rounded-xl"
                                    placeholder="0"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                                    / {assignment.totalPoints}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3 flex flex-col">
                        <Label className="text-base">Nhận xét của giảng viên</Label>
                        <Textarea
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            placeholder="Nhập nhận xét chi tiết..."
                            className="min-h-[200px] resize-none p-3 text-base rounded-xl"
                        />
                    </div>
                </div>

                <div className="p-4 bg-slate-50 border-t flex flex-col gap-3">
                    {hasExceededSubmissions && (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    disabled={isResetting}
                                    className="w-full h-10 text-base rounded-xl border-orange-300 text-orange-600 hover:bg-orange-50 hover:text-orange-700"
                                >
                                    {isResetting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                                    {isResetting ? "Đang làm mới..." : "Làm mới lượt nộp"}
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Làm mới lượt nộp bài?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Học viên đã nộp {submission.submissionNumber}/{assignment.maxSubmissions} lần. Bạn có chắc muốn làm mới lượt nộp để học viên có thể nộp lại không?
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Hủy</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={() => resetSubmission(submission.studentId)}
                                        className="bg-orange-500 hover:bg-orange-600"
                                    >
                                        Xác nhận
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}
                    <Button
                        onClick={handleSubmit}
                        disabled={isPending || score === ""}
                        className="bg-brand-magenta hover:bg-brand-magenta/90 w-full h-10 text-base rounded-xl"
                    >
                        {isPending ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                        {isPending ? "Đang lưu..." : "Lưu kết quả"}
                    </Button>
                </div>
            </div>
        </div>
    )
}

// Helper component for icon
function FileText({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" x2="8" y1="13" y2="13" />
            <line x1="16" x2="8" y1="17" y2="17" />
            <line x1="10" x2="8" y1="9" y2="9" />
        </svg>
    )
}

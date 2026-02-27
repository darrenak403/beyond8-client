import { Assignment } from '@/lib/api/services/fetchAssignment'
import { Calendar, FileText, Clock, Paperclip, Target } from 'lucide-react'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import React from 'react'
import { Button } from '@/components/ui/button'
import DocumentViewDialog from '@/components/widget/document/DocumentViewDialog'
import { formatImageUrl } from '@/lib/utils/formatImageUrl'

interface AssignmentOverviewProps {
    assignment: Assignment
}

export default function AssignmentOverview({ assignment }: AssignmentOverviewProps) {
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

    const [viewDoc, setViewDoc] = React.useState<{ url: string, title: string } | null>(null)

    return (
        <>
            <div className="bg-white rounded-2xl border border-gray-200 p-8 space-y-6">
                {/* Assignment Title */}
                <div>
                    <h1 className="text-3xl font-bold text-foreground mb-3">
                        {assignment.title}
                    </h1>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>Tạo ngày {format(new Date(assignment.createdAt), "dd 'thg' MM, yyyy", { locale: vi })}</span>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 border border-gray-200">
                        <div className="p-2 rounded-lg bg-brand-magenta/10">
                            <Target className="w-5 h-5 text-brand-magenta" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Điểm số</p>
                            <p className="text-xl font-bold text-brand-magenta">{assignment.totalPoints}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 border border-gray-200">
                        <div className="p-2 rounded-lg bg-emerald-500/10">
                            <Target className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Điểm cần đạt</p>
                            <p className="text-xl font-bold text-emerald-600">{assignment.passScorePercent}%</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 border border-gray-200">
                        <div className="p-2 rounded-lg bg-brand-purple/10">
                            <Clock className="w-5 h-5 text-brand-purple" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Thời gian</p>
                            <p className="text-sm font-bold text-brand-purple">{formatTime(assignment.timeLimitMinutes)}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 border border-gray-200">
                        <div className="p-2 rounded-lg bg-amber-500/10">
                            <FileText className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Số lần nộp</p>
                            <p className="text-xl font-bold text-amber-600">{assignment.maxSubmissions}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 border border-gray-200">
                        <div className="p-2 rounded-lg bg-brand-pink/10">
                            <FileText className="w-5 h-5 text-brand-pink" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs text-muted-foreground">Loại bài</p>
                            <p className="text-sm font-bold text-brand-pink">
                                {assignment.submissionType === 'File' ? 'File' :
                                    assignment.submissionType === 'Text' ? 'Văn bản' : 'Cả văn bản và file'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Description/Info Section */}
                <div className="flex-1 p-6 rounded-xl bg-gray-50 border border-gray-200 space-y-4">
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-foreground">Mô tả bài tập</h3>
                            {assignment.rubricUrl && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setViewDoc({ url: assignment.rubricUrl!, title: `Rubric: ${assignment.title}` })}
                                    className="h-8 text-brand-purple border-brand-purple/20 hover:bg-brand-purple/10"
                                >
                                    <FileText className="w-3.5 h-3.5 mr-1.5" />
                                    Xem tiêu chí đánh giá
                                </Button>
                            )}
                        </div>
                        <div className="prose prose-sm max-w-none text-muted-foreground">
                            <div dangerouslySetInnerHTML={{ __html: assignment.description }} />
                        </div>
                    </div>

                    {assignment.attachmentUrls && assignment.attachmentUrls.length > 0 && (
                        <div className="pt-4 border-t border-gray-200">
                            <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-3">
                                <Paperclip className="w-4 h-4" />
                                Tài liệu đính kèm
                            </h4>
                            <div className="grid grid-cols-1 gap-2">
                                {assignment.attachmentUrls.map((attachment, index) => (
                                    <div
                                        key={index}
                                        onClick={() => setViewDoc({ url: attachment.url, title: attachment.name })}
                                        className="flex items-center gap-3 p-3 rounded-lg bg-white border border-gray-200 hover:border-brand-purple/30 hover:shadow-sm transition-all group cursor-pointer"
                                    >
                                        <div className="p-2 rounded-md bg-gray-50 text-gray-500 group-hover:bg-brand-purple/10 group-hover:text-brand-purple transition-colors">
                                            <FileText className="w-4 h-4" />
                                        </div>
                                        <span className="text-sm font-medium text-gray-700 group-hover:text-brand-purple truncate">
                                            {attachment.name}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <DocumentViewDialog
                open={!!viewDoc}
                onOpenChange={(open) => !open && setViewDoc(null)}
                url={formatImageUrl(viewDoc?.url) || ''}
                title={viewDoc?.title || ''}
                isDownloadable={true}
            />
        </>
    )
}

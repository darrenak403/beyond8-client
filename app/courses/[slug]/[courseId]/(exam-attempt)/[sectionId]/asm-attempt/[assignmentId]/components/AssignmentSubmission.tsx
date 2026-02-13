
import { useState } from 'react'
import { Assignment, SubmissionAssigment } from '@/lib/api/services/fetchAssignment'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Upload, FileText, CheckCircle2, X, Loader2, AlertCircle, Paperclip, Sparkles, UserCircle, Download } from 'lucide-react'
import { useMediaAssignment } from '@/hooks/useMedia'
import { toast } from 'sonner'
import { AiFeedbackDisplay } from '@/app/(instructor)/instructor/grading/components/AiFeedbackDisplay'
import { formatImageUrl } from '@/lib/utils/formatImageUrl'
import DownloadableFileItem from '@/components/widget/assignment/DownloadableFileItem'

interface AssignmentSubmissionProps {
    assignment: Assignment
    submission?: SubmissionAssigment
    onSubmit: (data: { textContent: string; fileUrls: string[] }) => void
    isSubmitting: boolean
}

interface AttachmentFile {
    id: string
    file: File
    status: 'pending' | 'uploading' | 'success' | 'error'
    url?: string
}

export default function AssignmentSubmission({
    assignment,
    submission,
    onSubmit,
    isSubmitting,
    isLoadingSubmission
}: AssignmentSubmissionProps & { isLoadingSubmission?: boolean }) {
    const [textContent, setTextContent] = useState('')
    const [files, setFiles] = useState<AttachmentFile[]>([])
    const [isResubmitting, setIsResubmitting] = useState(false)
    const { uploadSubmissionAssignment } = useMediaAssignment()

    const updateFileStatus = (id: string, status: AttachmentFile['status'], url?: string) => {
        setFiles(prev => prev.map(f => {
            if (f.id === id) {
                return { ...f, status, url }
            }
            return f
        }))
    }

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files)
            const validFiles: File[] = []

            // Validate file types
            if (assignment.allowedFileTypes && assignment.allowedFileTypes.length > 0) {
                selectedFiles.forEach(file => {
                    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
                    if (assignment.allowedFileTypes.some(type => type.toLowerCase() === fileExtension)) {
                        validFiles.push(file)
                    } else {
                        toast.error(`File ${file.name} không đúng định dạng cho phép (${assignment.allowedFileTypes.join(', ')})`)
                    }
                })
            } else {
                validFiles.push(...selectedFiles)
            }

            if (validFiles.length === 0) {
                e.target.value = ''
                return
            }

            const newFiles: AttachmentFile[] = validFiles.map(file => ({
                id: crypto.randomUUID(),
                file,
                status: 'pending'
            }))

            setFiles(prev => [...prev, ...newFiles])

            // Upload files immediately upon selection
            newFiles.forEach(attachment => {
                updateFileStatus(attachment.id, 'uploading')
                uploadSubmissionAssignment(attachment.file, {
                    onSuccess: (data) => {
                        updateFileStatus(attachment.id, 'success', data.fileUrl)
                    },
                    onError: () => {
                        updateFileStatus(attachment.id, 'error')
                        toast.error(`Không thể tải lên file ${attachment.file.name}`)
                    }
                })
            })
        }
        // Reset input value to allow selecting the same file again if needed
        e.target.value = ''
    }

    const removeFile = (id: string) => {
        setFiles(prev => prev.filter(f => f.id !== id))
    }

    // Robust check for submission type
    const type = assignment.submissionType?.toString().toLowerCase() || ''
    const showText = type === 'text' || type === 'both'
    const showFile = type === 'file' || type === 'both'

    const handleSubmit = () => {
        const uploadedUrls = files.filter(f => f.status === 'success' && f.url).map(f => f.url!)
        const isUploading = files.some(f => f.status === 'uploading' || f.status === 'pending')

        if (showText && !textContent && uploadedUrls.length === 0) {
            toast.error('Vui lòng nhập nội dung hoặc tải lên file')
            return
        }

        if (isUploading) {
            toast.error('Vui lòng đợi tất cả file tải lên hoàn tất')
            return
        }

        if (files.some(f => f.status === 'error')) {
            toast.error('Có file bị lỗi, vui lòng xóa hoặc thử lại')
            return
        }

        onSubmit({
            textContent,
            fileUrls: uploadedUrls
        })
    }

    if (isLoadingSubmission) {
        return (
            <div className="space-y-6">
                <div>
                    <div className="h-7 w-32 bg-gray-200 rounded animate-pulse mb-2" />
                    <div className="h-4 w-64 bg-gray-100 rounded animate-pulse" />
                </div>
                <div className="bg-white rounded-2xl border border-gray-200 h-[400px] flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-brand-purple animate-spin" />
                </div>
            </div>
        )
    }

    if (submission && !isResubmitting) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-1">Kết quả bài làm</h2>
                        <p className="text-sm text-muted-foreground">Chi tiết bài nộp và kết quả chấm điểm</p>
                    </div>
                    {submission.status !== 'Graded' && (
                        <Button
                            variant="outline"
                            onClick={() => setIsResubmitting(true)}
                            className="text-brand-purple border-brand-purple/20 hover:bg-brand-purple/10"
                        >
                            Nộp lại bài
                        </Button>
                    )}
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                    {/* Status Header */}
                    <div className="p-6 border-b border-gray-200 bg-gray-50/50 flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-500">Trạng thái</span>
                        <Badge variant={submission.status === 'Graded' ? "default" : "secondary"}
                            className={submission.status === 'Graded'
                                ? "bg-green-100 text-green-700 hover:bg-green-200 border-green-200 px-3 py-1"
                                : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border-yellow-200 px-3 py-1"}>
                            {submission.status === 'Graded' ? 'Đã chấm điểm' : 'Đã nộp bài'}
                        </Badge>
                    </div>

                    <div className={`p-6 grid grid-cols-1 ${submission.aiFeedback ? 'lg:grid-cols-2' : ''} gap-6`}>
                        {/* Left Column: Score, Instructor Feedback, Submitted Content */}
                        <div className="space-y-6">
                            {submission.status === 'Graded' && (
                                <>
                                    <div className="text-center py-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                                        <span className="text-sm font-medium text-gray-500 uppercase tracking-wider block mb-2">Điểm số</span>
                                        <div className="flex items-baseline justify-center gap-2">
                                            <span className="text-5xl font-bold text-brand-purple">{submission.finalScore}</span>
                                            <span className="text-xl text-gray-400 font-medium">/ {assignment.totalPoints}</span>
                                        </div>
                                    </div>

                                    {submission.instructorFeedback && (
                                        <div className="bg-white p-5 rounded-xl border border-brand-purple/10 shadow-sm">
                                            <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-3">
                                                <UserCircle className="w-4 h-4 text-brand-purple" />
                                                Nhận xét của giảng viên
                                            </h4>
                                            <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                                                {submission.instructorFeedback}
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}

                            {/* Submitted Content Section */}
                            <div className="space-y-6 pt-4 border-t border-gray-100">
                                <h3 className="text-lg font-semibold text-gray-900">Nội dung đã nộp</h3>
                                {(!submission.textContent && (!submission.fileUrls || submission.fileUrls.length === 0)) ? (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <FileText className="w-12 h-12 mx-auto text-gray-200 mb-3" />
                                        <p className="italic">Không tìm thấy nội dung bài nộp.</p>
                                        <p className="text-xs mt-1">Nếu bạn vừa nộp bài, vui lòng tải lại trang.</p>
                                    </div>
                                ) : (
                                    <>
                                        {submission.textContent && (
                                            <div className="space-y-2">
                                                <h4 className="text-sm font-medium text-gray-900 flex items-center gap-2">
                                                    <FileText className="w-4 h-4 text-gray-400" />
                                                    Nội dung văn bản
                                                </h4>
                                                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 text-gray-700 text-sm whitespace-pre-wrap leading-relaxed">
                                                    {submission.textContent}
                                                </div>
                                            </div>
                                        )}

                                        {submission.fileUrls && submission.fileUrls.length > 0 && (
                                            <div className="space-y-3">
                                                <h4 className="text-sm font-medium text-gray-900 flex items-center gap-2">
                                                    <Paperclip className="w-4 h-4 text-gray-400" />
                                                    File đính kèm
                                                </h4>
                                                <div className="grid grid-cols-1 gap-3">
                                                    {submission.fileUrls.map((url, index) => (
                                                        <DownloadableFileItem key={index} url={formatImageUrl(url) || url}>
                                                            {({ signedUrl, isLoading }) => (
                                                                <a
                                                                    href={isLoading ? '#' : (signedUrl || formatImageUrl(url) || url)}
                                                                    target={isLoading ? undefined : "_blank"}
                                                                    rel="noreferrer"
                                                                    onClick={(e) => {
                                                                        if (isLoading || (!signedUrl && !formatImageUrl(url))) {
                                                                            e.preventDefault();
                                                                            if (!isLoading) toast.error("Không thể mở file này.");
                                                                        }
                                                                    }}
                                                                    className={`flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 transition-all group ${isLoading ? 'opacity-70 cursor-wait' : 'hover:border-brand-purple/50 hover:shadow-sm cursor-pointer'}`}
                                                                >
                                                                    <div className="p-2 bg-gray-100 rounded-md text-gray-500 group-hover:bg-brand-purple/10 group-hover:text-brand-purple transition-colors">
                                                                        {isLoading ? (
                                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                                        ) : (
                                                                            <FileText className="w-4 h-4" />
                                                                        )}
                                                                    </div>
                                                                    <span className="flex-1 text-sm font-medium text-gray-700 group-hover:text-brand-purple truncate">
                                                                        File đính kèm {index + 1}
                                                                    </span>
                                                                    {!isLoading && (
                                                                        <div className="p-2 text-gray-400 group-hover:text-brand-purple group-hover:bg-brand-purple/10 rounded-full transition-colors">
                                                                            <Download className="w-4 h-4" />
                                                                        </div>
                                                                    )}
                                                                </a>
                                                            )}
                                                        </DownloadableFileItem>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Right Column: AI Feedback */}
                        {(submission.aiFeedback || submission.aiScore !== null) && (
                            <div className="space-y-6">
                                {/* {submission.aiScore !== null && (
                                    <div className="text-center py-4 bg-white rounded-xl border border-blue-100 shadow-sm">
                                        <span className="text-sm font-medium text-gray-500 uppercase tracking-wider block mb-2">Điểm AI chấm</span>
                                        <div className="flex items-baseline justify-center gap-2">
                                            <span className="text-5xl font-bold text-blue-600">{submission.aiScore}</span>
                                            <span className="text-xl text-gray-400 font-medium">/ {assignment.totalPoints}</span>
                                        </div>
                                    </div>
                                )} */}

                                {submission.aiFeedback && (
                                    <div className="bg-white p-5 rounded-xl border border-blue-100 shadow-sm">
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                                <Sparkles className="w-4 h-4 text-blue-500" />
                                                Đánh giá chi tiết từ AI
                                            </h4>
                                        </div>
                                        <div>
                                            <AiFeedbackDisplay feedbackJson={submission.aiFeedback} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-6 pt-4">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-1">
                            {isResubmitting ? '' : 'Nộp bài tập'}
                        </h2>
                        <p className="text-sm text-muted-foreground">Vui lòng hoàn thành bài tập và nộp trước thời hạn</p>
                    </div>
                    {isResubmitting && (
                        <Button variant="ghost" onClick={() => setIsResubmitting(false)}>
                            Hủy
                        </Button>
                    )}
                </div>
                <div className="p-6 space-y-6">
                    {showText && (
                        <div className="space-y-2">
                            <Label className="text-base font-semibold text-gray-900">Nội dung văn bản</Label>
                            <Textarea
                                placeholder="Nhập nội dung bài làm của bạn..."
                                className="min-h-[200px] resize-none focus:border-brand-purple/50 focus:ring-brand-purple/10 p-4 text-base rounded-xl"
                                value={textContent}
                                onChange={(e) => setTextContent(e.target.value)}
                            />
                        </div>
                    )}

                    {showFile && (
                        <div className="space-y-4">
                            <Label className="text-base font-semibold text-gray-900">Tài liệu đính kèm</Label>
                            <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 hover:bg-gray-50/50 hover:border-brand-purple/50 transition-all text-center group cursor-pointer relative bg-gray-50/30">
                                <input
                                    type="file"
                                    id="file-upload"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    multiple
                                    onChange={handleFileSelect}
                                />
                                <div className="flex flex-col items-center gap-3 pointer-events-none">
                                    <div className="p-4 bg-brand-purple/5 text-brand-purple rounded-full group-hover:bg-brand-purple/10 group-hover:scale-110 transition-all duration-300">
                                        <Upload className="w-5 h-5" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-base font-medium text-gray-900">
                                            <span className="text-brand-purple">Click để tải lên</span> hoặc kéo thả file
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Hỗ trợ: {assignment.allowedFileTypes?.join(', ')}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {files.length > 0 && (
                                <div className="grid grid-cols-1 gap-3">
                                    {files.map((file) => (
                                        <div key={file.id} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-lg shadow-sm hover:border-gray-200 transition-colors">
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <div className="p-2 bg-gray-100 rounded-md">
                                                    {file.status === 'uploading' ? (
                                                        <Loader2 className="w-4 h-4 text-brand-purple animate-spin" />
                                                    ) : file.status === 'error' ? (
                                                        <AlertCircle className="w-4 h-4 text-red-500" />
                                                    ) : (
                                                        <FileText className="w-4 h-4 text-brand-purple" />
                                                    )}
                                                </div>
                                                <div className="flex flex-col min-w-0">
                                                    <span className="text-sm font-medium text-gray-900 truncate">{file.file.name}</span>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs text-gray-500">{(file.file.size / 1024 / 1024).toFixed(2)} MB</span>
                                                        {file.status === 'error' && (
                                                            <span className="text-xs text-red-500">Lỗi tải lên</span>
                                                        )}
                                                        {file.status === 'success' && (
                                                            <span className="text-xs text-green-600 flex items-center gap-1">
                                                                <CheckCircle2 className="w-3 h-3" /> Đã tải lên
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => removeFile(file.id)}
                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <div className="p-6 bg-gray-50/50 border-t border-gray-100">
                    <div className="flex items-center justify-end gap-3">
                        <Button
                            className="min-w-[140px] bg-brand-purple hover:bg-brand-purple/90 h-11 text-base font-medium shadow-sm hover:shadow-md transition-all rounded-xl"
                            onClick={handleSubmit}
                            disabled={isSubmitting || files.some(f => f.status === 'uploading' || f.status === 'pending')}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Đang nộp...
                                </>
                            ) : (
                                'Nộp bài'
                            )}
                        </Button>
                    </div>
                </div>
            </div>

        </div>
    )
}

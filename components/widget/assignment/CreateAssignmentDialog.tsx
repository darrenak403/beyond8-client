"use client"

import { useState } from "react"
import { useCreateAssignment } from "@/hooks/useAssignment"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import {
    Loader2,
    Settings,
    FileText,
    Clock,
    Trophy,
    CheckCircle2,
    X,
    Upload
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SubmissionType, GradingMode, Attachment } from "@/lib/api/services/fetchAssignment"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useMediaAssignment, useMediaDocumentCourse } from "@/hooks/useMedia"
import { toast } from "sonner"
import { formatImageUrl } from "@/lib/utils/formatImageUrl"

interface CreateAssignmentDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    courseId: string
    sectionId: string
    sectionTitle: string
}

export function CreateAssignmentDialog({
    open,
    onOpenChange,
    courseId,
    sectionId,
    sectionTitle
}: CreateAssignmentDialogProps) {
    const { createAssignmentAsync, isPending } = useCreateAssignment(courseId)
    const { uploadRubricAssignment, isUploadingRubricAssignment } = useMediaAssignment()
    const { uploadDocumentCourse, isUploadingDocumentCourse } = useMediaDocumentCourse()

    // Form state
    const [title, setTitle] = useState(`Bài tập cho ${sectionTitle}`)
    const [description, setDescription] = useState("")
    const [attachmentUrls, setAttachmentUrls] = useState<Attachment[]>([])
    const [submissionType, setSubmissionType] = useState<SubmissionType>(SubmissionType.Text)
    const [gradingMode, setGradingMode] = useState<GradingMode>(GradingMode.AiAssisted)
    const [totalPoints, setTotalPoints] = useState(100)
    const [passScorePercent, setPassScorePercent] = useState(60)
    const [maxSubmissions, setMaxSubmissions] = useState(3)
    const [timeLimitMinutes, setTimeLimitMinutes] = useState<number | null>(null)
    const [maxTextLength, setMaxTextLength] = useState<number | null>(5000)
    const [allowedFileTypes, setAllowedFileTypes] = useState<string[]>([".pdf", ".doc", ".docx"])
    const [customFileType, setCustomFileType] = useState("")
    const [rubricUrl, setRubricUrl] = useState<string | null>(null)

    const commonFileTypes = [".pdf", ".doc", ".docx", ".txt", ".zip", ".jpg", ".png", ".xlsx", ".pptx"]

    const toggleFileType = (fileType: string) => {
        setAllowedFileTypes(prev =>
            prev.includes(fileType)
                ? prev.filter(t => t !== fileType)
                : [...prev, fileType]
        )
    }

    const addCustomFileType = () => {
        if (customFileType && !allowedFileTypes.includes(customFileType)) {
            const formatted = customFileType.startsWith('.') ? customFileType : `.${customFileType}`
            setAllowedFileTypes(prev => [...prev, formatted])
            setCustomFileType("")
        }
    }

    const handleRubricUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            uploadRubricAssignment(file, {
                onSuccess: (data) => {
                    setRubricUrl(data.fileUrl)
                    //toast.success("Tải lên Rubric thành công!")
                },
                onError: () => {
                    toast.error("Tải lên Rubric thất bại!")
                }
            })
        }
        e.target.value = ''
    }

    const handleAttachmentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            uploadDocumentCourse(file, {
                onSuccess: (data) => {
                    setAttachmentUrls(prev => [...prev, {
                        name: data.originalFileName,
                        url: data.fileUrl
                    }])
                    // toast.success("Tải lên tài liệu đính kèm thành công!") // Already handled in hook
                },
                onError: () => {
                    // toast.error("Tải lên tài liệu đính kèm thất bại!") // Already handled in hook
                }
            })
        }
        e.target.value = ''
    }

    const removeAttachment = (indexToRemove: number) => {
        setAttachmentUrls(prev => prev.filter((_, index) => index !== indexToRemove))
    }

    const handleSubmit = async () => {
        if (!rubricUrl) {
            toast.error("Vui lòng tải lên tài liệu chấm điểm!")
            return
        }

        try {
            const response = await createAssignmentAsync({
                courseId,
                sectionId,
                title,
                description,
                attachmentUrls,
                submissionType,
                allowedFileTypes: (submissionType === SubmissionType.File || submissionType === SubmissionType.Both) ? allowedFileTypes : [],
                maxTextLength: submissionType === SubmissionType.File ? 1 : maxTextLength,
                gradingMode,
                totalPoints,
                passScorePercent,
                maxSubmissions,
                rubricUrl,
                timeLimitMinutes
            })

            if (response?.data?.id) {
                onOpenChange(false)
                // Reset form
                setTitle(`Bài tập cho ${sectionTitle}`)
                setDescription("")
                setSubmissionType(SubmissionType.Text)
                setGradingMode(GradingMode.AiAssisted)
                setTotalPoints(100)
                setPassScorePercent(60)
                setMaxSubmissions(3)
                setTimeLimitMinutes(null)
                setMaxTextLength(5000)
                setAllowedFileTypes([".pdf", ".doc", ".docx"])
                setCustomFileType("")
                setRubricUrl(null)
                setAttachmentUrls([])
            }
        } catch (error) {
            console.error("Failed to create assignment", error)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl h-[85vh] flex flex-col p-0 gap-0 overflow-hidden">
                <DialogHeader className="px-6 py-4 border-b bg-gray-50/50 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl flex items-center justify-center shadow-sm bg-blue-600 text-white">
                            <Settings className="w-5 h-5" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-bold text-gray-900">
                                Tạo bài tập mới
                            </DialogTitle>
                            <DialogDescription className="text-gray-500 text-sm mt-0.5">
                                Thiết lập thông tin và yêu cầu cho bài tập
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto bg-gray-50/30 p-6">
                    <div className="grid grid-cols-1 gap-6">
                        {/* Column 1: Basic Information */}
                        <div className="space-y-6">
                            <Card className="border-blue-100/50 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
                                <CardHeader className="pb-3 border-b border-blue-100/50 bg-linear-to-r from-blue-50/50 to-cyan-50/50">
                                    <CardTitle className="text-sm font-semibold flex items-center gap-2 text-gray-800">
                                        <div className="h-8 w-8 rounded-lg bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                                            <FileText className="w-4 h-4 text-white" />
                                        </div>
                                        Thông tin cơ bản
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-5 space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="title" className="text-sm font-semibold text-gray-900">
                                            Tên bài tập <span className="text-red-500">*</span>
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="title"
                                                value={title}
                                                onChange={(e) => setTitle(e.target.value)}
                                                maxLength={100}
                                                placeholder="Nhập tên bài tập..."
                                                className="h-11 pr-16 text-md bg-white shadow-sm border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                            />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium pointer-events-none">
                                                {title.length}/100
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="description" className="text-sm font-semibold text-gray-900">
                                            Mô tả / Hướng dẫn <span className="text-red-500">*</span>
                                        </Label>
                                        <div className="relative">
                                            <Textarea
                                                id="description"
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                                maxLength={500}
                                                placeholder="Nhập hướng dẫn làm bài cho học viên..."
                                                className="resize-none bg-white shadow-sm border-gray-200 focus:border-blue-500 focus:ring-blue-500 min-h-[100px] pb-8"
                                            />
                                            <span className="absolute right-3 bottom-3 text-xs text-gray-400 font-medium pointer-events-none">
                                                {description.length}/500
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-gray-700">
                                            Tài liệu đính kèm
                                        </Label>
                                        <div className="space-y-3">
                                            {attachmentUrls.length > 0 && (
                                                <div className="space-y-2">
                                                    {attachmentUrls.map((attachment, index) => (
                                                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 border rounded-lg group hover:bg-gray-100 transition-colors">
                                                            <div className="flex items-center gap-2 overflow-hidden">
                                                                <FileText className="w-4 h-4 text-gray-500 shrink-0" />
                                                                <a
                                                                    href={formatImageUrl(attachment.url)}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-sm text-gray-700 truncate hover:text-blue-600 hover:underline"
                                                                >
                                                                    {attachment.name}
                                                                </a>
                                                            </div>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-6 w-6 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                                onClick={() => removeAttachment(index)}
                                                            >
                                                                <X className="w-3 h-3" />
                                                            </Button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            <div className="relative">
                                                <input
                                                    type="file"
                                                    id="attachment-upload"
                                                    className="hidden"
                                                    onChange={handleAttachmentUpload}
                                                    disabled={isUploadingDocumentCourse}
                                                />
                                                <Label
                                                    htmlFor="attachment-upload"
                                                    className={`flex items-center justify-center gap-2 w-full p-3 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 hover:border-blue-400 transition-all ${isUploadingDocumentCourse ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                >
                                                    {isUploadingDocumentCourse ? (
                                                        <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                                                    ) : (
                                                        <Upload className="w-4 h-4 text-gray-400" />
                                                    )}
                                                    <span className="text-sm text-gray-600">
                                                        {isUploadingDocumentCourse ? "Đang tải lên..." : "Thêm tài liệu đính kèm"}
                                                    </span>
                                                </Label>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Column 2: Settings */}
                        <div className="space-y-6">
                            <Card className="border-cyan-100/50 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
                                <CardHeader className="pb-3 border-b border-cyan-100/50 bg-linear-to-r from-cyan-50/50 to-blue-50/50">
                                    <CardTitle className="text-sm font-semibold flex items-center gap-2 text-gray-800">
                                        <div className="h-8 w-8 rounded-lg bg-linear-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                                            <Settings className="w-4 h-4 text-white" />
                                        </div>
                                        Thiết lập & Tùy chọn
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-5 space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-gray-700">
                                            Loại nộp bài <span className="text-red-500">*</span>
                                        </Label>
                                        <Select
                                            value={submissionType}
                                            onValueChange={(value) => setSubmissionType(value as SubmissionType)}
                                        >
                                            <SelectTrigger className="h-10 bg-white">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value={SubmissionType.Text}>Văn bản</SelectItem>
                                                <SelectItem value={SubmissionType.File}>Tệp tin (File)</SelectItem>
                                                <SelectItem value={SubmissionType.Both}>Cả hai </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {(submissionType === SubmissionType.Text || submissionType === SubmissionType.Both) && (
                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium text-gray-700">
                                                Độ dài văn bản tối đa (ký tự)
                                            </Label>
                                            <Input
                                                type="number"
                                                min={100}
                                                value={maxTextLength || ""}
                                                onChange={(e) => setMaxTextLength(e.target.value ? Number(e.target.value) : null)}
                                                placeholder="Để trống nếu không giới hạn"
                                                className="h-10 bg-white"
                                            />
                                        </div>
                                    )}

                                    {(submissionType === SubmissionType.File || submissionType === SubmissionType.Both) && (
                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium text-gray-700">
                                                Loại file cho phép <span className="text-red-500">*</span>
                                            </Label>
                                            <div className="flex flex-wrap gap-2 mb-2">
                                                {commonFileTypes.map(fileType => (
                                                    <Badge
                                                        key={fileType}
                                                        variant={allowedFileTypes.includes(fileType) ? "default" : "outline"}
                                                        className={`cursor-pointer transition-all duration-200 ${allowedFileTypes.includes(fileType)
                                                            ? "bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-md hover:shadow-lg transform hover:scale-105"
                                                            : "hover:bg-blue-50 hover:border-blue-300"
                                                            }`}
                                                        onClick={() => toggleFileType(fileType)}
                                                    >
                                                        {fileType}
                                                    </Badge>
                                                ))}
                                                {allowedFileTypes.filter(ft => !commonFileTypes.includes(ft)).map(fileType => (
                                                    <Badge
                                                        key={fileType}
                                                        variant="default"
                                                        className="cursor-pointer gap-1 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                                                    >
                                                        {fileType}
                                                        <X
                                                            className="h-3 w-3 hover:text-red-200"
                                                            onClick={() => toggleFileType(fileType)}
                                                        />
                                                    </Badge>
                                                ))}
                                            </div>
                                            <div className="flex gap-2">
                                                <Input
                                                    value={customFileType}
                                                    onChange={(e) => setCustomFileType(e.target.value)}
                                                    placeholder="Thêm loại file khác (vd: .rar)"    
                                                    className="h-9 bg-white text-sm"
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            e.preventDefault()
                                                            addCustomFileType()
                                                        }
                                                    }}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={addCustomFileType}
                                                    className="h-9"
                                                >
                                                    Thêm
                                                </Button>
                                            </div>
                                        </div>
                                    )}

                                    <Separator />

                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-gray-700">
                                            Phương thức chấm điểm
                                        </Label>
                                        <div className="flex items-center h-10 px-3 border rounded-md bg-gray-50 text-sm text-gray-500">
                                            AI hỗ trợ
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-xs font-semibold text-gray-500 uppercase">Tổng điểm</Label>
                                            <div className="relative">
                                                <Input
                                                    type="number"
                                                    min={1}
                                                    value={totalPoints}
                                                    onChange={(e) => setTotalPoints(Number(e.target.value))}
                                                    className="pl-9 h-10 bg-white"
                                                />
                                                <Trophy className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                                                <span className="absolute right-3 top-3 text-xs text-gray-400 font-medium">điểm</span>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-xs font-semibold text-gray-500 uppercase">Số lần nộp tối đa</Label>
                                            <div className="relative">
                                                <Input
                                                    type="number"
                                                    min={1}
                                                    value={maxSubmissions}
                                                    onChange={(e) => setMaxSubmissions(Number(e.target.value))}
                                                    className="pl-9 h-10 bg-white"
                                                />
                                                <FileText className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                                                <span className="absolute right-3 top-3 text-xs text-gray-400 font-medium">lần</span>
                                            </div>
                                            <p className="text-[10px] text-gray-500">Số lần học viên được phép nộp bài</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-xs font-semibold text-gray-500 uppercase">Điểm đạt (%)</Label>
                                            <div className="relative">
                                                <Input
                                                    type="number"
                                                    min={0}
                                                    max={100}
                                                    value={passScorePercent}
                                                    onChange={(e) => setPassScorePercent(Number(e.target.value))}
                                                    className="pl-9 h-10 bg-white"
                                                />
                                                <CheckCircle2 className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                                                <span className="absolute right-3 top-3 text-xs text-gray-400 font-medium">%</span>
                                            </div>
                                            <p className="text-[10px] text-gray-500">Phần trăm điểm tối thiểu để đạt</p>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-xs font-semibold text-gray-500 uppercase">Thời gian làm bài</Label>
                                            <div className="flex items-center gap-2 h-10 px-3 border rounded-md bg-gray-50 text-sm text-gray-500">
                                                <Clock className="w-4 h-4 text-gray-400" />
                                                Không giới hạn
                                            </div>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-gray-700">
                                            Tiêu chí đánh giá <span className="text-red-500">*</span>
                                        </Label>
                                        <div className="flex items-center gap-2">
                                            {rubricUrl ? (
                                                <div className="flex items-center justify-between p-2 bg-blue-50 border border-blue-100 rounded-lg w-full group hover:bg-blue-100 transition-colors">
                                                    <div className="flex items-center gap-2 overflow-hidden">
                                                        <FileText className="w-4 h-4 text-blue-500 shrink-0" />
                                                        <a
                                                            href={formatImageUrl(rubricUrl)}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-sm text-gray-700 truncate hover:text-blue-600 hover:underline"
                                                        >
                                                            {rubricUrl.split('/').pop()}
                                                        </a>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-6 w-6 text-gray-400 hover:text-red-500 shrink-0"
                                                        onClick={() => setRubricUrl(null)}
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div className="flex-1">
                                                    <input
                                                        type="file"
                                                        id="rubric-upload"
                                                        className="hidden"
                                                        accept=".pdf,.doc,.docx,.xlsx,.xls"
                                                        onChange={handleRubricUpload}
                                                        disabled={isUploadingRubricAssignment}
                                                    />
                                                    <Label
                                                        htmlFor="rubric-upload"
                                                        className="flex items-center justify-center gap-2 w-full p-2 border-2 border-dashed border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                                                    >
                                                        {isUploadingRubricAssignment ? (
                                                            <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                                                        ) : (
                                                            <Upload className="w-4 h-4 text-gray-400" />
                                                        )}
                                                        <span className="text-sm text-gray-600">
                                                            {isUploadingRubricAssignment ? "Đang tải lên..." : "Tải lên tài liệu chấm điểm"}
                                                        </span>
                                                    </Label>
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-[10px] text-gray-500">Hỗ trợ: PDF, DOC, DOCX, EXCEL</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>

                <DialogFooter className="px-6 py-4 border-t border-blue-100/50 bg-linear-to-r from-white via-blue-50/30 to-cyan-50/30 shrink-0 shadow-[0_-8px_30px_rgba(59,130,246,0.12)]">
                    <Button variant="ghost" onClick={() => onOpenChange(false)} className="rounded-xl text-gray-600 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200">
                        Hủy bỏ
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={!title || !rubricUrl || isPending}
                        className="rounded-xl bg-linear-to-r from-blue-600 via-blue-500 to-cyan-600 hover:from-blue-700 hover:via-blue-600 hover:to-cyan-700 text-white shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 px-6 transition-all duration-200 transform hover:scale-105"
                    >
                        {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
                        Tạo bài tập
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

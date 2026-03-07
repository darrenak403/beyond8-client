"use client"

import { useState, useEffect } from "react"
import { useUpdateAssignment } from "@/hooks/useAssignment"
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
    Edit,
    Eye,
    Upload
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Assignment, SubmissionType, GradingMode } from "@/lib/api/services/fetchAssignment"
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

interface AssignmentDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    assignment: Assignment | null
    sectionId: string
    readOnly?: boolean
}

export function AssignmentDialog({
    open,
    onOpenChange,
    assignment,
    readOnly = false
}: AssignmentDialogProps) {
    const { updateAssignment, isPending } = useUpdateAssignment()
    const [isEditMode, setIsEditMode] = useState(false)

    // Form state - initialize from assignment or default values
    const [formData, setFormData] = useState<Assignment>(() => {
        if (assignment) {
            return {
                ...assignment,
                attachmentUrls: assignment.attachmentUrls || [],
                allowedFileTypes: assignment.allowedFileTypes || []
            }
        }
        return {
            id: "",
            instructorId: "",
            courseId: null,
            sectionId: null,
            title: "",
            description: "",
            attachmentUrls: [],
            submissionType: SubmissionType.Text,
            allowedFileTypes: [],
            maxTextLength: null,
            gradingMode: GradingMode.AiAssisted,
            totalPoints: 10,
            passScorePercent: 60,
            maxSubmissions: 3,
            rubricUrl: null,
            timeLimitMinutes: null,
            totalSubmissions: 0,
            averageScore: null,
            createdAt: "",
            updatedAt: ""
        }
    })

    const [customFileType, setCustomFileType] = useState("")

    const commonFileTypes = [".pdf", ".doc", ".docx", ".txt", ".zip", ".jpg", ".png", ".xlsx", ".pptx"]

    const toggleFileType = (fileType: string) => {
        setFormData(prev => {
            const currentTypes = prev.allowedFileTypes || []
            return {
                ...prev,
                allowedFileTypes: currentTypes.includes(fileType)
                    ? currentTypes.filter(t => t !== fileType)
                    : [...currentTypes, fileType]
            }
        })
    }

    const addCustomFileType = () => {
        if (customFileType && !formData.allowedFileTypes.includes(customFileType)) {
            const formatted = customFileType.startsWith('.') ? customFileType : `.${customFileType}`
            setFormData(prev => ({
                ...prev,
                allowedFileTypes: [...(prev.allowedFileTypes || []), formatted]
            }))
            setCustomFileType("")
        }
    }



    const { uploadRubricAssignment, isUploadingRubricAssignment } = useMediaAssignment()
    const { uploadDocumentCourse, isUploadingDocumentCourse } = useMediaDocumentCourse()

    const handleRubricUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            uploadRubricAssignment(file, {
                onSuccess: (data) => {
                    setFormData(prev => ({
                        ...prev,
                        rubricUrl: data.fileUrl
                    }))
                    toast.success("Tải lên tài liệu chấm điểm thành công!")
                },
                onError: () => {
                    toast.error("Tải lên tài liệu chấm điểm thất bại!")
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
                    setFormData(prev => ({
                        ...prev,
                        attachmentUrls: [...(prev.attachmentUrls || []), {
                            name: data.originalFileName,
                            url: data.fileUrl
                        }]
                    }))
                    toast.success("Tải lên tài liệu đính kèm thành công!")
                },
                onError: () => {
                    toast.error("Tải lên tài liệu đính kèm thất bại!")
                }
            })
        }
        e.target.value = ''
    }

    const removeAttachment = (indexToRemove: number) => {
        setFormData(prev => ({
            ...prev,
            attachmentUrls: (prev.attachmentUrls || []).filter((_, index) => index !== indexToRemove)
        }))
    }

    // Reset form when assignment changes (e.g., when opening a different assignment)
    useEffect(() => {
        if (assignment && assignment.id !== formData.id) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setFormData({
                ...assignment,
                attachmentUrls: assignment.attachmentUrls || [],
                allowedFileTypes: assignment.allowedFileTypes || []
            })
        }
    }, [assignment, formData.id])

    const handleSubmit = async () => {
        if (!assignment) return

        if (!formData.rubricUrl) {
            toast.error("Vui lòng tải lên tài liệu chấm điểm!")
            return
        }

        await updateAssignment({
            id: assignment.id,
            data: {
                courseId: formData.courseId,
                sectionId: formData.sectionId,
                title: formData.title,
                description: formData.description,
                submissionType: formData.submissionType,
                allowedFileTypes: formData.allowedFileTypes,
                gradingMode: formData.gradingMode,
                totalPoints: formData.totalPoints,
                passScorePercent: formData.passScorePercent,
                maxSubmissions: formData.maxSubmissions,
                timeLimitMinutes: formData.timeLimitMinutes,
                attachmentUrls: formData.attachmentUrls,
                maxTextLength: formData.maxTextLength,
                rubricUrl: formData.rubricUrl,
            }
        })
        setIsEditMode(false)
    }



    if (!assignment) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl h-[85vh] flex flex-col p-0 gap-0 overflow-hidden">
                <DialogHeader className="px-6 py-4 border-b bg-gray-50/50 shrink-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl flex items-center justify-center shadow-sm bg-purple-600 text-white">
                                {isEditMode ? <Edit className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </div>
                            <div>
                                <DialogTitle className="text-xl font-bold text-gray-900">
                                    {isEditMode ? "Chỉnh sửa bài tập" : "Chi tiết bài tập"}
                                </DialogTitle>
                                <DialogDescription className="text-gray-500 text-sm mt-0.5">
                                    {isEditMode ? "Cập nhật thông tin và yêu cầu cho bài tập" : "Xem thông tin chi tiết bài tập"}
                                </DialogDescription>
                            </div>
                        </div>
                        {!isEditMode && !readOnly && (
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setIsEditMode(true)}
                                    className="gap-2 rounded-full mr-4 hover:bg-gray-100 hover:text-gray-900"
                                >
                                    <Edit className="w-4 h-4" />
                                    Sửa
                                </Button>
                            </div>
                        )}
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto bg-linear-to-br from-gray-50 via-purple-50/30 to-indigo-50/30 p-6">
                    <div className="grid grid-cols-1 gap-6">
                        {/* Column 1: Basic Information */}
                        <div className="space-y-6">
                            <Card className="border-purple-100/50 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
                                <CardHeader className="pb-3 border-b border-purple-100/50 bg-linear-to-r from-purple-50/50 to-indigo-50/50">
                                    <CardTitle className="text-sm font-semibold flex items-center gap-2 text-gray-800">
                                        <div className="h-8 w-8 rounded-lg bg-linear-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
                                            <FileText className="w-4 h-4 text-white" />
                                        </div>
                                        Thông tin cơ bản
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-5 space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="title" className="text-base font-semibold text-gray-900">
                                            Tên bài tập <span className="text-red-500">*</span>
                                        </Label>
                                        {isEditMode ? (
                                            <div className="relative">
                                                <Input
                                                    id="title"
                                                    value={formData.title}
                                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                    maxLength={100}
                                                    placeholder="Nhập tên bài tập..."
                                                    className="h-11 pr-16 text-md bg-white shadow-sm border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                                />
                                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium pointer-events-none">
                                                    {formData.title.length}/100
                                                </span>
                                            </div>
                                        ) : (
                                            <p className="text-gray-900 font-medium">{assignment.title}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                                            Mô tả / Hướng dẫn
                                        </Label>
                                        {isEditMode ? (
                                            <div className="relative">
                                                <Textarea
                                                    id="description"
                                                    value={formData.description}
                                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                    maxLength={500}
                                                    placeholder="Nhập hướng dẫn làm bài cho học viên..."
                                                    className="resize-none bg-white shadow-sm border-gray-200 focus:border-blue-500 focus:ring-blue-500 min-h-[200px] pb-8"
                                                />
                                                <span className="absolute right-3 bottom-3 text-xs text-gray-400 font-medium pointer-events-none">
                                                    {formData.description.length}/500
                                                </span>
                                            </div>
                                        ) : (
                                            <p className="text-gray-600 text-sm whitespace-pre-wrap">{assignment.description || "Chưa có mô tả"}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-gray-700">
                                            Tài liệu đính kèm
                                        </Label>
                                        <div className="space-y-3">
                                            {formData.attachmentUrls && formData.attachmentUrls.length > 0 && (
                                                <div className="space-y-2">
                                                    {formData.attachmentUrls?.map((attachment, index) => (
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
                                                            {isEditMode && (
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-6 w-6 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                                    onClick={() => removeAttachment(index)}
                                                                >
                                                                    <X className="w-3 h-3" />
                                                                </Button>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {isEditMode ? (
                                                <div className="relative">
                                                    <input
                                                        type="file"
                                                        id="attachment-upload-edit"
                                                        className="hidden"
                                                        onChange={handleAttachmentUpload}
                                                        disabled={isUploadingDocumentCourse}
                                                    />
                                                    <Label
                                                        htmlFor="attachment-upload-edit"
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
                                            ) : (
                                                (!formData.attachmentUrls || formData.attachmentUrls.length === 0) && (
                                                    <p className="text-gray-500 text-sm italic">Không có tài liệu đính kèm</p>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Column 2: Settings */}
                        <div className="space-y-6">
                            <Card className="border-indigo-100/50 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
                                <CardHeader className="pb-3 border-b border-indigo-100/50 bg-linear-to-r from-indigo-50/50 to-purple-50/50">
                                    <CardTitle className="text-sm font-semibold flex items-center gap-2 text-gray-800">
                                        <div className="h-8 w-8 rounded-lg bg-linear-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
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
                                        {isEditMode ? (
                                            <Select
                                                value={formData.submissionType as string}
                                                onValueChange={(value) => setFormData({ ...formData, submissionType: value as SubmissionType })}
                                            >
                                                <SelectTrigger className="h-10 bg-white">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value={SubmissionType.Text}>Văn bản (Text)</SelectItem>
                                                    <SelectItem value={SubmissionType.File}>Tệp tin (File)</SelectItem>
                                                    <SelectItem value={SubmissionType.Both}>Cả hai (Both)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        ) : (
                                            <Badge variant="secondary" className="bg-linear-to-r from-purple-100 to-indigo-100 text-purple-700 border-purple-200/50">
                                                {assignment.submissionType === SubmissionType.Text && "Văn bản (Text)"}
                                                {assignment.submissionType === SubmissionType.File && "Tệp tin (File)"}
                                                {assignment.submissionType === SubmissionType.Both && "Cả hai (Both)"}
                                            </Badge>
                                        )}
                                    </div>

                                    {(isEditMode ? (formData.submissionType === SubmissionType.Text || formData.submissionType === SubmissionType.Both) : (assignment.submissionType === SubmissionType.Text || assignment.submissionType === SubmissionType.Both)) && (
                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium text-gray-700">
                                                Độ dài văn bản tối đa (ký tự)
                                            </Label>
                                            {isEditMode ? (
                                                <Input
                                                    type="number"
                                                    min={100}
                                                    value={formData.maxTextLength || ""}
                                                    onChange={(e) => setFormData({ ...formData, maxTextLength: e.target.value ? Number(e.target.value) : null })}
                                                    placeholder="Để trống nếu không giới hạn"
                                                    className="h-10 bg-white"
                                                />
                                            ) : (
                                                <p className="text-gray-600">{assignment.maxTextLength ? `${assignment.maxTextLength} ký tự` : "Không giới hạn"}</p>
                                            )}
                                        </div>
                                    )}

                                    {(isEditMode ? (formData.submissionType === SubmissionType.File || formData.submissionType === SubmissionType.Both) : (assignment.submissionType === SubmissionType.File || assignment.submissionType === SubmissionType.Both)) && (
                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium text-gray-700">
                                                Loại file cho phép <span className="text-red-500">*</span>
                                            </Label>
                                            {isEditMode ? (
                                                <>
                                                    <div className="flex flex-wrap gap-2 mb-2">
                                                        {commonFileTypes.map(fileType => (
                                                            <Badge
                                                                key={fileType}
                                                                variant={formData.allowedFileTypes.includes(fileType) ? "default" : "outline"}
                                                                className={`cursor-pointer transition-all duration-200 ${formData.allowedFileTypes.includes(fileType)
                                                                    ? "bg-linear-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 shadow-md hover:shadow-lg transform hover:scale-105"
                                                                    : "hover:bg-purple-50 hover:border-purple-300"
                                                                    }`}
                                                                onClick={() => toggleFileType(fileType)}
                                                            >
                                                                {fileType}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                    {(formData.allowedFileTypes?.length ?? 0) > 0 && (
                                                        <div className="flex flex-wrap gap-2 p-2 bg-gray-50 rounded-md border">
                                                            <span className="text-xs text-gray-500">Đã chọn:</span>
                                                            {formData.allowedFileTypes?.map(fileType => (
                                                                <Badge key={fileType} variant="secondary" className="gap-1">
                                                                    {fileType}
                                                                    <X
                                                                        className="h-3 w-3 cursor-pointer hover:text-red-500"
                                                                        onClick={() => toggleFileType(fileType)}
                                                                    />
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    )}
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
                                                </>
                                            ) : (
                                                <div className="flex flex-wrap gap-2">
                                                    {assignment.allowedFileTypes?.map((fileType: string) => (
                                                        <Badge key={fileType} variant="secondary">{fileType}</Badge>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <Separator />

                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-gray-700">
                                            Phương thức chấm điểm <span className="text-red-500">*</span>
                                        </Label>
                                        <Badge variant="secondary" className="bg-linear-to-r from-emerald-100 to-teal-100 text-emerald-700 border-emerald-200/50">AI hỗ trợ</Badge>
                                    </div>

                                    <Separator />

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-xs font-semibold text-gray-500 uppercase">Tổng điểm</Label>
                                            {isEditMode ? (
                                                <div className="relative">
                                                    <Input
                                                        type="number"
                                                        min={1}
                                                        value={formData.totalPoints}
                                                        onChange={(e) => setFormData({ ...formData, totalPoints: Number(e.target.value) })}
                                                        className="pl-9 h-10 bg-white"
                                                    />
                                                    <Trophy className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                                                    <span className="absolute right-3 top-3 text-xs text-gray-400 font-medium">điểm</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <Trophy className="w-4 h-4 text-gray-400" />
                                                    <span className="text-gray-900 font-medium">{assignment.totalPoints} điểm</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-xs font-semibold text-gray-500 uppercase">Số lần nộp tối đa</Label>
                                            {isEditMode ? (
                                                <div className="relative">
                                                    <Input
                                                        type="number"
                                                        min={1}
                                                        value={formData.maxSubmissions}
                                                        onChange={(e) => setFormData({ ...formData, maxSubmissions: Number(e.target.value) })}
                                                        className="pl-9 h-10 bg-white"
                                                    />
                                                    <FileText className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                                                    <span className="absolute right-3 top-3 text-xs text-gray-400 font-medium">lần</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <FileText className="w-4 h-4 text-gray-400" />
                                                    <span className="text-gray-900 font-medium">{assignment.maxSubmissions} lần</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-xs font-semibold text-gray-500 uppercase">Điểm đạt (%)</Label>
                                            {isEditMode ? (
                                                <div className="relative">
                                                    <Input
                                                        type="number"
                                                        min={0}
                                                        max={100}
                                                        value={formData.passScorePercent}
                                                        onChange={(e) => setFormData({ ...formData, passScorePercent: Number(e.target.value) })}
                                                        className="pl-9 h-10 bg-white"
                                                    />
                                                    <CheckCircle2 className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                                                    <span className="absolute right-3 top-3 text-xs text-gray-400 font-medium">%</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <CheckCircle2 className="w-4 h-4 text-gray-400" />
                                                    <span className="text-gray-900 font-medium">{assignment.passScorePercent}%</span>
                                                </div>
                                            )}
                                            <p className="text-[10px] text-gray-500">Phần trăm điểm tối thiểu để đạt</p>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-xs font-semibold text-gray-500 uppercase">Thời gian làm bài</Label>
                                            {isEditMode ? (
                                                <div className="relative">
                                                    <Input
                                                        type="number"
                                                        min={1}
                                                        value={formData.timeLimitMinutes || ""}
                                                        onChange={(e) => setFormData({ ...formData, timeLimitMinutes: e.target.value ? Number(e.target.value) : null })}
                                                        placeholder="Để trống nếu không giới hạn"
                                                        className="pl-9 h-10 bg-white"
                                                    />
                                                    <Clock className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                                                    <span className="absolute right-3 top-3 text-xs text-gray-400 font-medium">phút</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-4 h-4 text-gray-400" />
                                                    <span className="text-gray-900 font-medium">
                                                        {assignment.timeLimitMinutes ? `${assignment.timeLimitMinutes} phút` : "Không giới hạn"}
                                                    </span>
                                                </div>
                                            )}
                                            <p className="text-[10px] text-gray-500">Để trống nếu không giới hạn thời gian</p>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-gray-700">
                                            Tiêu chí đánh giá <span className="text-red-500">*</span>
                                        </Label>
                                        {isEditMode ? (
                                            <div className="flex items-center gap-2">
                                                {formData.rubricUrl ? (
                                                    <div className="flex items-center justify-between p-2 bg-blue-50 border border-blue-100 rounded-lg w-full group hover:bg-blue-100 transition-colors">
                                                        <div className="flex items-center gap-2 overflow-hidden">
                                                            <FileText className="w-4 h-4 text-blue-500 shrink-0" />
                                                            <a
                                                                href={formatImageUrl(formData.rubricUrl)}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-sm text-gray-700 truncate hover:text-blue-600 hover:underline"
                                                            >
                                                                {formData.rubricUrl.split('/').pop()}
                                                            </a>
                                                        </div>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-6 w-6 text-gray-400 hover:text-red-500 shrink-0"
                                                            onClick={() => setFormData({ ...formData, rubricUrl: null })}
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <div className="flex-1">
                                                        <input
                                                            type="file"
                                                            id="rubric-upload-edit"
                                                            className="hidden"
                                                            accept=".pdf,.doc,.docx,.xlsx,.xls"
                                                            onChange={handleRubricUpload}
                                                            disabled={isUploadingRubricAssignment}
                                                        />
                                                        <Label
                                                            htmlFor="rubric-upload-edit"
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
                                        ) : (
                                            assignment.rubricUrl ? (
                                                <div className="flex items-center gap-2 p-2 bg-blue-50 border border-blue-100 rounded-lg group hover:bg-blue-100 transition-colors">
                                                    <FileText className="w-4 h-4 text-blue-500 shrink-0" />
                                                    <a
                                                        href={formatImageUrl(assignment.rubricUrl)}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-sm text-blue-600 hover:underline truncate"
                                                    >
                                                        {assignment.rubricUrl.split('/').pop()}
                                                    </a>
                                                </div>
                                            ) : (
                                                <p className="text-sm text-gray-500 italic">Chưa có rubric</p>
                                            )
                                        )}
                                        {isEditMode && <p className="text-[10px] text-gray-500">Hỗ trợ: PDF, DOC, DOCX, EXCEL</p>}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>

                <DialogFooter className="px-6 py-4 border-t border-purple-100/50 bg-linear-to-r from-white via-purple-50/30 to-indigo-50/30 shrink-0 shadow-[0_-8px_30px_rgba(139,92,246,0.12)]">
                    <div className="flex items-center justify-end w-full gap-2">
                        {isEditMode ? (
                            <>
                                <Button variant="ghost" onClick={() => setIsEditMode(false)} className="rounded-xl text-gray-600 hover:bg-purple-50 hover:text-purple-700 mr-2 transition-all duration-200">
                                    Hủy bỏ
                                </Button>
                                <Button
                                    onClick={handleSubmit}
                                    disabled={!formData.title || !formData.rubricUrl || isPending}
                                    className="rounded-xl bg-linear-to-r from-purple-600 via-purple-500 to-indigo-600 hover:from-purple-700 hover:via-purple-600 hover:to-indigo-700 text-white shadow-lg shadow-purple-200 hover:shadow-xl hover:shadow-purple-300 px-6 transition-all duration-200 transform hover:scale-105"
                                >
                                    {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
                                    Cập nhật
                                </Button>
                            </>
                        ) : (
                            <Button variant="ghost" onClick={() => onOpenChange(false)} className="rounded-xl text-gray-600 hover:bg-purple-50 hover:text-purple-700 transition-all duration-200">
                                Đóng
                            </Button>
                        )}
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}


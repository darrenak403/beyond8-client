"use client"

import React, { useState, useEffect } from "react"
import { useCreateQuiz } from "@/hooks/useQuiz"
import { useCheckEmbedHealth, useEmbedFile } from "@/hooks/useAI"
import { useGenerateQuestionsWithAI, useImportQuestionsFromAI } from "@/hooks/useQuestion"
import { useGetLessonDocument, useCreateLessonDocument } from "@/hooks/useLesson"
import { useMediaDocumentCourse } from "@/hooks/useMedia"
import { useGetCourseDocument } from "@/hooks/useCourse"
import { Quiz } from "@/lib/api/services/fetchQuiz"
import { formatImageUrl } from "@/lib/utils/formatImageUrl"
import DocumentUploadDialog from "@/components/widget/document/DocumentUploadDialog"
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
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Loader2, Settings, Sparkles, Target, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle, FileText, BrainCircuit, Play, Clock, Trophy, Shuffle, Eye, HelpCircle, Upload } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface CreateQuizAIDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    courseId: string
    lessonId: string
    sectionTitle: string
    lessonTitle: string
    sectionOrder: number
    lessonOrder: number
    onConfirm: (quizId: string) => void
}

type AIProcessStep = 'idle' | 'checking_health' | 'embedding' | 'generating' | 'importing' | 'creating_quiz' | 'completed' | 'error'

export function CreateQuizAIDialog({
    open,
    onOpenChange,
    courseId,
    lessonId,
    sectionTitle,
    lessonTitle,
    sectionOrder,
    lessonOrder,
    onConfirm
}: CreateQuizAIDialogProps) {
    const { createQuiz } = useCreateQuiz()
    const { refetch: checkHealth } = useCheckEmbedHealth()
    const { mutateAsync: embedFile } = useEmbedFile()
    const { generateQuestionsAsync } = useGenerateQuestionsWithAI()
    const { importQuestionsAsync } = useImportQuestionsFromAI()
    const { lessonDocuments, refetch: refetchDocs } = useGetLessonDocument(lessonId)
    const { courseDocument: courseDocuments } = useGetCourseDocument(courseId)
    const { createLessonDocument, isPending: isCreatingDoc } = useCreateLessonDocument(courseId)
    const { uploadDocumentCourseAsync, isUploadingDocumentCourse } = useMediaDocumentCourse()

    // Unified document list: lesson docs first, then course docs
    type UnifiedDoc = { id: string; title: string; url: string; source: 'lesson' | 'course' }
    const unifiedDocuments: UnifiedDoc[] = [
        ...(lessonDocuments ?? []).map(d => ({ id: d.id, title: d.title, url: d.lessonDocumentUrl, source: 'lesson' as const })),
        ...(courseDocuments ?? []).map(d => ({ id: `course_${d.id}`, title: d.title, url: d.courseDocumentUrl, source: 'course' as const })),
    ]

    // Document upload state
    const documentInputRef = React.useRef<HTMLInputElement>(null)
    const [isDocumentDialogOpen, setIsDocumentDialogOpen] = useState(false)
    const [documentFileToUpload, setDocumentFileToUpload] = useState<File | null>(null)
    const [documentMetadata, setDocumentMetadata] = useState({
        title: "",
        description: "",
        isDownloadable: true,
    })

    // Step Control
    const [step, setStep] = useState<1 | 2>(1)
    const [processStep, setProcessStep] = useState<AIProcessStep>('idle')
    const [errorMsg, setErrorMsg] = useState<string | null>(null)

    // Step 1: Configuration
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [timeLimit, setTimeLimit] = useState(30)
    const [passScore, setPassScore] = useState(80)
    const [maxAttempts, setMaxAttempts] = useState(3)
    const [shuffle, setShuffle] = useState(false)
    const [allowReview, setAllowReview] = useState(true)
    const [showExplanation, setShowExplanation] = useState(true)
    const [totalQuestions, setTotalQuestions] = useState(10)

    // Difficulty Distribution
    const [easyPercent, setEasyPercent] = useState(30)
    const [mediumPercent, setMediumPercent] = useState(40)
    const [hardPercent, setHardPercent] = useState(30)

    const [selectedDocumentId, setSelectedDocumentId] = useState<string>("")
    const [userQuery, setUserQuery] = useState("")

    useEffect(() => {
        if (open) {
            setUserQuery(`Chương ${sectionOrder} ${sectionTitle} - Bài ${lessonOrder} ${lessonTitle}`)
        }
    }, [open, sectionTitle, lessonTitle, sectionOrder, lessonOrder, setUserQuery])

    const totalPercent = easyPercent + mediumPercent + hardPercent
    const isDistributionValid = totalPercent === 100
    const isQuestionsValid = totalQuestions >= 5

    useEffect(() => {
        if (open && unifiedDocuments.length > 0 && !selectedDocumentId) {
            setSelectedDocumentId(unifiedDocuments[0].id)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, lessonDocuments, courseDocuments])

    const handleNextStep = () => {
        if (step === 1 && title && isDistributionValid && isQuestionsValid) {
            setStep(2)
        }
    }

    const handleBackStep = () => {
        setStep(1)
        setProcessStep('idle')
        setErrorMsg(null)
    }

    const handleDocumentFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        setDocumentFileToUpload(file)
        setDocumentMetadata({ title: file.name, description: "", isDownloadable: true })
        setIsDocumentDialogOpen(true)
        if (documentInputRef.current) documentInputRef.current.value = ""
    }

    const handleDocumentConfirmUpload = async () => {
        if (!documentFileToUpload) return
        try {
            const mediaFile = await uploadDocumentCourseAsync(documentFileToUpload)
            if (mediaFile?.fileUrl) {
                await createLessonDocument({
                    lessonId,
                    lessonDocumentUrl: formatImageUrl(mediaFile.fileUrl) || "",
                    title: documentMetadata.title,
                    description: documentMetadata.description,
                    isDownloadable: documentMetadata.isDownloadable,
                    isIndexedInVectorDb: true,
                })
                const result = await refetchDocs()
                const newDoc = result.data?.find(d => d.title === documentMetadata.title) ?? result.data?.[0]
                if (newDoc) setSelectedDocumentId(newDoc.id)
                setIsDocumentDialogOpen(false)
                setDocumentFileToUpload(null)
            }
        } catch (error) {
            console.error("Failed to upload document:", error)
        }
    }

    const executeFullFlow = async () => {
        const selectedDoc = unifiedDocuments.find(d => d.id === selectedDocumentId)
        if (!selectedDoc) {
            toast.error("Vui lòng chọn tài liệu")
            return
        }

        // Resolve actual document id (strip 'course_' prefix for course docs)
        const actualDocumentId = selectedDoc.source === 'course'
            ? selectedDoc.id.replace('course_', '')
            : selectedDoc.id

        setErrorMsg(null)

        try {
            setProcessStep('checking_health')
            const healthCheck = await checkHealth()

            if (healthCheck.isError || !healthCheck.data?.isSuccess) {
                throw new Error("Dịch vụ AI đang bảo trì hoặc không phản hồi. Vui lòng thử lại sau.")
            }

            setProcessStep('embedding')
            await embedFile({
                cloudFrontUrl: selectedDoc.url,
                courseId,
                lessonId,
                documentId: actualDocumentId
            })

            setProcessStep('generating')
            const generatedData = await generateQuestionsAsync({
                courseId,
                lessonId,
                totalCount: totalQuestions,
                query: userQuery,
                maxPoints: 10,
                distribution: {
                    easyPercent,
                    mediumPercent,
                    hardPercent
                },
                topK: 15
            })

            if (!generatedData.isSuccess || !generatedData.data) {
                throw new Error(generatedData.message || "Không thể tạo câu hỏi từ AI (Dữ liệu rỗng)")
            }

            setProcessStep('importing')
            const questionsByDiff = generatedData.data
            const importResponse = await importQuestionsAsync({
                easy: questionsByDiff.easy,
                medium: questionsByDiff.medium,
                hard: questionsByDiff.hard
            })

            if (!importResponse.isSuccess || !importResponse.data) {
                throw new Error(importResponse.message || "Không thể lưu câu hỏi")
            }

            const createdQuestionIds = importResponse.data

            setProcessStep('creating_quiz')
            const quizResponse = await createQuiz({
                title,
                description,
                courseId,
                lessonId,
                questionIds: createdQuestionIds,
                timeLimitMinutes: timeLimit,
                passScorePercent: passScore,
                totalPoints: createdQuestionIds.length * 10,
                maxAttempts,
                shuffleQuestions: shuffle,
                allowReview,
                showExplanation,
                difficultyDistribution: {
                    easyPercent,
                    mediumPercent,
                    hardPercent
                }
            })

            if (quizResponse.isSuccess && quizResponse.data) {
                const quizData = Array.isArray(quizResponse.data) ? quizResponse.data[0] : (quizResponse.data as unknown as Quiz)
                if (quizData?.id) {
                    setProcessStep('completed')
                    onConfirm(quizData.id)
                    setTimeout(() => {
                        onOpenChange(false)
                        setStep(1)
                        setProcessStep('idle')
                    }, 2000)
                }
            }

        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : "Đã xảy ra lỗi trong quá trình xử lý"
            console.error(e)
            setProcessStep('error')
            setErrorMsg(message)
        }
    }

    // Calculate requirements
    const neededEasy = Math.round(totalQuestions * (easyPercent / 100))
    const neededMedium = Math.round(totalQuestions * (mediumPercent / 100))
    const neededHard = totalQuestions - neededEasy - neededMedium

    return (
        <>
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={cn(
                "flex flex-col p-0 gap-0 transition-all duration-300 overflow-hidden",
                step === 1 ? "max-w-6xl h-[85vh]" : "max-w-2xl h-[80vh]" // Step 2 is smaller/focused for AI dialog
            )}>
                <DialogHeader className="px-6 py-4 border-b bg-gray-50/50 flex-shrink-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={cn(
                                "h-10 w-10 rounded-xl flex items-center justify-center shadow-sm",
                                step === 1 ? "bg-purple-600 text-white" : "bg-teal-500 text-white"
                            )}>
                                {step === 1 ? <Settings className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                            </div>
                            <div>
                                <DialogTitle className="text-xl font-bold text-gray-900">
                                    {step === 1 ? "Cấu hình Bài kiểm tra AI" : "Tạo với AI"}
                                </DialogTitle>
                                <DialogDescription className="text-gray-500 text-sm mt-0.5">
                                    {step === 1 ? "Thiết lập thông tin và để AI giúp bạn tạo đề thi" : "Chọn nguồn dữ liệu và xem AI làm việc"}
                                </DialogDescription>
                            </div>
                        </div>

                        {/* Modern Stepper */}
                        <div className="flex items-center bg-gray-100 rounded-lg p-1 mr-4">
                            <div className={cn(
                                "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                                step === 1 ? "bg-white text-purple-700 shadow-sm" : "text-gray-500"
                            )}>
                                <span className={cn("flex items-center justify-center w-5 h-5 rounded-full text-[10px]", step === 1 ? "bg-purple-100" : "bg-gray-200")}>1</span>
                                Cấu hình
                            </div>
                            <div className={cn(
                                "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                                step === 2 ? "bg-white text-teal-600 shadow-sm" : "text-gray-500"
                            )}>
                                <span className={cn("flex items-center justify-center w-5 h-5 rounded-full text-[10px]", step === 2 ? "bg-teal-100" : "bg-gray-200")}>2</span>
                                AI Xử lý
                            </div>
                        </div>
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto bg-gray-50/30">
                    {step === 1 ? (
                        <div className="p-6">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Column 1: Basic Info */}
                                <div className="space-y-6">
                                    <Card className="border-gray-200 shadow-sm flex flex-col h-full">
                                        <CardHeader className="pb-3 border-b bg-gray-50/50">
                                            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-gray-800">
                                                <FileText className="w-4 h-4 text-gray-500" />
                                                Thông tin cơ bản
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-5 space-y-4 flex-1">
                                            <div className="space-y-2">
                                                <Label htmlFor="title" className="text-base font-semibold text-gray-900">
                                                    Tên bài kiểm tra <span className="text-red-500">*</span>
                                                </Label>
                                                <div className="relative">
                                                    <Input
                                                        id="title"
                                                        value={title}
                                                        onChange={(e) => setTitle(e.target.value)}
                                                        maxLength={100}
                                                        placeholder="Ví dụ: Quiz Chapter 1"
                                                        className="h-11 pr-16 text-md bg-white shadow-sm border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                                                    />
                                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium pointer-events-none">
                                                        {title.length}/100
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="space-y-2 flex-1 flex flex-col">
                                                <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                                                    Mô tả <span className="text-gray-400 font-normal">(tùy chọn)</span>
                                                </Label>
                                                <div className="relative flex-1 flex flex-col h-full">
                                                    <Textarea
                                                        id="description"
                                                        value={description}
                                                        onChange={(e) => setDescription(e.target.value)}
                                                        maxLength={500}
                                                        placeholder="Mô tả..."
                                                        className="flex-1 resize-none bg-white shadow-sm border-gray-200 focus:border-purple-500 focus:ring-purple-500 h-full min-h-[350px] pb-8"
                                                    />
                                                    <span className="absolute right-3 bottom-3 text-xs text-gray-400 font-medium pointer-events-none">
                                                        {description.length}/500
                                                    </span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Column 2: Structure & Difficulty */}
                                <div className="space-y-6">
                                    <Card className="border-gray-200 shadow-sm flex flex-col h-full">
                                        <CardHeader className="pb-3 border-b bg-gray-50/50">
                                            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-gray-800">
                                                <Target className="w-4 h-4 text-gray-500" /> Cấu trúc & Độ khó
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-5 space-y-6 flex-1">
                                            <div className="space-y-3">
                                                <div className="flex justify-between items-center">
                                                    <Label className="font-medium text-gray-700">Tổng số câu hỏi</Label>
                                                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 text-sm h-7 px-3">
                                                        {totalQuestions} câu
                                                    </Badge>
                                                </div>
                                                <Input type="number" min={5} value={totalQuestions} onChange={(e) => setTotalQuestions(Number(e.target.value))} className={cn("bg-white", !isQuestionsValid && "border-red-400 focus:ring-red-400 focus:border-red-400")} />
                                                {!isQuestionsValid && (
                                                    <p className="text-xs text-red-500">Tổng số câu hỏi phải ≥ 5</p>
                                                )}
                                            </div>

                                            <Separator />

                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <Label className="font-medium text-gray-700">Phân phối độ khó</Label>
                                                    <span className={cn("text-xs font-bold px-2 py-1 rounded-full", isDistributionValid ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700")}>{totalPercent}%</span>
                                                </div>

                                                <div className="h-4 w-full rounded-full overflow-hidden flex shadow-inner bg-gray-100">
                                                    <div style={{ width: `${easyPercent}%` }} className="bg-green-400" title="Dễ" />
                                                    <div style={{ width: `${mediumPercent}%` }} className="bg-yellow-400" title="Trung bình" />
                                                    <div style={{ width: `${hardPercent}%` }} className="bg-red-400" title="Khó" />
                                                </div>

                                                <div className="space-y-5">
                                                    <div className="grid grid-cols-[80px_1fr] items-center gap-3">
                                                        <Label className="text-sm text-green-700 font-semibold">Dễ</Label>
                                                        <div className="flex items-center gap-2"><Input type="number" value={easyPercent} onChange={(e) => setEasyPercent(Number(e.target.value))} className="h-9 text-sm" /><span className="text-xs text-gray-400 w-12 text-right">{neededEasy} câu</span></div>
                                                    </div>
                                                    <div className="grid grid-cols-[80px_1fr] items-center gap-3">
                                                        <Label className="text-sm text-yellow-700 font-semibold">Trung bình</Label>
                                                        <div className="flex items-center gap-2"><Input type="number" value={mediumPercent} onChange={(e) => setMediumPercent(Number(e.target.value))} className="h-9 text-sm" /><span className="text-xs text-gray-400 w-12 text-right">{neededMedium} câu</span></div>
                                                    </div>
                                                    <div className="grid grid-cols-[80px_1fr] items-center gap-3">
                                                        <Label className="text-sm text-red-700 font-semibold">Khó</Label>
                                                        <div className="flex items-center gap-2"><Input type="number" value={hardPercent} onChange={(e) => setHardPercent(Number(e.target.value))} className="h-9 text-sm" /><span className="text-xs text-gray-400 w-12 text-right">{neededHard} câu</span></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Column 3: Settings & Switches */}
                                <div className="space-y-6">
                                    <Card className="border-gray-200 shadow-sm flex flex-col h-full">
                                        <CardHeader className="pb-3 border-b bg-gray-50/50">
                                            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-gray-800">
                                                <Settings className="w-4 h-4 text-gray-500" /> Thiết lập & Tùy chọn
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="grid grid-cols-1 gap-6 p-5">
                                            <div className="space-y-11">
                                                <div className="space-y-2">
                                                    <Label className="text-xs font-semibold text-gray-500 uppercase">Thời gian</Label>
                                                    <div className="relative">
                                                        <Input type="number" min={1} value={timeLimit} onChange={(e) => setTimeLimit(Number(e.target.value))} className="pl-9 h-10 bg-white" />
                                                        <Clock className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                                                        <span className="absolute right-3 top-3 text-xs text-gray-400 font-medium">phút</span>
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-xs font-semibold text-gray-500 uppercase">Điểm đậu</Label>
                                                    <div className="relative">
                                                        <Input type="number" min={0} max={100} value={passScore} onChange={(e) => setPassScore(Number(e.target.value))} className="pl-9 h-10 bg-white" />
                                                        <Trophy className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                                                        <span className="absolute right-3 top-3 text-xs text-gray-400 font-medium">%</span>
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-xs font-semibold text-gray-500 uppercase">Số lần thử</Label>
                                                    <Input type="number" min={1} value={maxAttempts} onChange={(e) => setMaxAttempts(Number(e.target.value))} className="h-10 bg-white" />
                                                </div>
                                            </div>

                                            <Separator />

                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between"><Label className="text-sm cursor-pointer flex items-center gap-2"><Shuffle className="w-4 h-4 text-purple-500" /> Xáo trộn</Label><Switch checked={shuffle} onCheckedChange={setShuffle} /></div>
                                                <div className="flex items-center justify-between"><Label className="text-sm cursor-pointer flex items-center gap-2"><Eye className="w-4 h-4 text-blue-500" /> Xem lại</Label><Switch checked={allowReview} onCheckedChange={setAllowReview} /></div>
                                                <div className="flex items-center justify-between"><Label className="text-sm cursor-pointer flex items-center gap-2"><HelpCircle className="w-4 h-4 text-green-500" /> Giải thích</Label><Switch checked={showExplanation} onCheckedChange={setShowExplanation} /></div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="p-8 max-w-lg mx-auto min-h-full flex flex-col justify-center">
                            {processStep === 'idle' || processStep === 'error' ? (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="text-center space-y-2 mb-8">
                                        <div className="w-16 h-16 bg-teal-100 text-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                                            <BrainCircuit className="w-9 h-9" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900">Chuẩn bị nội dung</h3>
                                        <p className="text-gray-500 text-sm">Chọn tài liệu nguồn để AI phân tích và tạo câu hỏi</p>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <Label className="font-semibold text-gray-700">Tài liệu tham khảo</Label>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    className="gap-1.5 h-8 rounded-full border-teal-200 text-teal-700 hover:bg-teal-50 hover:text-teal-900 text-xs px-3"
                                                    onClick={() => documentInputRef.current?.click()}
                                                    disabled={isUploadingDocumentCourse || isCreatingDoc}
                                                >
                                                    {isUploadingDocumentCourse || isCreatingDoc
                                                        ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                        : <Upload className="w-3.5 h-3.5" />
                                                    }
                                                    Tải lên
                                                </Button>
                                                <input
                                                    ref={documentInputRef}
                                                    type="file"
                                                    className="hidden"
                                                    onChange={handleDocumentFileSelect}
                                                />
                                            </div>
                                            {unifiedDocuments.length > 0 ? (
                                                <Select value={selectedDocumentId} onValueChange={setSelectedDocumentId}>
                                                    <SelectTrigger className="h-12 bg-white border-gray-200">
                                                        <SelectValue placeholder="Chọn tài liệu..." />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {lessonDocuments && lessonDocuments.length > 0 && (
                                                            <>
                                                                <div className="px-2 py-1.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Tài liệu bài học</div>
                                                                {lessonDocuments.map(doc => (
                                                                    <SelectItem key={doc.id} value={doc.id}>
                                                                        <div className="flex items-center gap-2">
                                                                            <FileText className="w-4 h-4 text-teal-500" />
                                                                            <span className="truncate max-w-[280px]">{doc.title}</span>
                                                                        </div>
                                                                    </SelectItem>
                                                                ))}
                                                            </>
                                                        )}
                                                        {courseDocuments && courseDocuments.length > 0 && (
                                                            <>
                                                                <div className="px-2 py-1.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wide mt-1">Tài liệu khóa học</div>
                                                                {courseDocuments.map(doc => (
                                                                    <SelectItem key={`course_${doc.id}`} value={`course_${doc.id}`}>
                                                                        <div className="flex items-center gap-2">
                                                                            <FileText className="w-4 h-4 text-purple-500" />
                                                                            <span className="truncate max-w-[280px]">{doc.title}</span>
                                                                        </div>
                                                                    </SelectItem>
                                                                ))}
                                                            </>
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            ) : (
                                                <div className="flex flex-col items-center gap-3 p-5 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 text-center">
                                                    <FileText className="w-8 h-8 text-gray-300" />
                                                    <p className="text-sm text-gray-500">Chưa có tài liệu nào. Hãy tải lên bên trên.</p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="font-semibold text-gray-700">Ngữ cảnh / Chủ đề</Label>
                                            <Textarea
                                                value={userQuery}
                                                onChange={(e) => setUserQuery(e.target.value)}
                                                placeholder="Mô tả nội dung trọng tâm để AI tập trung..."
                                                className="min-h-[100px] bg-white border-gray-200 resize-none focus:ring-teal-500 focus:border-teal-500"
                                            />
                                        </div>
                                    </div>

                                    {errorMsg && (
                                        <div className="p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 flex items-start gap-3">
                                            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                            <p>{errorMsg}</p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-8 py-4">
                                    <div className="text-center space-y-2">
                                        {processStep === 'completed' ? (
                                            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-in zoom-in duration-300">
                                                <CheckCircle2 className="w-10 h-10" />
                                            </div>
                                        ) : (
                                            <div className="relative w-20 h-20 mx-auto mb-6">
                                                <div className="absolute inset-0 rounded-full border-4 border-gray-100"></div>
                                                <div className="absolute inset-0 rounded-full border-4 border-teal-500 border-t-transparent animate-spin"></div>
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <Sparkles className="w-8 h-8 text-teal-600 animate-pulse" />
                                                </div>
                                            </div>
                                        )}
                                        <h3 className="text-2xl font-bold text-gray-900">
                                            {processStep === 'completed' ? 'Hoàn tất!' : 'AI đang xử lý...'}
                                        </h3>
                                        <p className="text-gray-500">Vui lòng không tắt cửa sổ này</p>
                                    </div>

                                    <div className="space-y-0 relative pl-8 border-l border-gray-200 ml-4">
                                        <StepItem status={processStep} step="checking_health" label="Kiểm tra dịch vụ AI" />
                                        <StepItem status={processStep} step="embedding" label="Đọc và phân tích tài liệu" />
                                        <StepItem status={processStep} step="generating" label="Tạo câu hỏi từ nội dung" />
                                        <StepItem status={processStep} step="importing" label="Lưu trữ câu hỏi" />
                                        <StepItem status={processStep} step="creating_quiz" label="Tạo bài kiểm tra" />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <DialogFooter className="px-6 py-4 border-t bg-white flex-shrink-0 z-20 shadow-[0_-5px_15px_rgba(0,0,0,0.05)]">
                    {step === 1 ? (
                        <>
                            <Button variant="ghost" onClick={() => onOpenChange(false)} className="rounded-full text-gray-500 hover:bg-gray-100 hover:text-black">Hủy bỏ</Button>
                            <Button onClick={handleNextStep} disabled={!title || !isDistributionValid || !isQuestionsValid} className="rounded-full bg-purple-600 hover:bg-purple-700 text-white shadow-md px-6">
                                Tổng quan & AI <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </>
                    ) : (
                        <>
                            {processStep === 'idle' || processStep === 'error' ? (
                                <>
                                    <Button variant="outline" onClick={handleBackStep} className="rounded-full border-gray-200 hover:bg-gray-100 hover:text-black">
                                        <ArrowLeft className="rounded-full w-4 h-4 mr-2" /> Quay lại
                                    </Button>
                                    <Button
                                        onClick={executeFullFlow}
                                        disabled={!selectedDocumentId || unifiedDocuments.length === 0}
                                        className="rounded-full bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-200 px-8"
                                    >
                                        <Sparkles className="w-4 h-4 mr-2" />
                                        {processStep === 'error' ? 'Thử lại' : 'Bắt đầu tạo'}
                                    </Button>
                                </>
                            ) : (
                                <Button disabled className="rounded-full w-full bg-gray-100 text-gray-400 border-none">
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Đang xử lý...
                                </Button>
                            )}
                        </>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>

        <DocumentUploadDialog
            open={isDocumentDialogOpen}
            onOpenChange={setIsDocumentDialogOpen}
            metadata={documentMetadata}
            setMetadata={setDocumentMetadata}
            onConfirm={handleDocumentConfirmUpload}
            onCancel={() => setIsDocumentDialogOpen(false)}
            isLoading={isUploadingDocumentCourse || isCreatingDoc}
        />
        </>
    )
}

function StepItem({ status, step, label }: { status: AIProcessStep, step: AIProcessStep, label: string }) {
    // Determine state
    const order = ['checking_health', 'embedding', 'generating', 'importing', 'creating_quiz', 'completed']
    const currentIndex = order.indexOf(status)
    const stepIndex = order.indexOf(step)

    let icon = <div className="w-2.5 h-2.5 rounded-full bg-gray-200 group-hover:bg-gray-300 transition-colors" />
    let textClass = "text-gray-400"
    let containerClass = "opacity-50"

    const isCurrent = status === step
    const isCompleted = status === 'completed' || currentIndex > stepIndex
    const isError = status === 'error' && stepIndex === currentIndex

    if (isError) {
        icon = <AlertCircle className="w-5 h-5 text-red-500 bg-white relative z-10" />
        textClass = "text-red-500 font-semibold"
        containerClass = "opacity-100"
    } else if (isCompleted) {
        icon = <CheckCircle2 className="w-5 h-5 text-green-500 bg-white relative z-10" />
        textClass = "text-green-600 font-medium"
        containerClass = "opacity-100"
    } else if (isCurrent) {
        icon = (
            <span className="relative flex h-5 w-5 z-10">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-5 w-5 bg-teal-500 items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full" />
                </span>
            </span>
        )
        textClass = "text-teal-700 font-bold"
        containerClass = "opacity-100 scale-105 origin-left"
    }

    return (
        <div className={cn("relative flex items-center gap-4 py-3 transition-all duration-300", containerClass)}>
            <div className="absolute -left-[27px] top-1/2 -translate-y-1/2 flex items-center justify-center w-6">
                {icon}
            </div>
            <span className={cn("text-sm transition-all duration-300", textClass)}>{label}</span>
        </div>
    )
}

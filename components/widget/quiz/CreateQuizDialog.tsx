"use client"

import { useEffect, useState } from "react"
import { useCreateQuiz } from "@/hooks/useQuiz"
import { Quiz } from "@/lib/api/services/fetchQuiz"
import { Question } from "@/lib/api/services/fetchQuestion"
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
    Loader2,
    Settings,
    Target,
    ArrowRight,
    ArrowLeft,
    CheckCircle2,
    Clock,
    Trophy,
    Shuffle,
    Eye,
    HelpCircle,
    FileText
} from "lucide-react"
import { QuestionBankView } from "@/app/(instructor)/instructor/question-bank/components/QuestionBankView"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface CreateQuizDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    courseId: string
    lessonId: string
    onConfirm: (quizId: string) => void
}

export function CreateQuizDialog({
    open,
    onOpenChange,
    courseId,
    lessonId,
    onConfirm
}: CreateQuizDialogProps) {
    const { createQuiz, isPending } = useCreateQuiz()

    // Step Control
    const [step, setStep] = useState<1 | 2>(1)

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

    // Step 2: Selection
    const [selectedItems, setSelectedItems] = useState<Map<string, Question>>(new Map()) // id -> Question object

    // Question Bank View State
    const [selectedTag, setSelectedTag] = useState<string | null>(null)
    const [pageNumber, setPageNumber] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [isDescending, setIsDescending] = useState(true)
    const [isChildDialogOpen, setIsChildDialogOpen] = useState(false)
    const [currentPageQuestions, setCurrentPageQuestions] = useState<Question[]>([])

    const totalPercent = easyPercent + mediumPercent + hardPercent
    const isDistributionValid = totalPercent === 100
    const isQuestionsValid = totalQuestions >= 5

    const handleNextStep = () => {
        if (step === 1 && title && isDistributionValid && isQuestionsValid) {
            setStep(2)
        }
    }

    const handleBackStep = () => {
        setStep(1)
    }

    // Question Selection Handlers
    const handleToggleSelect = (question: Question) => {
        setSelectedItems(prev => {
            const newMap = new Map(prev)
            if (newMap.has(question.id)) {
                newMap.delete(question.id)
            } else {
                if (newMap.size < totalQuestions) {
                    newMap.set(question.id, question)
                }
            }
            return newMap
        })
    }

    const handleSelectAll = () => {
        setSelectedItems(prev => {
            const newMap = new Map(prev)
            for (const q of currentPageQuestions) {
                if (newMap.size >= totalQuestions) break
                if (!newMap.has(q.id)) newMap.set(q.id, q)
            }
            return newMap
        })
    }

    const allCurrentSelected = currentPageQuestions.length > 0 && currentPageQuestions.every(q => selectedItems.has(q.id))

    const handleSubmit = async () => {
        const questionIds = Array.from(selectedItems.keys())

        try {
            const response = await createQuiz({
                title,
                description,
                courseId,
                lessonId,
                questionIds, // From Step 2
                timeLimitMinutes: timeLimit,
                passScorePercent: passScore,
                totalPoints: 10,
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

            if (response.isSuccess && response.data) {
                const quizData = Array.isArray(response.data) ? response.data[0] : (response.data as unknown as Quiz)

                if (quizData?.id) {
                    onConfirm(quizData.id)
                    onOpenChange(false)
                    // Reset steps for next time
                    setStep(1)
                    setSelectedItems(new Map())
                    setTitle("")
                }
            }
        } catch (error) {
            console.error("Failed to create quiz", error)
        }
    }

    // Calculate requirements
    const neededEasy = Math.round(totalQuestions * (easyPercent / 100))
    const neededMedium = Math.round(totalQuestions * (mediumPercent / 100))
    const neededHard = totalQuestions - neededEasy - neededMedium

    // Calculate selected counts
    const selectedEasy = Array.from(selectedItems.values()).filter(q => q.difficulty === 'Easy').length
    const selectedMedium = Array.from(selectedItems.values()).filter(q => q.difficulty === 'Medium').length
    const selectedHard = Array.from(selectedItems.values()).filter(q => q.difficulty === 'Hard').length

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className={cn(
                    "flex flex-col p-0 gap-0 transition-all duration-300 overflow-hidden",
                    step === 1 ? "max-w-6xl h-[85vh]" : "max-w-[90vw] h-[95vh]",
                    isChildDialogOpen ? "!opacity-0 pointer-events-none" : "opacity-100"
                )}
                overlayClassName={cn(
                    "transition-opacity duration-300",
                    isChildDialogOpen ? "!opacity-0 pointer-events-none" : "opacity-100"
                )}
            >
                <DialogHeader className="px-6 py-4 border-b bg-gray-50/50 flex-shrink-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={cn(
                                "h-10 w-10 rounded-xl flex items-center justify-center shadow-sm",
                                step === 1 ? "bg-blue-600 text-white" : "bg-purple-600 text-white"
                            )}>
                                {step === 1 ? <Settings className="w-5 h-5" /> : <Target className="w-5 h-5" />}
                            </div>
                            <div>
                                <DialogTitle className="text-xl font-bold text-gray-900">
                                    {step === 1 ? "Cấu hình Bài kiểm tra" : "Chọn câu hỏi"}
                                </DialogTitle>
                                <DialogDescription className="text-gray-500 text-sm mt-0.5">
                                    {step === 1 ? "Thiết lập thông tin cơ bản và thông số đề thi" : "Lựa chọn và kiểm duyệt các câu hỏi từ ngân hàng"}
                                </DialogDescription>
                            </div>
                        </div>

                        {/* Modern Stepper */}
                        <div className="flex items-center bg-gray-100 rounded-lg p-1 mr-4">
                            <div className={cn(
                                "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                                step === 1 ? "bg-white text-blue-700 shadow-sm" : "text-gray-500"
                            )}>
                                <span className={cn("flex items-center justify-center w-5 h-5 rounded-full text-[10px]", step === 1 ? "bg-blue-100" : "bg-gray-200")}>1</span>
                                Cấu hình
                            </div>
                            <div className={cn(
                                "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                                step === 2 ? "bg-white text-purple-700 shadow-sm" : "text-gray-500"
                            )}>
                                <span className={cn("flex items-center justify-center w-5 h-5 rounded-full text-[10px]", step === 2 ? "bg-purple-100" : "bg-gray-200")}>2</span>
                                Câu hỏi
                            </div>
                        </div>
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto bg-gray-50/30">
                    {step === 1 ? (
                        <div className="p-6">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Column 1: Basic Information */}
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
                                                        placeholder="Nhập tên bài kiểm tra..."
                                                        className="h-11 pr-16 text-md bg-white shadow-sm border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                                    />
                                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium pointer-events-none">
                                                        {title.length}/100
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="space-y-2 flex-1 flex flex-col">
                                                <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                                                    Mô tả / Hướng dẫn <span className="text-gray-400 font-normal">(tùy chọn)</span>
                                                </Label>
                                                <div className="relative flex-1 flex flex-col">
                                                    <Textarea
                                                        id="description"
                                                        value={description}
                                                        onChange={(e) => setDescription(e.target.value)}
                                                        maxLength={500}
                                                        placeholder="Nhập hướng dẫn làm bài cho học viên..."
                                                        className="flex-1 resize-none bg-white shadow-sm border-gray-200 focus:border-blue-500 focus:ring-blue-500 min-h-[350px] pb-8"
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
                                                <Target className="w-4 h-4 text-gray-500" />
                                                Cấu trúc đề
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-5 space-y-6 flex-1">
                                            <div className="space-y-3">
                                                <div className="flex justify-between items-center">
                                                    <Label className="font-medium text-gray-700">Tổng số câu hỏi</Label>
                                                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-sm h-7 px-3">
                                                        {totalQuestions} câu
                                                    </Badge>
                                                </div>
                                                <Input
                                                    type="number"
                                                    min={5}
                                                    value={totalQuestions}
                                                    onChange={(e) => setTotalQuestions(Number(e.target.value))}
                                                    className={cn("bg-white", !isQuestionsValid && "border-red-400 focus:ring-red-400 focus:border-red-400")}
                                                />
                                                {!isQuestionsValid && (
                                                    <p className="text-xs text-red-500">Tổng số câu hỏi phải ≥ 5</p>
                                                )}
                                            </div>

                                            <Separator />

                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <Label className="font-medium text-gray-700">Phân phối độ khó</Label>
                                                    <span className={cn(
                                                        "text-xs font-bold px-2 py-1 rounded-full",
                                                        isDistributionValid ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                                    )}>
                                                        {totalPercent}%
                                                    </span>
                                                </div>

                                                {/* Visual Bar Distribution */}
                                                <div className="h-4 w-full rounded-full overflow-hidden flex shadow-inner bg-gray-100">
                                                    <div style={{ width: `${easyPercent}%` }} className="bg-green-400 transition-all duration-300" title="Dễ" />
                                                    <div style={{ width: `${mediumPercent}%` }} className="bg-yellow-400 transition-all duration-300" title="Trung bình" />
                                                    <div style={{ width: `${hardPercent}%` }} className="bg-red-400 transition-all duration-300" title="Khó" />
                                                </div>

                                                <div className="space-y-5">
                                                    <div className="grid grid-cols-[80px_1fr] items-center gap-3">
                                                        <Label className="text-sm text-green-700 font-semibold">Dễ</Label>
                                                        <div className="flex items-center gap-2">
                                                            <Input
                                                                type="number"
                                                                value={easyPercent}
                                                                onChange={(e) => setEasyPercent(Number(e.target.value))}
                                                                className="h-9 text-sm"
                                                            />
                                                            <span className="text-xs text-gray-400 w-12 text-right">{neededEasy} câu</span>
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-[80px_1fr] items-center gap-3">
                                                        <Label className="text-sm text-yellow-700 font-semibold">Trung bình</Label>
                                                        <div className="flex items-center gap-2">
                                                            <Input
                                                                type="number"
                                                                value={mediumPercent}
                                                                onChange={(e) => setMediumPercent(Number(e.target.value))}
                                                                className="h-9 text-sm"
                                                            />
                                                            <span className="text-xs text-gray-400 w-12 text-right">{neededMedium} câu</span>
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-[80px_1fr] items-center gap-3">
                                                        <Label className="text-sm text-red-700 font-semibold">Khó</Label>
                                                        <div className="flex items-center gap-2">
                                                            <Input
                                                                type="number"
                                                                value={hardPercent}
                                                                onChange={(e) => setHardPercent(Number(e.target.value))}
                                                                className="h-9 text-sm"
                                                            />
                                                            <span className="text-xs text-gray-400 w-12 text-right">{neededHard} câu</span>
                                                        </div>
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
                                                <Settings className="w-4 h-4 text-gray-500" />
                                                Thiết lập & Tùy chọn
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-5 space-y-6 flex-1">
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label className="text-xs font-semibold text-gray-500 uppercase">Thời gian</Label>
                                                    <div className="relative">
                                                        <Input
                                                            type="number"
                                                            min={1}
                                                            value={timeLimit}
                                                            onChange={(e) => setTimeLimit(Number(e.target.value))}
                                                            className="pl-9 h-10 bg-white"
                                                        />
                                                        <Clock className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                                                        <span className="absolute right-3 top-3 text-xs text-gray-400 font-medium">phút</span>
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-xs font-semibold text-gray-500 uppercase">Điểm đậu</Label>
                                                    <div className="relative">
                                                        <Input
                                                            type="number"
                                                            min={0}
                                                            max={100}
                                                            value={passScore}
                                                            onChange={(e) => setPassScore(Number(e.target.value))}
                                                            className="pl-9 h-10 bg-white"
                                                        />
                                                        <Trophy className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                                                        <span className="absolute right-3 top-3 text-xs text-gray-400 font-medium">%</span>
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-xs font-semibold text-gray-500 uppercase">Số lần làm bài tối đa</Label>
                                                    <Input
                                                        type="number"
                                                        min={1}
                                                        value={maxAttempts}
                                                        onChange={(e) => setMaxAttempts(Number(e.target.value))}
                                                        placeholder="Để trống nếu không giới hạn"
                                                        className="h-10 bg-white"
                                                    />
                                                    <p className="text-[10px] text-gray-500">Mặc định 3 lần</p>
                                                </div>
                                            </div>

                                            <Separator />

                                            <div className="space-y-4 pt-2">
                                                <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
                                                    <Label htmlFor="shuffle" className="cursor-pointer text-sm font-medium text-gray-700 flex items-center gap-2">
                                                        <Shuffle className="w-4 h-4 text-purple-500" /> Xáo trộn câu hỏi
                                                    </Label>
                                                    <Switch checked={shuffle} onCheckedChange={setShuffle} id="shuffle" />
                                                </div>
                                                <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
                                                    <Label htmlFor="allowReview" className="cursor-pointer text-sm font-medium text-gray-700 flex items-center gap-2">
                                                        <Eye className="w-4 h-4 text-blue-500" /> Cho phép xem lại
                                                    </Label>
                                                    <Switch checked={allowReview} onCheckedChange={setAllowReview} id="allowReview" />
                                                </div>
                                                <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
                                                    <Label htmlFor="showExplanation" className="cursor-pointer text-sm font-medium text-gray-700 flex items-center gap-2">
                                                        <HelpCircle className="w-4 h-4 text-green-500" /> Hiện giải thích
                                                    </Label>
                                                    <Switch checked={showExplanation} onCheckedChange={setShowExplanation} id="showExplanation" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col bg-gray-50">
                            {/* Step 2 Content: Question Bank View */}
                            {/* Modern Status Bar */}
                            <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b shadow-sm px-6 py-4">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="text-sm">
                                            <p className="text-gray-500">Đã chọn</p>
                                            <p className="text-xl font-bold text-gray-900 leading-none flex items-center gap-2">
                                                {selectedItems.size} <span className="text-gray-400 font-normal text-sm">/ {totalQuestions} câu</span>
                                            </p>
                                        </div>
                                        {/* Progress Bar */}
                                        <div className="hidden md:flex flex-col w-32 gap-1.5">
                                            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-purple-600 transition-all duration-500 rounded-full"
                                                    style={{ width: `${Math.min((selectedItems.size / totalQuestions) * 100, 100)}%` }}
                                                />
                                            </div>
                                        </div>
                                        {selectedItems.size !== totalQuestions && (
                                            <span className="text-sm text-red-500 font-medium animate-pulse">
                                                Vui lòng chọn đủ {totalQuestions} câu hỏi ({selectedItems.size}/{totalQuestions})
                                            </span>
                                        )}
                                    </div>

                                    {/* Difficulty Counters with Visuals */}
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className={cn(
                                            "h-9 px-3 gap-2 border-dashed border-2",
                                            selectedEasy >= neededEasy ? "bg-green-50 text-green-700 border-green-200 border-solid" : "text-gray-500"
                                        )}>
                                            <div className={cn("w-2 h-2 rounded-full", selectedEasy >= neededEasy ? "bg-green-500" : "bg-gray-300")} />
                                            <span className="font-semibold">{selectedEasy}</span> / {neededEasy} Dễ
                                        </Badge>
                                        <Badge variant="outline" className={cn(
                                            "h-9 px-3 gap-2 border-dashed border-2",
                                            selectedMedium >= neededMedium ? "bg-yellow-50 text-yellow-700 border-yellow-200 border-solid" : "text-gray-500"
                                        )}>
                                            <div className={cn("w-2 h-2 rounded-full", selectedMedium >= neededMedium ? "bg-yellow-500" : "bg-gray-300")} />
                                            <span className="font-semibold">{selectedMedium}</span> / {neededMedium} Trung Bình
                                        </Badge>
                                        <Badge variant="outline" className={cn(
                                            "h-9 px-3 gap-2 border-dashed border-2",
                                            selectedHard >= neededHard ? "bg-red-50 text-red-700 border-red-200 border-solid" : "text-gray-500"
                                        )}>
                                            <div className={cn("w-2 h-2 rounded-full", selectedHard >= neededHard ? "bg-red-500" : "bg-gray-300")} />
                                            <span className="font-semibold">{selectedHard}</span> / {neededHard} Khó
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto px-6 py-6">
                                <QuestionBankView
                                    selectedTag={selectedTag}
                                    pageNumber={pageNumber}
                                    pageSize={pageSize}
                                    isDescending={isDescending}
                                    onTagClick={(tag) => {
                                        setSelectedTag(tag)
                                        setPageNumber(1)
                                    }}
                                    onPageChange={setPageNumber}
                                    onBackToTags={() => {
                                        setSelectedTag(null)
                                        setPageNumber(1)
                                    }}
                                    // Enable selection mode
                                    selectionMode="multiple"
                                    selectedIds={new Set(selectedItems.keys())}
                                    onToggleSelect={handleToggleSelect}
                                    onInteractingWithDialog={setIsChildDialogOpen}
                                    onCurrentPageQuestions={setCurrentPageQuestions}
                                    isInDialog={true}
                                    onSelectAll={handleSelectAll}
                                    selectAllDisabled={selectedItems.size >= totalQuestions}
                                />
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="px-6 py-4 border-t bg-white flex-shrink-0 z-20 shadow-[0_-5px_15px_rgba(0,0,0,0.05)]">
                    {step === 1 ? (
                        <>
                            <Button variant="ghost" onClick={() => onOpenChange(false)} className="rounded-full text-gray-500 hover:bg-gray-100 hover:text-black">
                                Hủy bỏ
                            </Button>
                            <Button
                                onClick={handleNextStep}
                                disabled={!title || !isDistributionValid || !isQuestionsValid}
                                className="rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-200 px-6"
                            >
                                Tiếp tục <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button variant="outline" onClick={handleBackStep} disabled={isPending} className="rounded-full border-gray-300 hover:bg-gray-100 hover:text-black">
                                <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại
                            </Button>
                            <div className="flex items-center gap-3">
                                <Button
                                    onClick={handleSubmit}
                                    disabled={isPending || selectedItems.size !== totalQuestions}
                                    className="rounded-full bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-200 px-8"
                                >
                                    {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
                                    Hoàn tất & Tạo
                                </Button>
                            </div>
                        </>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

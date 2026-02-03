"use client"

import { useState } from "react"
import { useCreateQuiz } from "@/hooks/useQuiz"
import { Quiz } from "@/lib/api/services/fetchQuiz"
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
import { Loader2, Settings, Clock, Trophy, Target, Shuffle, Eye, HelpCircle, BarChart3, AlertCircle } from "lucide-react"

interface CreateQuizDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    questionIds: string[]
    courseId: string
    lessonId: string
    onConfirm: (quizId: string) => void
}

export function CreateQuizDialog({
    open,
    onOpenChange,
    questionIds,
    courseId,
    lessonId,
    onConfirm
}: CreateQuizDialogProps) {
    const { createQuiz, isPending } = useCreateQuiz()

    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [timeLimit, setTimeLimit] = useState(30)
    const [passScore, setPassScore] = useState(80)
    const [maxAttempts, setMaxAttempts] = useState(3)
    const [shuffle, setShuffle] = useState(false)
    const [allowReview, setAllowReview] = useState(true)
    const [showExplanation, setShowExplanation] = useState(true)

    // Difficulty Distribution
    const [easyPercent, setEasyPercent] = useState(30)
    const [mediumPercent, setMediumPercent] = useState(40)
    const [hardPercent, setHardPercent] = useState(30)

    const totalPercent = easyPercent + mediumPercent + hardPercent
    const isDistributionValid = totalPercent === 100

    const handleSubmit = async () => {
        try {
            const response = await createQuiz({
                title,
                description,
                courseId,
                lessonId,
                questionIds,
                timeLimitMinutes: timeLimit,
                passScorePercent: passScore,
                totalPoints: questionIds.length * 10,
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
                // API might return an array or a single object depending on implementation
                const quizData = Array.isArray(response.data) ? response.data[0] : (response.data as unknown as Quiz)

                if (quizData?.id) {
                    onConfirm(quizData.id)
                    onOpenChange(false)
                }
            }
        } catch (error) {
            console.error("Failed to create quiz", error)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0 gap-0">
                <DialogHeader className="p-6 pb-2 border-b bg-gray-50/50 sticky top-0 z-10 backdrop-blur-md">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-brand-magenta/10 text-brand-magenta">
                            <Target className="w-6 h-6" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl">Thiết lập bài kiểm tra</DialogTitle>
                            <DialogDescription className="mt-1">
                                Cấu hình thông số cho {questionIds.length} câu hỏi đã chọn.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="p-6 grid gap-8">
                    {/* General Info */}
                    <div className="grid gap-4">
                        <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 pb-2 border-b">
                            <Settings className="w-4 h-4" />
                            <span>Thông tin chung</span>
                        </div>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="title" className="text-gray-700">Tên bài kiểm tra <span className="text-red-500">*</span></Label>
                                <Input
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Ví dụ: Bài kiểm tra cuối chương 1..."
                                    className="focus:ring-brand-magenta/20"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="description" className="text-gray-700">Mô tả hướng dẫn</Label>
                                <Textarea
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Hướng dẫn làm bài cho học viên..."
                                    className="min-h-[80px] focus:ring-brand-magenta/20"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Settings Grid */}
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Constraints */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 pb-2 border-b">
                                <Clock className="w-4 h-4" />
                                <span>Ràng buộc</span>
                            </div>
                            <div className="grid gap-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs text-muted-foreground">Thời gian (phút)</Label>
                                        <div className="relative">
                                            <Input
                                                type="number"
                                                min={1}
                                                value={timeLimit}
                                                onChange={(e) => setTimeLimit(Number(e.target.value))}
                                                className="pl-8"
                                            />
                                            <Clock className="w-3.5 h-3.5 absolute left-2.5 top-3 text-gray-400" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs text-muted-foreground">Điểm đạt (%)</Label>
                                        <div className="relative">
                                            <Input
                                                type="number"
                                                min={0}
                                                max={100}
                                                value={passScore}
                                                onChange={(e) => setPassScore(Number(e.target.value))}
                                                className="pl-8"
                                            />
                                            <Trophy className="w-3.5 h-3.5 absolute left-2.5 top-3 text-gray-400" />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs text-muted-foreground">Số lần làm lại tối đa</Label>
                                    <Input
                                        type="number"
                                        min={1}
                                        value={maxAttempts}
                                        onChange={(e) => setMaxAttempts(Number(e.target.value))}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Difficulty Distribution */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between text-sm font-semibold text-gray-900 pb-2 border-b">
                                <div className="flex items-center gap-2">
                                    <BarChart3 className="w-4 h-4" />
                                    <span>Tỉ lệ độ khó (%)</span>
                                </div>
                                <span className={`text-xs ${isDistributionValid ? 'text-green-600' : 'text-red-500'}`}>
                                    Tổng: {totalPercent}%
                                </span>
                            </div>
                            <div className="grid gap-3">
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="space-y-1.5">
                                        <Label className="text-xs text-green-600 font-medium">Dễ</Label>
                                        <Input
                                            type="number"
                                            value={easyPercent}
                                            onChange={(e) => setEasyPercent(Number(e.target.value))}
                                            className="h-9 text-sm"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs text-yellow-600 font-medium">Trung bình</Label>
                                        <Input
                                            type="number"
                                            value={mediumPercent}
                                            onChange={(e) => setMediumPercent(Number(e.target.value))}
                                            className="h-9 text-sm"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs text-red-600 font-medium">Khó</Label>
                                        <Input
                                            type="number"
                                            value={hardPercent}
                                            onChange={(e) => setHardPercent(Number(e.target.value))}
                                            className="h-9 text-sm"
                                        />
                                    </div>
                                </div>
                                {!isDistributionValid && (
                                    <div className="flex items-center gap-2 text-xs text-red-500 bg-red-50 p-2 rounded">
                                        <AlertCircle className="w-3 h-3" />
                                        <span>Tổng tỉ lệ phải bằng 100%</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Toggles */}
                    <div className="flex flex-col gap-3 p-4 bg-gray-50 rounded-xl border">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-white rounded-md border shadow-sm">
                                    <Shuffle className="w-4 h-4 text-gray-600" />
                                </div>
                                <Label htmlFor="shuffle" className="text-sm font-medium cursor-pointer">Xáo trộn câu hỏi</Label>
                            </div>
                            <Switch id="shuffle" checked={shuffle} onCheckedChange={setShuffle} />
                        </div>
                        <div className="h-px bg-gray-200" />
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-white rounded-md border shadow-sm">
                                    <Eye className="w-4 h-4 text-gray-600" />
                                </div>
                                <Label htmlFor="allowReview" className="text-sm font-medium cursor-pointer">Cho phép xem lại bài</Label>
                            </div>
                            <Switch id="allowReview" checked={allowReview} onCheckedChange={setAllowReview} />
                        </div>
                        <div className="h-px bg-gray-200" />
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-white rounded-md border shadow-sm">
                                    <HelpCircle className="w-4 h-4 text-gray-600" />
                                </div>
                                <Label htmlFor="showExplanation" className="text-sm font-medium cursor-pointer">Hiện giải thích chi tiết</Label>
                            </div>
                            <Switch id="showExplanation" checked={showExplanation} onCheckedChange={setShowExplanation} />
                        </div>
                    </div>
                </div>

                <DialogFooter className="p-6 pt-2 border-t bg-gray-50/50">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Hủy bỏ
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isPending || !title || !isDistributionValid}
                        className="bg-brand-magenta hover:bg-brand-magenta/90"
                    >
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Tạo bài kiểm tra
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

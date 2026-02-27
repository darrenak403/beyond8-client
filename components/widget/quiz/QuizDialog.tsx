"use client";

import { useGetQuizById } from "@/hooks/useQuiz";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Clock, CheckCircle2, HelpCircle, AlertCircle, FileText, Circle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Question, QuestionDifficulty } from "@/lib/api/services/fetchQuestion";

interface QuizDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    quizId: string;
}

export const QuizDialog = ({ open, onOpenChange, quizId }: QuizDialogProps) => {
    const { quiz, isLoading, isError } = useGetQuizById(quizId);

    const getDifficultyColor = (difficulty: QuestionDifficulty) => {
        switch (difficulty) {
            case QuestionDifficulty.Easy:
                return "bg-green-100 text-green-700 border-green-200";
            case QuestionDifficulty.Medium:
                return "bg-yellow-100 text-yellow-700 border-yellow-200";
            case QuestionDifficulty.Hard:
                return "bg-red-100 text-red-700 border-red-200";
            default:
                return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl h-[85vh] flex flex-col p-0 gap-0 overflow-hidden">
                <DialogHeader className="px-6 py-4 border-b shrink-0 bg-white">
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <FileText className="w-5 h-5 text-purple-600" />
                        Chi tiết bài kiểm tra
                    </DialogTitle>
                    <DialogDescription>
                        Xem thông tin chi tiết và danh sách câu hỏi
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-hidden">
                    {isLoading ? (
                        <div className="h-full flex flex-col items-center justify-center gap-2 text-gray-500">
                            <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                            <p>Đang tải dữ liệu...</p>
                        </div>
                    ) : isError || !quiz ? (
                        <div className="h-full flex flex-col items-center justify-center gap-2 text-red-500">
                            <AlertCircle className="w-8 h-8" />
                            <p>Không thể tải thông tin bài kiểm tra</p>
                        </div>
                    ) : (
                        <ScrollArea className="h-full">
                            <div className="p-6 space-y-8 bg-gray-50/50 min-h-full">
                                {/* Quiz Info Section */}
                                <div className="space-y-4">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900">{quiz.title}</h2>
                                        <p className="text-gray-500 mt-1">{quiz.description}</p>
                                    </div>

                                    <div className="flex flex-wrap gap-4">
                                        <div className="flex items-center gap-2 bg-purple-50 px-3 py-1.5 rounded-lg border border-purple-100">
                                            <Clock className="w-4 h-4 text-purple-600" />
                                            <span className="text-sm font-medium text-purple-900">
                                                {quiz.timeLimitMinutes} phút
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
                                            <CheckCircle2 className="w-4 h-4 text-blue-600" />
                                            <span className="text-sm font-medium text-blue-900">
                                                Đạt: {quiz.passScorePercent}%
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-100">
                                            <HelpCircle className="w-4 h-4 text-orange-600" />
                                            <span className="text-sm font-medium text-orange-900">
                                                {quiz.questions?.length || quiz.questionCount} câu hỏi
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                {/* Questions List */}
                                <div className="space-y-6">
                                    <h3 className="text-lg font-semibold flex items-center gap-2">
                                        Danh sách câu hỏi
                                        <Badge variant="secondary" className="rounded-full">
                                            {quiz.questions?.length || 0}
                                        </Badge>
                                    </h3>

                                    {quiz.questions && quiz.questions.length > 0 ? (
                                        <div className="grid gap-4">
                                            {quiz.questions.map((question: Question, index: number) => (
                                                <div
                                                    key={question.id || index}
                                                    className="border rounded-xl p-5 bg-white shadow-sm space-y-4 hover:border-purple-200 transition-colors"
                                                >
                                                    <div className="flex items-start gap-4">
                                                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 font-semibold text-sm shrink-0">
                                                            {index + 1}
                                                        </span>
                                                        <div className="flex-1 space-y-3">
                                                            <div className="flex items-start justify-between gap-4">
                                                                <div className="text-base font-medium text-gray-900" dangerouslySetInnerHTML={{ __html: question.content }} />
                                                                <Badge className={cn("shrink-0", getDifficultyColor(question.difficulty))}>
                                                                    {question.difficulty === "Easy" ? "Dễ" : question.difficulty === "Medium" ? "Trung bình" : "Khó"}
                                                                </Badge>
                                                            </div>

                                                            {/* Options */}
                                                            {question.options && question.options.length > 0 && (
                                                                <div className="space-y-2 pl-2">
                                                                    {question.options.map((option) => (
                                                                        <div
                                                                            key={option.id}
                                                                            className="flex items-start gap-2 text-sm"
                                                                        >
                                                                            {option.isCorrect ? (
                                                                                <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-600 mt-0.5" />
                                                                            ) : (
                                                                                <Circle className="h-5 w-5 flex-shrink-0 text-muted-foreground mt-0.5" />
                                                                            )}
                                                                            <span className={option.isCorrect ? "font-medium text-green-700" : "text-muted-foreground"}>
                                                                                {option.text}
                                                                            </span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}

                                                            {/* Explanation if available */}
                                                            {question.explanation && (
                                                                <div className="mt-3 bg-blue-50 p-3 rounded-lg border border-blue-100 text-sm text-blue-800">
                                                                    <span className="font-semibold block mb-1">Giải thích:</span>
                                                                    <div dangerouslySetInnerHTML={{ __html: question.explanation }} />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed">
                                            <p className="text-gray-500">Chưa có câu hỏi nào trong bài kiểm tra này</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </ScrollArea>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

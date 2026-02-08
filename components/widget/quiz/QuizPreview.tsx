"use client";

import { useGetQuizById, useGetQuizOverview } from "@/hooks/useQuiz";
import QuizInfoCard from "@/app/courses/[slug]/[courseId]/(exam-attempt)/[sectionId]/[lessonId]/quiz-attempt/components/QuizInfoCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Lesson } from "@/lib/api/services/fetchLesson";

interface QuizPreviewProps {
    lesson: Lesson;
}

export default function QuizPreview({ lesson }: QuizPreviewProps) {
    const { quiz, isLoading, isError } = useGetQuizById(lesson.quizId || "");

    if (!lesson.quizId) {
        return <div className="p-4 text-center text-muted-foreground">Bài trắc nghiệm không hợp lệ</div>;
    }

    if (isLoading) {
        return (
            <div className="space-y-6 p-6 bg-white rounded-2xl border border-gray-200">
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-4 w-2/3" />
                <div className="grid grid-cols-3 gap-4 border-t pt-4">
                    <Skeleton className="h-16 rounded-xl" />
                    <Skeleton className="h-16 rounded-xl" />
                    <Skeleton className="h-16 rounded-xl" />
                </div>
            </div>
        );
    }

    if (isError || !quiz) {
        return (
            <div className="p-8 text-center bg-white rounded-2xl border border-gray-200">
                <p className="text-destructive">Không thể tải thông tin bài trắc nghiệm</p>
            </div>
        );
    }

    return <QuizInfoCard quizOverview={quiz} />;
}

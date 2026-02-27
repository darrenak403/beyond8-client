"use client";

import { useGetQuizById } from "@/hooks/useQuiz";
import { Skeleton } from "@/components/ui/skeleton";
import { Lesson } from "@/lib/api/services/fetchLesson";
import QuizAttemptHeader from "@/app/courses/[slug]/[courseId]/(exam-attempt)/[sectionId]/[lessonId]/quiz-attempt/[quizId]/components/QuizAttemptHeader";
import QuizAttemptSidebar from "@/app/courses/[slug]/[courseId]/(exam-attempt)/[sectionId]/[lessonId]/quiz-attempt/[quizId]/components/QuizAttemptSidebar";
import QuestionCard from "@/app/courses/[slug]/[courseId]/(exam-attempt)/[sectionId]/[lessonId]/quiz-attempt/[quizId]/components/QuestionCard";
import QuizInfoCard from "@/app/courses/[slug]/[courseId]/(exam-attempt)/[sectionId]/[lessonId]/quiz-attempt/components/QuizInfoCard";
import { useEffect, useRef, useState, useMemo } from "react";
import { QuestionType } from "@/lib/api/services/fetchQuestion";
import { QuizOverview, QuizQuestion } from "@/lib/api/services/fetchQuiz";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

interface QuizPreviewProps {
    lesson: Lesson;
}

export default function QuizPreview({ lesson }: QuizPreviewProps) {
    const { quiz, isLoading, isError } = useGetQuizById(lesson.quizId || "");
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [isStarted, setIsStarted] = useState(false);
    const questionRefs = useRef<(HTMLDivElement | null)[]>([]);
    const scrollContainerRef = useRef<HTMLDivElement | null>(null);
    const isScrollingRef = useRef(false);
    const currentQuestionIndexRef = useRef<number>(0);

    const quizOverview: QuizOverview = {
        title: quiz?.title || "",
        description: quiz?.description || "",
        questionCount: quiz?.questions?.length || 0,
        timeLimitMinutes: quiz?.timeLimitMinutes || null,
        passScorePercent: quiz?.passScorePercent || 0,
        id: quiz?.id || "",
        instructorId: quiz?.instructorId || "",
        courseId: quiz?.courseId || null,
        lessonId: quiz?.lessonId || null
    };

    // Prepare questions data
    const questions: QuizQuestion[] = useMemo(() => {
        if (!quiz?.questions) return [];
        return quiz.questions.map((q, index) => ({
            questionId: q.id,
            orderIndex: index,
            content: q.content,
            // Map generic QuestionType to QuizQuestion type (which uses a stricter union)
            type: q.type === QuestionType.Essay ? "ShortAnswer" : (q.type as "MultipleChoice" | "TrueFalse" | "ShortAnswer"),
            points: q.points,
            options: q.options.map(opt => ({
                id: opt.id,
                text: opt.text
            }))
        }));
    }, [quiz]);

    useEffect(() => {
        if (!questions.length || !scrollContainerRef.current) return;

        // Reset refs array when questions change
        questionRefs.current = questionRefs.current.slice(0, questions.length);

        const handleScroll = () => {
            if (isScrollingRef.current || !scrollContainerRef.current) return;

            const container = scrollContainerRef.current;
            const containerRect = container.getBoundingClientRect();
            // Use a point slightly below the top of the container to check visibility
            const checkPoint = containerRect.top + 150;

            let closestIndex = 0;
            let minDistance = Number.MAX_VALUE;

            questionRefs.current.forEach((ref, index) => {
                if (!ref) return;
                const rect = ref.getBoundingClientRect();

                // Distance from the top of the question to the check point
                const distance = Math.abs(rect.top - checkPoint);

                if (distance < minDistance) {
                    minDistance = distance;
                    closestIndex = index;
                }
            });

            if (closestIndex !== currentQuestionIndexRef.current) {
                currentQuestionIndexRef.current = closestIndex;
                setCurrentQuestionIndex(closestIndex);
            }
        };

        const scrollContainer = scrollContainerRef.current;
        scrollContainer.addEventListener('scroll', handleScroll, { passive: true });

        // Trigger once to set initial state
        handleScroll();

        return () => {
            scrollContainer.removeEventListener('scroll', handleScroll);
        };
    }, [questions, isStarted]);


    if (!lesson.quizId) {
        return <div className="p-4 text-center text-muted-foreground">Bài trắc nghiệm không hợp lệ</div>;
    }

    if (isLoading) {
        return (
            <div className="h-[600px] flex flex-col bg-white rounded-lg border overflow-hidden">
                <div className="h-16 border-b p-4 bg-gray-50 flex items-center justify-between">
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-8 w-20" />
                </div>
                <div className="flex-1 flex">
                    <div className="w-[320px] border-r p-4 space-y-4">
                        <Skeleton className="h-32 w-full" />
                        <div className="grid grid-cols-5 gap-2">
                            {Array.from({ length: 10 }).map((_, i) => (
                                <Skeleton key={i} className="aspect-square rounded-md" />
                            ))}
                        </div>
                    </div>
                    <div className="flex-1 p-8 space-y-8">
                        <Skeleton className="h-40 w-full rounded-xl" />
                        <Skeleton className="h-40 w-full rounded-xl" />
                    </div>
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

    if (!isStarted) {
        return (
            <div className="space-y-6">
                {/* Reusing the overview card logic, mapping to QuizOverview type roughly if needed, 
                 but Quiz has all properties of Overview so it's compatible or we can cast */}
                <QuizInfoCard quizOverview={quizOverview} />

                <div className="flex justify-center">
                    <Button
                        size="lg"
                        onClick={() => setIsStarted(true)}
                        className="bg-brand-magenta hover:bg-brand-magenta/90 text-white font-bold px-8 shadow-lg shadow-brand-magenta/20"
                    >
                        <Play className="w-5 h-5 mr-2" />
                        Bắt đầu xem trước
                    </Button>
                </div>
            </div>
        );
    }

    const handleQuestionSelect = (index: number) => {
        const questionRef = questionRefs.current[index];
        if (questionRef) {
            isScrollingRef.current = true;
            currentQuestionIndexRef.current = index;
            setCurrentQuestionIndex(index);
            questionRef.scrollIntoView({ behavior: 'smooth', block: 'center' });

            setTimeout(() => {
                isScrollingRef.current = false;
            }, 1000);
        }
    };

    return (
        <div className="h-[800px] bg-white flex flex-col relative overflow-hidden border rounded-lg shadow-sm">
            {/* Header */}
            <div className="relative z-20">
                <QuizAttemptHeader
                    quizTitle={`${quiz.title}`}
                    timeRemaining={quiz.timeLimitMinutes ? quiz.timeLimitMinutes * 60 : null}
                    onBack={() => setIsStarted(false)}
                />
            </div>

            {/* Main Content */}
            <div className="flex flex-1 overflow-hidden relative z-10 h-full">
                {/* Sidebar */}
                <QuizAttemptSidebar
                    quizTitle={quiz.title}
                    timeSpentSeconds={0}
                    timeLimitMinutes={quiz.timeLimitMinutes}
                    questions={questions}
                    answers={{}} // Empty answers for preview
                    flaggedQuestions={[]}
                    currentQuestionIndex={currentQuestionIndex}
                    onQuestionSelect={handleQuestionSelect}
                    onSubmitQuiz={() => { }} // No-op
                    isSubmitting={false}
                    answeredCount={0}
                    totalQuestions={questions.length}
                />

                {/* Question Content */}
                <div ref={scrollContainerRef} className="flex flex-col w-full overflow-y-auto h-full bg-gray-50/50">
                    <div className="px-14 py-8 mb-20 w-full max-w-5xl mx-auto">
                        <div className="space-y-8">
                            {questions.map((question, index) => (
                                <div
                                    key={question.questionId}
                                    ref={(el) => {
                                        questionRefs.current[index] = el;
                                    }}
                                    className="scroll-mt-24"
                                >
                                    <QuestionCard
                                        question={question}
                                        currentIndex={index}
                                        totalQuestions={questions.length}
                                        selectedAnswers={[]} // No selection in preview
                                        isFlagged={false}
                                        onAnswerChange={() => { }} // Read-only
                                        onFlagChange={() => { }} // Read-only
                                        onPrevious={() => { }}
                                        onNext={() => { }}
                                        canGoPrevious={false}
                                        canGoNext={false}
                                        hideNavigation={true}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

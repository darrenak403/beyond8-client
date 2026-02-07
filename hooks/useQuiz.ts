import {
    CreateQuizRequest,
    fetchQuiz,
    Quiz,
    QuizAttempt,
    AutoSaveQuizAttemptRequest,
    FlagQuizQuestionRequest,
    QuizAttemptResult,
    QuizCurrentAttempt,
    QuizInProgressStatus,
    QuizMyAttemptsSummary,
    QuizOverview,
    QuizResponse,
    SubmitQuizAttemptRequest,
    SubmitQuizAttemptResult,
    UpdateQuizRequest,
} from "@/lib/api/services/fetchQuiz";
import { ApiResponse } from "@/types/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiError } from "next/dist/server/api-utils";
import { toast } from "sonner";

export function useCreateQuiz() {
    const queryClient = useQueryClient();

    const { mutateAsync, isPending } = useMutation({
        mutationFn: (quiz: CreateQuizRequest) => fetchQuiz.createQuiz(quiz),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["quizzes"],
            });
            if (variables.courseId) {
                queryClient.invalidateQueries({
                    queryKey: ["course", "details-preview", variables.courseId],
                });
            }
            toast.success("Tạo bài kiểm tra thành công!");
        },
        onError: (error: ApiError) => {
            toast.error(error?.message || "Tạo bài kiểm tra thất bại!");
        },
    });

    return {
        createQuiz: mutateAsync,
        isPending,
    };
}

export function useUpdateQuiz(courseId?: string) {
    const queryClient = useQueryClient();

    const { mutateAsync, isPending } = useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateQuizRequest }) =>
            fetchQuiz.updateQuiz(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["quizzes"],
            });
            if (courseId) {
                queryClient.invalidateQueries({
                    queryKey: ["course", "details-preview", courseId],
                });
            }
            toast.success("Cập nhật bài kiểm tra thành công!");
        },
        onError: (error: ApiError) => {
            toast.error(error?.message || "Cập nhật bài kiểm tra thất bại!");
        },
    });

    return {
        updateQuiz: mutateAsync,
        isPending,
    };
}

export function useDeleteQuiz(courseId?: string) {
    const queryClient = useQueryClient();

    const { mutateAsync, isPending } = useMutation({
        mutationFn: (id: string) => fetchQuiz.deleteQuiz(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["quizzes"],
            });
            if (courseId) {
                queryClient.invalidateQueries({
                    queryKey: ["course", "details-preview", courseId],
                });
            }
            toast.success("Xoá bài kiểm tra thành công!");
        },
        onError: (error: ApiError) => {
            toast.error(error?.message || "Xoá bài kiểm tra thất bại!");
        },
    });

    return {
        deleteQuiz: mutateAsync,
        isPending,
    };
}

export function useGetQuizzes() {
    const { data, isLoading, isError, refetch } = useQuery<
        QuizResponse,
        Error,
        Quiz[]
    >({
        queryKey: ["quizzes"],
        queryFn: () => fetchQuiz.getAllQuiz(),
        select: (data) => data.data,
        enabled: true,
    });

    return {
        quizzes: data ?? [],
        isLoading,
        isError,
        refetch,
    };
}

export function useGetQuizById(id: string) {
    const { data, isLoading, isError, refetch } = useQuery<
        ApiResponse<Quiz>,
        Error,
        Quiz
    >({
        queryKey: ["quizzes", id],
        queryFn: () => fetchQuiz.getQuizById(id),
        select: (data) => data.data,
        enabled: !!id,
    });

    return {
        quiz: data ?? null,
        isLoading,
        isError,
        refetch,
    };
}

// Student-side: get quiz overview by id (api/v1/quizzes/{id}/student)
export function useGetQuizOverview(id: string) {
    const { data, isLoading, isError, refetch } = useQuery<
        ApiResponse<QuizOverview>,
        Error,
        QuizOverview
    >({
        queryKey: ["quiz-overview", id],
        queryFn: () => fetchQuiz.getQuizOverview(id),
        select: (data) => data.data,
        enabled: !!id,
    });

    return {
        quizOverview: data ?? null,
        isLoading,
        isError,
        refetch,
    };
}

// Student-side: start quiz attempt (api/v1/quiz-attempts/start/{quizId})
export function useStartQuizAttempt() {
    const queryClient = useQueryClient();

    const { mutateAsync, isPending } = useMutation({
        mutationFn: (quizId: string) =>
            fetchQuiz.startQuizAttempt(quizId) as Promise<ApiResponse<QuizAttempt>>,
        onSuccess: (data) => {
            if (data.isSuccess && data.data) {
                const quizId = data.data.quizId;

                queryClient.invalidateQueries({
                    queryKey: ["quiz-my-attempts", quizId],
                });
                queryClient.invalidateQueries({
                    queryKey: ["quiz-in-progress", quizId],
                });
                queryClient.invalidateQueries({
                    queryKey: ["quiz-current-attempt", quizId],
                });
                queryClient.invalidateQueries({
                    queryKey: ["quiz-overview", quizId],
                });
            }
        },
    });

    return {
        startQuizAttempt: mutateAsync,
        isPending,
    };
}

// Student-side: submit quiz attempt (api/v1/quiz-attempts/{attemptId}/submit)
export function useSubmitQuizAttempt() {
    const queryClient = useQueryClient();

    const { mutateAsync, isPending } = useMutation({
        mutationFn: ({ attemptId, body }: { attemptId: string; body: SubmitQuizAttemptRequest }) =>
            fetchQuiz.submitQuizAttempt(attemptId, body) as Promise<ApiResponse<SubmitQuizAttemptResult>>,
        onSuccess: (data) => {
            if (data.isSuccess && data.data) {
                const quizId = data.data.quizId;
                queryClient.invalidateQueries({
                    queryKey: ["quiz-my-attempts", quizId],
                });
                queryClient.invalidateQueries({
                    queryKey: ["quiz-in-progress", quizId],
                });
                queryClient.invalidateQueries({
                    queryKey: ["quiz-current-attempt", quizId],
                });
            }
        },
    });

    return {
        submitQuizAttempt: mutateAsync,
        isPending,
    };
}

// Student-side: auto-save quiz attempt (api/v1/quiz-attempts/{attemptId}/auto-save)
export function useAutoSaveQuizAttempt() {
    const queryClient = useQueryClient();

    const { mutateAsync, isPending } = useMutation({
        mutationFn: ({ attemptId, body }: { attemptId: string; body: AutoSaveQuizAttemptRequest }) =>
            fetchQuiz.autoSaveQuizAttempt(attemptId, body) as Promise<ApiResponse<boolean>>,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["quiz-current-attempt"],
            });
        },
    });

    return {
        autoSaveQuizAttempt: mutateAsync,
        isPending,
    };
}

// Student-side: get quiz attempt result (api/v1/quiz-attempts/{attemptId}/result)
export function useGetQuizAttemptResult(attemptId: string) {
    const { data, isLoading, isError, refetch } = useQuery<
        ApiResponse<QuizAttemptResult>,
        Error,
        QuizAttemptResult
    >({
        queryKey: ["quiz-attempt-result", attemptId],
        queryFn: () => fetchQuiz.getQuizAttemptResult(attemptId),
        select: (data) => data.data,
        enabled: !!attemptId,
    });

    return {
        quizAttemptResult: data ?? null,
        isLoading,
        isError,
        refetch,
    };
}

// Student-side: get my attempts for a quiz (api/v1/quiz-attempts/quiz/{quizId}/my-attempts)
export function useGetMyQuizAttempts(quizId: string) {
    const { data, isLoading, isError, refetch } = useQuery<
        ApiResponse<QuizMyAttemptsSummary>,
        Error,
        QuizMyAttemptsSummary
    >({
        queryKey: ["quiz-my-attempts", quizId],
        queryFn: () => fetchQuiz.getMyQuizAttempts(quizId),
        select: (data) => data.data,
        enabled: !!quizId,
    });

    return {
        myQuizAttempts: data ?? null,
        isLoading,
        isError,
        refetch,
    };
}

// Student-side: check in-progress attempt (api/v1/quiz-attempts/quiz/{quizId}/check-in-progress)
export function useCheckQuizInProgress(quizId: string) {
    const { data, isLoading, isError, refetch } = useQuery<
        ApiResponse<QuizInProgressStatus>,
        Error,
        QuizInProgressStatus
    >({
        queryKey: ["quiz-in-progress", quizId],
        queryFn: () => fetchQuiz.checkQuizInProgress(quizId),
        select: (data) => data.data,
        enabled: !!quizId,
    });

    return {
        quizInProgress: data ?? null,
        isLoading,
        isError,
        refetch,
    };
}

// Student-side: get current quiz attempt (api/v1/quiz-attempts/quiz/{quizId}/current)
export function useGetCurrentQuizAttempt(quizId: string) {
    const { data, isLoading, isError, refetch } = useQuery<
        ApiResponse<QuizCurrentAttempt>,
        Error,
        QuizCurrentAttempt
    >({
        queryKey: ["quiz-current-attempt", quizId],
        queryFn: () => fetchQuiz.getCurrentQuizAttempt(quizId),
        select: (data) => data.data,
        enabled: !!quizId,
    });

    return {
        currentQuizAttempt: data ?? null,
        isLoading,
        isError,
        refetch,
    };
}

// Student-side: flag/unflag question (api/v1/quiz-attempts/{attemptId}/flag-question)
export function useFlagQuizQuestion() {
    const queryClient = useQueryClient();

    const { mutateAsync, isPending } = useMutation({
        mutationFn: ({
            attemptId,
            body,
        }: {
            attemptId: string;
            body: FlagQuizQuestionRequest;
        }) =>
            fetchQuiz.flagQuizQuestion(attemptId, body) as Promise<
                ApiResponse<string[]>
            >,
        onSuccess: (_data, variables) => {
            const attemptId = variables.attemptId;

            queryClient.invalidateQueries({
                queryKey: ["quiz-current-attempt"],
            });
            queryClient.invalidateQueries({
                queryKey: ["quiz-attempt-result", attemptId],
            });
        },
    });

    return {
        flagQuizQuestion: mutateAsync,
        isPending,
    };
}
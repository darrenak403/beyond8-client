import { CreateQuizRequest, fetchQuiz, Quiz, QuizResponse, UpdateQuizRequest } from "@/lib/api/services/fetchQuiz";
import { ApiResponse } from "@/types/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiError } from "next/dist/server/api-utils";
import { toast } from "sonner";

export function useCreateQuiz() {
    const queryClient = useQueryClient()

    const { mutateAsync, isPending } = useMutation({
        mutationFn: (quiz: CreateQuizRequest) => fetchQuiz.createQuiz(quiz),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["quizzes"]
            })
            toast.success("Tạo bài kiểm tra thành công!")
        },
        onError: (error: ApiError) => {
            toast.error(error?.message || "Tạo bài kiểm tra thất bại!")
        }
    })

    return {
        createQuiz: mutateAsync,
        isPending
    }
}

export function useUpdateQuiz() {
    const queryClient = useQueryClient()

    const { mutateAsync, isPending } = useMutation({
        mutationFn: ({ id, data }: { id: string, data: UpdateQuizRequest }) => fetchQuiz.updateQuiz(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["quizzes"]
            })
            toast.success("Cập nhật bài kiểm tra thành công!")
        },
        onError: (error: ApiError) => {
            toast.error(error?.message || "Cập nhật bài kiểm tra thất bại!")
        }
    })

    return {
        updateQuiz: mutateAsync,
        isPending
    }
}

export function useDeleteQuiz() {
    const queryClient = useQueryClient()

    const { mutateAsync, isPending } = useMutation({
        mutationFn: (id: string) => fetchQuiz.deleteQuiz(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["quizzes"]
            })
            toast.success("Xoá bài kiểm tra thành công!")
        },
        onError: (error: ApiError) => {
            toast.error(error?.message || "Xoá bài kiểm tra thất bại!")
        }
    })

    return {
        deleteQuiz: mutateAsync,
        isPending
    }
}

export function useGetQuizzes() {
    const { data, isLoading, isError, refetch } = useQuery<QuizResponse, Error, Quiz[]>({
        queryKey: ["quizzes"],
        queryFn: () => fetchQuiz.getAllQuiz(),
        select: (data) => data.data,
        enabled: true
    })

    return {
        quizzes: data ?? [],
        isLoading,
        isError,
        refetch
    }
}

export function useGetQuizById(id: string) {
    const { data, isLoading, isError, refetch } = useQuery<ApiResponse<Quiz>, Error, Quiz>({
        queryKey: ["quizzes", id],
        queryFn: () => fetchQuiz.getQuizById(id),
        select: (data) => data.data,
        enabled: !!id
    })

    return {
        quiz: data ?? null,
        isLoading,
        isError,
        refetch
    }
}
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchRassign, RequestReassignQuiz } from "@/lib/api/services/fetchReassign";
import { toast } from "sonner";

export function useRequestQuizReassign() {
    const queryClient = useQueryClient();

    const { mutateAsync, isPending } = useMutation({
        mutationFn: ({ quizId, request }: { quizId: string; request: RequestReassignQuiz }) =>
            fetchRassign.requestReassignQuiz(quizId, request),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["quiz-my-attempts", variables.quizId],
            });
            queryClient.invalidateQueries({
                queryKey: ["quiz-overview", variables.quizId],
            });
            toast.success("Gửi yêu cầu cấp thêm lượt làm bài thành công!");
        },
        onError: (error: Error) => {
            toast.error(error?.message || "Gửi yêu cầu thất bại!");
        },
    });

    return {
        requestQuizReassign: mutateAsync,
        isPending,
    };
}

export function useRequestAssignmentReassign() {
    const queryClient = useQueryClient();

    const { mutateAsync, isPending } = useMutation({
        mutationFn: ({ assignmentId, request }: { assignmentId: string; request: RequestReassignQuiz }) =>
            fetchRassign.requestReassignAssignment(assignmentId, request),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["assignments", variables.assignmentId],
            });
            queryClient.invalidateQueries({
                queryKey: ["assignments", variables.assignmentId, "submissions"],
            });
            toast.success("Gửi yêu cầu cấp thêm lượt nộp bài thành công!");
        },
        onError: (error: Error) => {
            toast.error(error?.message || "Gửi yêu cầu thất bại!");
        },
    });

    return {
        requestAssignmentReassign: mutateAsync,
        isPending,
    };
}

export function useGetReassignRequests(params: { pageNumber: number; pageSize: number; isDecending: boolean }) {
    const { data, isLoading, refetch } = useQuery({
        queryKey: ["reassign-requests", params],
        queryFn: () => fetchRassign.getReassignRequests(params),
    });

    return {
        requests: data?.data || [],
        metadata: data?.metadata,
        isLoading,
        refetch,
    };
}

export function useResetQuizAttempt() {
    const queryClient = useQueryClient();

    const { mutateAsync, isPending } = useMutation({
        mutationFn: ({ quizId, studentId }: { quizId: string; studentId: string }) =>
            fetchRassign.resetQuiz(quizId, studentId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["reassign-requests"] });
            toast.success("Đã cấp lại lượt làm bài kiểm tra!");
        },
        onError: (error: Error) => {
            toast.error(error?.message || "Cấp lại lượt thất bại!");
        },
    });

    return {
        resetQuizAttempt: mutateAsync,
        isPending,
    };
}

export function useResetAssignmentAttempt() {
    const queryClient = useQueryClient();

    const { mutateAsync, isPending } = useMutation({
        mutationFn: ({ assignmentId, studentId }: { assignmentId: string; studentId: string }) =>
            fetchRassign.resetAssignment(assignmentId, studentId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["reassign-requests"] });
            toast.success("Đã cấp lại lượt nộp bài tập!");
        },
        onError: (error: Error) => {
            toast.error(error?.message || "Cấp lại lượt thất bại!");
        },
    });

    return {
        resetAssignmentAttempt: mutateAsync,
        isPending,
    };
}

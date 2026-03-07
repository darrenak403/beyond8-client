import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
    assignmentService,
    CreateAssignmentRequest,
    UpdateAssignmentRequest,
    AssignmentResponse,
    GetAssignmentResponse,
    ParamsAssignment,
    SubmissionAssigmentResponse,
    SubmissionAssigmentRequest,
    GradeAssignmentRequest,
    GetSubmissionAssigmentResponse,
    GetSubmissionAssigmentSummaryResponse
} from "@/lib/api/services/fetchAssignment"

export function useCreateAssignment(courseId: string) {
    const queryClient = useQueryClient()

    const mutation = useMutation<AssignmentResponse, Error, CreateAssignmentRequest>({
        mutationFn: (data: CreateAssignmentRequest) => assignmentService.createAssignment(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["assignments"] })
            queryClient.invalidateQueries({ queryKey: ["sections", courseId] })
            toast.success("Tạo bài tập thành công!")
        },
        onError: (error: Error) => {
            toast.error(error.message || "Tạo bài tập thất bại!")
        },
    })

    return {
        createAssignment: mutation.mutate,
        createAssignmentAsync: mutation.mutateAsync,
        isPending: mutation.isPending,
        error: mutation.error,
        isSuccess: mutation.isSuccess,
        data: mutation.data,
    }
}

export function useUpdateAssignment() {
    const queryClient = useQueryClient()

    const mutation = useMutation<AssignmentResponse, Error, { id: string, data: UpdateAssignmentRequest }>({
        mutationFn: ({ id, data }) => assignmentService.updateAssignment(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["assignments"] })
            queryClient.invalidateQueries({ queryKey: ["assignments", variables.id] })
            queryClient.invalidateQueries({ queryKey: ["sections", variables.data.sectionId] })
            toast.success("Cập nhật bài tập thành công!")
        },
        onError: (error: Error) => {
            toast.error(error.message || "Cập nhật bài tập thất bại!")
        },
    })

    return {
        updateAssignment: mutation.mutate,
        updateAssignmentAsync: mutation.mutateAsync,
        isPending: mutation.isPending,
        error: mutation.error,
        isSuccess: mutation.isSuccess,
        data: mutation.data,
    }
}

export function useGetAssignmentById(id: string) {
    const { data, isLoading, error, refetch, isFetching } = useQuery<AssignmentResponse, Error>({
        queryKey: ["assignments", id],
        queryFn: () => assignmentService.getAssignmentById(id),
        enabled: !!id,
    })

    return {
        assignment: data?.data,
        isLoading,
        error,
        refetch,
        isFetching,
    }
}

export function useGetAllAssignments(params: ParamsAssignment) {
    const { data, isLoading, error, refetch, isFetching } = useQuery<GetAssignmentResponse, Error>({
        queryKey: ["assignments", params],
        queryFn: () => assignmentService.getAllAssignment(params),
    })

    return {
        assignments: data?.data || [],
        isLoading,
        error,
        refetch,
        isFetching,
    }
}

export function useDeleteAssignment(courseId: string, sectionId: string) {
    const queryClient = useQueryClient()

    const mutation = useMutation<AssignmentResponse, Error, string>({
        mutationFn: (id: string) => assignmentService.deleteAssignment(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ["assignments"] })
            //queryClient.invalidateQueries({ queryKey: ["assignments", id] })
            queryClient.invalidateQueries({ queryKey: ["sections", courseId] })
            queryClient.invalidateQueries({ queryKey: ["lessons", sectionId] })

            toast.success("Xóa bài tập thành công!")
        },
        onError: (error: Error) => {
            toast.error(error.message || "Xóa bài tập thất bại!")
        },
    })

    return {
        deleteAssignment: mutation.mutate,
        deleteAssignmentAsync: mutation.mutateAsync,
        isPending: mutation.isPending,
        error: mutation.error,
        isSuccess: mutation.isSuccess,
        data: mutation.data,
    }
}

export function useGetAssignmentByIdForStudent(id: string) {
    const { data, isLoading, error, refetch, isFetching } = useQuery<AssignmentResponse, Error>({
        queryKey: ["assignments", id],
        queryFn: () => assignmentService.getAssignmentByIdForStudent(id),
        enabled: !!id,
    })

    return {
        assignment: data?.data,
        isLoading,
        error,
        refetch,
        isFetching,
    }
}

export function useSubmitAssignment(assignmentId: string) {
    const queryClient = useQueryClient()
    const mutation = useMutation<SubmissionAssigmentResponse, Error, SubmissionAssigmentRequest>({
        mutationFn: (data: SubmissionAssigmentRequest) => assignmentService.submitAssignment(assignmentId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["assignments"] })
            queryClient.invalidateQueries({ queryKey: ["assignments", assignmentId] })
            toast.success("Nộp bài tập thành công!")
        },
        onError: (error: Error) => {
            toast.error(error.message || "Nộp bài tập thất bại!")
        },
    })

    return {
        submitAssignment: mutation.mutate,
        submitAssignmentAsync: mutation.mutateAsync,
        isPending: mutation.isPending,
        error: mutation.error,
        isSuccess: mutation.isSuccess,
        data: mutation.data,
    }
}

export function useGradeAssignment(submissionId: string) {
    const queryClient = useQueryClient()
    const mutation = useMutation<SubmissionAssigmentResponse, Error, GradeAssignmentRequest>({
        mutationFn: (data: GradeAssignmentRequest) => assignmentService.gradeAssignment(submissionId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["assignments"] })
            queryClient.invalidateQueries({ queryKey: ["assignments", submissionId] })
            toast.success("Chấm điểm bài tập thành công!")
        },
        onError: (error: Error) => {
            toast.error(error.message || "Chấm điểm bài tập thất bại!")
        },
    })

    return {
        gradeAssignment: mutation.mutate,
        gradeAssignmentAsync: mutation.mutateAsync,
        isPending: mutation.isPending,
        error: mutation.error,
        isSuccess: mutation.isSuccess,
        data: mutation.data,
    }
}

export function useGetSubmissionByStudent(assignmentId: string) {
    const { data, isLoading, error, refetch, isFetching } = useQuery<SubmissionAssigmentResponse, Error>({
        queryKey: ["assignments", assignmentId, "submissions"],
        queryFn: () => assignmentService.getSubmissionAssigment(assignmentId),
        enabled: !!assignmentId,
        retry: false,
    })

    return {
        submissions: data?.data,
        isLoading,
        error,
        refetch,
        isFetching,
    }
}

export function useGetSubmissionSumary(courseId: string) {
    const { data, isLoading, error, refetch, isFetching } = useQuery<GetSubmissionAssigmentSummaryResponse, Error>({
        queryKey: ["assignments", courseId, "submissions", "summary"],
        queryFn: () => assignmentService.getSubmissionOverviewByCourse(courseId),
        enabled: !!courseId,
    })

    return {
        submissions: data?.data,
        isLoading,
        error,
        refetch,
        isFetching,
    }
}

export function useGetSubmissionSumaryBySection(sectionId: string) {
    const { data, isLoading, error, refetch, isFetching } = useQuery<GetSubmissionAssigmentResponse, Error>({
        queryKey: ["assignments", sectionId, "submissions", "summary"],
        queryFn: () => assignmentService.getSubmissionOverviewBySection(sectionId),
        enabled: !!sectionId,
    })

    return {
        submissions: data?.data,
        isLoading,
        error,
        refetch,
        isFetching,
    }
}

export function useResetSubmission(assignmentId: string) {
    const queryClient = useQueryClient()
    const mutation = useMutation<SubmissionAssigmentResponse, Error, string>({
        mutationFn: (studentId: string) => assignmentService.resetSubmission(assignmentId, studentId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["assignments"] })
            queryClient.invalidateQueries({ queryKey: ["assignments", assignmentId] })
            toast.success("Làm mới lượt nộp bài thành công!")
        },
        onError: (error: Error) => {
            toast.error(error.message || "Làm mới lượt nộp bài thất bại!")
        },
    })

    return {
        resetSubmission: mutation.mutate,
        resetSubmissionAsync: mutation.mutateAsync,
        isPending: mutation.isPending,
        error: mutation.error,
        isSuccess: mutation.isSuccess,
    }
}

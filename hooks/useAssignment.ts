import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
    assignmentService,
    CreateAssignmentRequest,
    UpdateAssignmentRequest,
    AssignmentResponse,
    GetAssignmentResponse,
    ParamsAssignment
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

export function useDeleteAssignment(courseId: string) {
    const queryClient = useQueryClient()

    const mutation = useMutation<AssignmentResponse, Error, string>({
        mutationFn: (id: string) => assignmentService.deleteAssignment(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ["assignments"] })
            queryClient.invalidateQueries({ queryKey: ["assignments", id] })
            queryClient.invalidateQueries({ queryKey: ["sections", courseId] })
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

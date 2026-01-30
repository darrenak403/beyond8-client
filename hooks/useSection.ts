import { CreateSectionRequest, fetchSection, Section, SectionResponse, UpdateSectionRequest } from "@/lib/api/services/fetchSection"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { ApiError } from "next/dist/server/api-utils"
import { toast } from "sonner"

export function useCreateSection() {
    const queryClient = useQueryClient()
    const { mutateAsync, isPending } = useMutation({
        mutationFn: (section: CreateSectionRequest) => fetchSection.createSection(section),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["sections", variables.courseId]
            })
            toast.success("Tạo chương mới thành công!")
        },
        onError: (error: ApiError) => {
            toast.error(error?.message || "Tạo chương mới thất bại!")
        }
    })

    return {
        createSection: mutateAsync,
        isPending
    }
}

export function useGetSectionsByCourseId(courseId: string) {
    const { data, isLoading, isError, refetch } = useQuery<SectionResponse, Error, Section[]>({
        queryKey: ["sections", courseId],
        queryFn: () => fetchSection.getSectionByCourseId(courseId),
        select: (data) => data.data,
        enabled: !!courseId
    })

    return {
        sections: data ?? [],
        isLoading,
        isError,
        refetch
    }
}


export function useUpdateSection(courseId: string) {
    const queryClient = useQueryClient()
    const { mutateAsync, isPending } = useMutation({
        mutationFn: ({sectionId, data } : {sectionId: string, data: UpdateSectionRequest}) =>
            fetchSection.updateSection(sectionId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["sections", courseId]
            })
            toast.success("Cập nhật chương thành công!")
        },
        onError: (error: ApiError) => {
            toast.error(error?.message || "Cập nhật chương thất bại!")
        }
    })  
    return {
        updateSection: mutateAsync,
        isPending
    }
}

export function useDeleteSection(courseId: string) {
    const queryClient = useQueryClient()
    const { mutateAsync, isPending } = useMutation({
        mutationFn: (sectionId: string) => fetchSection.deleteSection(sectionId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["sections", courseId]
            })
            toast.success("Xoá chương thành công!")
        },
        onError: (error: ApiError) => {
            toast.error(error?.message || "Xoá chương thất bại!")
        }
    })  
    return {
        deleteSection: mutateAsync,
        isPending
    }
}
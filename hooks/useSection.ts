import { CreateSectionRequest, fetchSection, Section, SectionResponse } from "@/lib/api/services/fetchSection"
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

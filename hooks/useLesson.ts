import { err } from './../.agent/skills/typescript-expert/references/utility-types';
import { CreateLessonRequest, fetchLession } from "@/lib/api/services/fetchLesson";
import { ApiError } from "@/types/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";


export function useCreateLesson () {
    const queryClient = useQueryClient();
    const { mutateAsync, isPending } = useMutation({
        mutationFn: (lesson: CreateLessonRequest) => fetchLession.createLesson(lesson),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["lessons", variables.sectionId]
            });
        },
        onError: (error: ApiError) => {
            toast.error(error?.message || "Lỗi khi tạo bài học!");
        }
    });

    return {
        createLesson: mutateAsync,
        isPending
    };
}

export function useGetLessonBySectionId (sectionId: string) {
    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ["lessons", sectionId],
        queryFn: () => fetchLession.getLessonsBySection(sectionId),
        select: (data) => data.data,
    });
    return {
        lessons: data ?? [],
        isLoading,
        isError,
        refetch
    };
}

export function useUpdateLesson (sectionId: string) {
    const queryClient = useQueryClient();
    const { mutateAsync, isPending } = useMutation({
        mutationFn: ({ lessonId, data }: { lessonId: string; data: Partial<CreateLessonRequest> }) =>
            fetchLession.updateLesson(lessonId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["lessons", sectionId]
            });
        },
        onError: (error: ApiError) => {
            toast.error(error?.message || "Lỗi khi cập nhật bài học!");
        }
    });
    return {
        updateLesson: mutateAsync,
        isPending
    };
}

export function useDeleteLesson (sectionId: string) {
    const queryClient = useQueryClient();
    const { mutateAsync, isPending } = useMutation({
        mutationFn: (lessonId: string) => fetchLession.deleteLesson(lessonId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["lessons", sectionId]
            });
        },
        onError: (error: ApiError) => {
            toast.error(error?.message || "Lỗi khi xóa bài học!");
        }
    }); 
    return {
        deleteLesson: mutateAsync,
        isPending
    };
}
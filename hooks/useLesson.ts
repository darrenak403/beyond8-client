import { 
    fetchLession, 
    CreateLessonVideoRequest,
    CreateLessonTextRequest,
    CreateLessonQuizRequest,
    UpdateLessonVideoRequest,
    UpdateLessonTextRequest,
    UpdateLessonQuizRequest,
    LessonType
} from "@/lib/api/services/fetchLesson";
import { ApiError } from "@/types/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Union type for creating lessons with type discriminator
type CreateLessonRequest = 
    | ({ type: LessonType.Video } & CreateLessonVideoRequest)
    | ({ type: LessonType.Text } & CreateLessonTextRequest)
    | ({ type: LessonType.Quiz } & CreateLessonQuizRequest);

// Union type for updating lessons
type UpdateLessonRequest = 
    | ({ type: LessonType.Video } & UpdateLessonVideoRequest)
    | ({ type: LessonType.Text } & UpdateLessonTextRequest)
    | ({ type: LessonType.Quiz } & UpdateLessonQuizRequest);


export function useCreateLesson () {
    const queryClient = useQueryClient();
    const { mutateAsync, isPending } = useMutation({
        mutationFn: async (lesson: CreateLessonRequest) => {
            // Route to the correct API method based on lesson type
            switch (lesson.type) {
                case LessonType.Video: {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const { type: _type, ...videoData } = lesson;
                    return fetchLession.createVideoLesson(videoData);
                }
                case LessonType.Text: {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const { type: _type, ...textData } = lesson;
                    return fetchLession.createTextLesson(textData);
                }
                case LessonType.Quiz: {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const { type: _type, ...quizData } = lesson;
                    return fetchLession.createQuizLesson(quizData);
                }
            }
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["lessons", variables.sectionId]
            });
            toast.success("Tạo bài học thành công!");
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
        mutationFn: async ({ lessonId, lessonType, data }: { lessonId: string; lessonType: LessonType; data: Partial<UpdateLessonRequest> }) => {
            // Route to the correct API method based on lesson type
            switch (lessonType) {
                case LessonType.Video:
                    return fetchLession.updateVideoLesson(lessonId, data as UpdateLessonVideoRequest);
                case LessonType.Text:
                    return fetchLession.updateTextLesson(lessonId, data as UpdateLessonTextRequest);
                case LessonType.Quiz:
                    return fetchLession.updateQuizLesson(lessonId, data as UpdateLessonQuizRequest);
                default:
                    throw new Error(`Unsupported lesson type: ${lessonType}`);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["lessons", sectionId]
            });
            toast.success("Cập nhật bài học thành công!");
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
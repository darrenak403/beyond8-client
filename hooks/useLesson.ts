import {
    fetchLession,
    CreateLessonVideoRequest,
    CreateLessonTextRequest,
    CreateLessonQuizRequest,
    UpdateLessonVideoRequest,
    UpdateLessonTextRequest,
    UpdateLessonQuizRequest,
    LessonType,
    ActivalessonRequest,
    ReoderLessonInSectionRequest,
    ReoderLessonOtherSectionRequest,
    CreateLessonDocumentRequest,
    UpdateLessonDocumentRequest,
    Lesson,
    LessonResponse
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


export function useCreateLesson(courseId?: string) {
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
            if (courseId) {
                queryClient.invalidateQueries({
                    queryKey: ["course", "details-preview", courseId]
                });
            }
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

export function useGetLessonBySectionId(sectionId: string) {
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

export function useUpdateLesson(sectionId: string, courseId?: string) {
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
            if (courseId) {
                queryClient.invalidateQueries({
                    queryKey: ["course", "details-preview", courseId]
                });
            }
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

export function useDeleteLesson(sectionId: string, courseId: string) {
    const queryClient = useQueryClient();
    const { mutateAsync, isPending } = useMutation({
        mutationFn: (lessonId: string) => fetchLession.deleteLesson(lessonId),
        onMutate: async (lessonId: string) => {
            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries({ queryKey: ["lessons", sectionId] });

            // Snapshot the previous value
            const previousLessonsRequest = queryClient.getQueryData(["lessons", sectionId]);

            // Optimistically update to the new value
            if (previousLessonsRequest) {
                queryClient.setQueryData(["lessons", sectionId], (old: LessonResponse) => {
                    if (!old || !old.data) return old;
                    return {
                        ...old,
                        data: old.data.filter((lesson: Lesson) => lesson.id !== lessonId)
                    };
                });
            }

            // Return a context object with the snapshotted value
            return { previousLessonsRequest };
        },
        onError: (_err, _newLesson, context) => {
            // If the mutation fails, use the context returned from onMutate to roll back
            if (context?.previousLessonsRequest) {
                queryClient.setQueryData(["lessons", sectionId], context.previousLessonsRequest);
            }
            toast.error("Lỗi khi xóa bài học!");
        },
        onSettled: () => {
            // Always refetch after error or success:
            queryClient.invalidateQueries({ queryKey: ["lessons", sectionId] });
            queryClient.invalidateQueries({ queryKey: ["sections", courseId] });
            queryClient.invalidateQueries({ queryKey: ["course", "details-preview", courseId] });
        },
        onSuccess: () => {
            toast.success("Xóa bài học thành công!");
        },
    });
    return {
        deleteLesson: mutateAsync,
        isPending
    };
}

export function useActivationLesson(sectionId: string, courseId?: string) {
    const queryClient = useQueryClient();
    const { mutateAsync, isPending } = useMutation({
        mutationFn: async ({ lessonId, request }: { lessonId: string; request: ActivalessonRequest }) => fetchLession.activationLesson(lessonId, request),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["lessons", sectionId]
            });
            if (courseId) {
                queryClient.invalidateQueries({
                    queryKey: ["course", "details-preview", courseId]
                });
            }
            toast.success("Thay đổi trạng thái bài học thành công!");
        },
        onError: (error: ApiError) => {
            toast.error(error?.message || "Lỗi khi thay đổi trạng thái bài học!");
        }
    });
    return {
        activationLesson: mutateAsync,
        isPending
    };
}

export function useReorderLessonInSection(courseId?: string) {
    const queryClient = useQueryClient();
    const { mutateAsync, isPending } = useMutation({
        mutationFn: async ({ sectionId, ...request }: ReoderLessonInSectionRequest & { sectionId: string }) => {
            return fetchLession.reorderLessonInSection(request);
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["lessons", variables.sectionId]
            });
            if (courseId) {
                queryClient.invalidateQueries({
                    queryKey: ["course", "details-preview", courseId]
                });
            }
        },
        onError: (error: ApiError) => {
            toast.error(error?.message || "Lỗi khi thay đổi vị trí bài học!");
        }
    });
    return {
        reorderLessonInSection: mutateAsync,
        isPending
    };
}

export function useReorderLessonOtherSection(courseId?: string) {
    const queryClient = useQueryClient();
    const { mutateAsync, isPending } = useMutation({
        mutationFn: async ({ oldSectionId, ...request }: ReoderLessonOtherSectionRequest & { oldSectionId: string }) => {
            return fetchLession.reorderLessonOtherSection(request);
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["lessons", variables.oldSectionId]
            });
            queryClient.invalidateQueries({
                queryKey: ["lessons", variables.newSectionId]
            });
            if (courseId) {
                queryClient.invalidateQueries({
                    queryKey: ["course", "details-preview", courseId]
                });
            }
        },
        onError: (error: ApiError) => {
            toast.error(error?.message || "Lỗi khi thay đổi vị trí bài học!");
        }
    });
    return {
        reorderLessonOtherSection: mutateAsync,
        isPending
    };
}

export function useCreateLessonDocument(courseId?: string) {
    const queryClient = useQueryClient();
    const { mutateAsync, isPending } = useMutation({
        mutationFn: async (request: CreateLessonDocumentRequest) => {
            return fetchLession.createLessonDocument(request);
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["lessons", variables.lessonId]
            });
            if (courseId) {
                queryClient.invalidateQueries({
                    queryKey: ["course", "details-preview", courseId]
                });
            }
        },
        onError: (error: ApiError) => {
            toast.error(error?.message || "Lỗi khi tạo tài liệu bài học!");
        }
    });
    return {
        createLessonDocument: mutateAsync,
        isPending
    };
}

export function useGetLessonDocument(lessonId: string) {
    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ["lesson-documents", lessonId],
        queryFn: () => fetchLession.getLessonDocuments(lessonId),
        select: (data) => data.data,
    });
    return {
        lessonDocuments: data ?? [],
        isLoading,
        isError,
        refetch
    };
}


export function useUpdateLessonDocument(courseId?: string) {
    const queryClient = useQueryClient();
    const { mutateAsync, isPending } = useMutation({
        mutationFn: async ({ lessonId, ...request }: UpdateLessonDocumentRequest & { lessonId: string }) => {
            return fetchLession.updateLessonDocument(lessonId, request);
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["lesson-documents", variables.lessonId]
            });
            if (courseId) {
                queryClient.invalidateQueries({
                    queryKey: ["course", "details-preview", courseId]
                });
            }
        },
        onError: (error: ApiError) => {
            toast.error(error?.message || "Lỗi khi cập nhật tài liệu bài học!");
        }
    });
    return {
        updateLessonDocument: mutateAsync,
        isPending
    };
}

export function useDeleteLessonDocument(courseId?: string) {
    const queryClient = useQueryClient();
    const { mutateAsync, isPending } = useMutation({
        mutationFn: (id: string) => fetchLession.deleteLessonDocument(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["lesson-documents"]
            });
            if (courseId) {
                queryClient.invalidateQueries({
                    queryKey: ["course", "details-preview", courseId]
                });
            }
        },
        onError: (error: ApiError) => {
            toast.error(error?.message || "Lỗi khi xóa tài liệu bài học!");
        }
    });
    return {
        deleteLessonDocument: mutateAsync,
        isPending
    };
}

export function useToggleDownloadLessonDocument(courseId?: string) {
    const queryClient = useQueryClient();
    const { mutateAsync, isPending } = useMutation({
        mutationFn: (id: string) => fetchLession.toggleDownloadLessonDocumnet(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["lesson-documents"]
            });
            if (courseId) {
                queryClient.invalidateQueries({
                    queryKey: ["course", "details-preview", courseId]
                });
            }
        },
        onError: (error: ApiError) => {
            toast.error(error?.message || "Lỗi khi thay đổi trạng thái tải xuống của tài liệu bài học!");
        }
    });
    return {
        toggleDownloadLessonDocument: mutateAsync,
        isPending
    };
}


export function useGetVideoByLessonId(lessonId: string, options?: { enabled?: boolean }) {
    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ["lessons", lessonId, "video"],
        queryFn: () => fetchLession.getVideoByLessonId(lessonId),
        select: (data) => data.data,
        enabled: options?.enabled
    });
    return {
        video: data,
        isLoading,
        isError,
        refetch
    };
}

export function useGetLessonDocumentPreview(lessonId: string, options?: { enabled?: boolean }) {
    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ["lesson-documents", lessonId, "preview"],
        queryFn: () => fetchLession.getLessonDocumentPreview(lessonId),
        select: (data) => data.data,
        enabled: options?.enabled
    });
    return {
        lessonDocuments: data ?? [],
        isLoading,
        isError,
        refetch
    };
}

export function useGetLessonDocumentForStudent(lessonId: string, options?: { enabled?: boolean }) {
    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ["lesson-documents", lessonId, "student"],
        queryFn: () => fetchLession.getLessonDocumentForStudent(lessonId),
        select: (data) => data.data,
        enabled: options?.enabled
    });
    return {
        lessonDocuments: data ?? [],
        isLoading,
        isError,
        refetch
    };
}


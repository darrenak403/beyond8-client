import apiService from "../core";

export interface Lesson {
    id: string;
    sectionId: string;
    title: string;
    description: string;
    type: string;
    orderIndex: number;
    isPreview: boolean;
    isPublished: boolean;
    hlsVariants: string;
    videoOriginalUrl: string;
    videoThumbnailUrl: string;
    durationSeconds: number;
    videoQualities: string;
    isDownloadable: boolean;
    textContent: string | null;
    quizId: string | null;
    minCompletionSeconds: number;
    requiredScore: number;
    totalViews: number;
    totalCompletions: number;
    createdAt: string;
    updatedAt: string;
}

export enum LessonType {
    Video = "Video",
    Text = "Text",
    Quiz = "Quiz"
}

export interface CreateLessonRequest {
    sectionId: string;
    title: string;
    description: string;
    durationSeconds: number;
    isDownloadable: boolean;
    isPreview: boolean;
    minCompletionSeconds: number;
    quizId: string | null;
    requiredScore: number;
    textContent: string | null;
    type: LessonType;
    videoOriginalUrl: string | null;
}

export interface UpdateLessonRequest {
    title?: string;
    description?: string;
    durationSeconds?: number;
    hlsVariants?: string;
    isDownloadable?: boolean;
    isPreview?: boolean;
    isPublished?: boolean;
    minCompletionSeconds?: number;
    quizId?: string | null;
    requiredScore?: number;
    textContent?: string | null;
    type?: LessonType;
}

export interface LessonResponse {
    isSuccess: boolean;
    message: string;
    data: Lesson[];
    metadata: unknown;
}

export const fetchLession = {
    createLesson: async (lessonData: CreateLessonRequest): Promise<LessonResponse> => {
        const response = await apiService.post<LessonResponse>(`api/v1/lessons`, lessonData);
        return response.data;
    },

    getLessonsBySection: async (sectionId: string): Promise<LessonResponse> => {
        const response = await apiService.get<LessonResponse>(`api/v1/lessons/section/${sectionId}`);
        return response.data;
    },

    updateLesson: async (lessonId: string, lessonData: UpdateLessonRequest): Promise<LessonResponse> => {
        const response = await apiService.patch<LessonResponse>(`api/v1/lessons/${lessonId}`, lessonData);
        return response.data;
    },

    deleteLesson: async (lessonId: string): Promise<LessonResponse> => {
        const response = await apiService.delete<LessonResponse>(`api/v1/lessons/${lessonId}`);
        return response.data;
    }
}
import apiService from "../core";

export enum LessonType {
    Video = "Video",
    Text = "Text",
    Quiz = "Quiz"
}

// Base interface with common fields
interface BaseLessonFields {
    id: string;
    sectionId: string;
    title: string;
    description: string;
    orderIndex: number;
    isPreview: boolean;
    isPublished: boolean;
    totalViews: number;
    totalCompletions: number;
    createdAt: string;
    updatedAt: string;
}

// Video Lesson interface
interface VideoLesson extends BaseLessonFields {
    type: "Video";
    hlsVariants?: string | null;
    videoOriginalUrl?: string | null;
    videoThumbnailUrl?: string | null;
    durationSeconds?: number | null;
    videoQualities?: string | null;
    isDownloadable?: boolean;
}

// Text Lesson interface
interface TextLesson extends BaseLessonFields {
    type: "Text";
    textContent?: string | null;
}

// Quiz Lesson interface
interface QuizLesson extends BaseLessonFields {
    type: "Quiz";
    quizId?: string | null;
}

// Discriminated union type
export type Lesson = VideoLesson | TextLesson | QuizLesson;

export interface CreateLessonVideoRequest {
    sectionId: string;
    title: string;
    description: string;
    durationSeconds: number;
    isDownloadable: boolean;
    isPreview: boolean;
    videoOriginalUrl: string | null;
    videoThumbnailUrl: string | null;
}

export interface UpdateLessonVideoRequest {
    id?: string;
    description?: string;
    title?: string;
    hlsVariants?: string;
    durationSeconds?: number;
    isDownloadable?: boolean;
    isPreview?: boolean;
    videoOriginalUrl?: string;
    videoThumbnailUrl?: string;
    videoQualities?: string;
}

export interface CreateLessonTextRequest {
    content: string;
    sectionId: string;
    title: string;
    description: string;
    isPreview: boolean;
}

export interface UpdateLessonTextRequest {
    id?: string;
    description?: string;
    content?: string;
    title?: string;
    isPreview?: boolean;
}

export interface CreateLessonQuizRequest {
    quizId: string;
    sectionId: string;
    title: string;
    description: string;
    isPreview: boolean;
}

export interface UpdateLessonQuizRequest {
    id?: string;
    description?: string;
    title?: string;
    isPreview?: boolean;
    quizId?: string;
}

export interface ActivalessonRequest {
    isPublished: boolean;
}

export interface ReoderLessonInSectionRequest {
    lessonId: string;
    newOrderIndex: number;
}

export interface ReoderLessonOtherSectionRequest {
    lessonId: string;
    newSectionId: string;
    newOrderIndex: number;
}

export interface LessonResponse {
    isSuccess: boolean;
    message: string;
    data: Lesson[];
    metadata: unknown;
}

export const fetchLession = {
    getLessonsBySection: async (sectionId: string): Promise<LessonResponse> => {
        const response = await apiService.get<LessonResponse>(`api/v1/lessons/section/${sectionId}`);
        return response.data;
    },

    deleteLesson: async (lessonId: string): Promise<LessonResponse> => {
        const response = await apiService.delete<LessonResponse>(`api/v1/lessons/${lessonId}`);
        return response.data;
    },

    createVideoLesson: async (request: CreateLessonVideoRequest): Promise<LessonResponse> => {
        const response = await apiService.post<LessonResponse, CreateLessonVideoRequest>(`api/v1/lessons/video`, request);
        return response.data;
    },

    updateVideoLesson: async (id: string, request: UpdateLessonVideoRequest): Promise<LessonResponse> => {
        const response = await apiService.patch<LessonResponse, UpdateLessonVideoRequest>(`api/v1/lessons/${id}/video`, request);
        return response.data;
    },

    createTextLesson: async (request: CreateLessonTextRequest): Promise<LessonResponse> => {
        const response = await apiService.post<LessonResponse, CreateLessonTextRequest>(`api/v1/lessons/text`, request);
        return response.data;
    },

    updateTextLesson: async (id: string, request: UpdateLessonTextRequest): Promise<LessonResponse> => {
        const response = await apiService.patch<LessonResponse, UpdateLessonTextRequest>(`api/v1/lessons/${id}/text`, request);
        return response.data;
    },

    createQuizLesson: async (request: CreateLessonQuizRequest): Promise<LessonResponse> => {
        const response = await apiService.post<LessonResponse, CreateLessonQuizRequest>(`api/v1/lessons/quiz`, request);
        return response.data;
    },

    updateQuizLesson: async (id: string, request: UpdateLessonQuizRequest): Promise<LessonResponse> => {
        const response = await apiService.patch<LessonResponse, UpdateLessonQuizRequest>(`api/v1/lessons/${id}/quiz`, request);
        return response.data;
    },

    activationLesson: async (id: string, request: ActivalessonRequest): Promise<LessonResponse> => {
        const response = await apiService.patch<LessonResponse, ActivalessonRequest>(`api/v1/lessons/${id}/activation`, request);
        return response.data;
    },

    reorderLessonInSection: async (request: ReoderLessonInSectionRequest): Promise<LessonResponse> => {
        const response = await apiService.post<LessonResponse, ReoderLessonInSectionRequest>(`api/v1/lessons/reorder-lesson-in-section`, request);
        return response.data;
    },

    reorderLessonOtherSection: async (request: ReoderLessonOtherSectionRequest): Promise<LessonResponse> => {
        const response = await apiService.post<LessonResponse, ReoderLessonOtherSectionRequest>(`api/v1/lessons/move-lesson-to-section`, request);
        return response.data;
    },
}
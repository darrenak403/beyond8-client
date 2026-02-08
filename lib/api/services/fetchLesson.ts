import apiService from "../core";

export enum LessonType {
    Video = "Video",
    Text = "Text",
    Quiz = "Quiz"
}

// Unified Lesson interface
export interface Lesson {
    id: string;
    sectionId: string;
    title: string;
    description: string;
    type: LessonType;
    orderIndex: number;
    isPreview: boolean;
    isPublished: boolean;
    // Video lesson fields
    hlsVariants: string | null;
    videoOriginalUrl: string | null;
    videoThumbnailUrl: string | null;
    durationSeconds: number | null;
    videoQualities: string | null;
    isDownloadable: boolean;
    // Text lesson fields
    textContent: string | null;
    // Quiz lesson fields
    quizId: string | null;
    // Document fields
    documents: LessonDocument[];
    // Statistics
    totalViews: number;
    totalCompletions: number;
    createdAt: string;
    updatedAt: string;
}

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
    quizId: string | null;
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
    quizId: string | null;
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

export interface LessonDocument {
    id: string;
    lessonId: string;
    title: string;
    description: string | null;
    lessonDocumentUrl: string;
    isDownloadable: boolean;
    downloadCount: number;
    isIndexedInVectorDb: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateLessonDocumentRequest {
    lessonId: string;
    title: string;
    description: string | null;
    lessonDocumentUrl: string;
    isDownloadable: boolean;
    isIndexedInVectorDb: boolean;
}

export interface UpdateLessonDocumentRequest {
    title?: string;
    description?: string;
    lessonDocumentUrl?: string;
    isDownloadable?: boolean;
    isIndexedInVectorDb?: boolean;
}

export interface LessonDocumentResponse {
    isSuccess: boolean;
    message: string;
    data: LessonDocument[];
    metadata: unknown;
}

export interface LessonDocumentResponse {
    isSuccess: boolean;
    message: string;
    data: LessonDocument[];
    metadata: unknown;
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

    createLessonDocument: async (request: CreateLessonDocumentRequest): Promise<LessonDocumentResponse> => {
        const response = await apiService.post<LessonDocumentResponse, CreateLessonDocumentRequest>(`api/v1/lesson-documents`, request);
        return response.data;
    },

    getLessonDocuments: async (lessonId: string): Promise<LessonDocumentResponse> => {
        const response = await apiService.get<LessonDocumentResponse>(`api/v1/lesson-documents/lesson/${lessonId}`);
        return response.data;
    },

    updateLessonDocument: async (id: string, request: UpdateLessonDocumentRequest): Promise<LessonDocumentResponse> => {
        const response = await apiService.patch<LessonDocumentResponse, UpdateLessonDocumentRequest>(`api/v1/lesson-documents/${id}`, request);
        return response.data;
    },

    deleteLessonDocument: async (id: string): Promise<LessonDocumentResponse> => {
        const response = await apiService.delete<LessonDocumentResponse>(`api/v1/lesson-documents/${id}`);
        return response.data;
    },

    toggleDownloadLessonDocumnet: async (id: string): Promise<LessonDocumentResponse> => {
        const response = await apiService.patch<LessonDocumentResponse>(`api/v1/lesson-documents/${id}/toggle-downloadable`);
        return response.data;
    },
}
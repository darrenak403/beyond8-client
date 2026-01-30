import apiService from "../core";

export interface CreateSectionRequest {
    courseId: string;
    title: string;
    description: string;
    assignmentId: string
}

export interface UpdateSectionRequest {
    title?: string;
    description?: string;
    isPublished?: boolean;
    assignmentId?: string
}

export interface Section {
    id: string
    courseId: string
    title: string
    description: string
    orderIndex: number
    assignmentId: string
    isPublished: boolean
    totalLessons: number
    totalDurationMinutes: number
    createdAt: string
    updatedAt: string
}

export interface SectionResponse {
    isSuccess: boolean
    message: string
    data: Section[]
    metadata: {
        pageNumber: number
        pageSize: number
        totalItems: number
        totalPages: number
        hasNextPage: boolean
        hasPreviousPage: boolean
    }
}

export const fetchSection = {
    createSection: async (section: CreateSectionRequest): Promise<SectionResponse> => {
        const response = await apiService.post<SectionResponse>("api/v1/sections", section);
        return response.data;
    },

    getSectionByCourseId: async (courseId: string): Promise<SectionResponse> => {
        const response = await apiService.get<SectionResponse>(`api/v1/sections/course/${courseId}`);
        return response.data;
    },

    updateSection: async (sectionId: string, section: UpdateSectionRequest): Promise<SectionResponse> => {
        const response = await apiService.patch<SectionResponse>(`api/v1/sections/${sectionId}`, section);
        return response.data;
    },

    deleteSection: async (sectionId: string): Promise<SectionResponse> => {
        const response = await apiService.delete<SectionResponse>(`api/v1/sections/${sectionId}`);
        return response.data;
    }
}
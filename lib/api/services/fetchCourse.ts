import apiService, { RequestParams } from "../core"
import { Metadata } from "./fetchUsers"

export enum CourseLevel {
    Beginner = "Beginner",
    Intermediate = "Intermediate",
    Advanced = "Advanced",
    Expert = "Expert",
    All = "All"
}

export enum CourseStatus {
    Draft = "Draft",
    PendingApproval = "PendingApproval",
    Approved = "Approved",
    Rejected = "Rejected",
    Published = "Published",
    Archived = "Archived",
    Suspended = "Suspended"
}

export interface Course {
    id: string
    title: string
    slug: string
    shortDescription: string
    categoryId: string
    categoryName: string
    instructorId: string
    instructorName: string
    status: CourseStatus
    level: CourseLevel
    language: string
    price: number
    thumbnailUrl: string
    totalStudents: number
    totalSections: number
    totalLessons: number
    totalDurationMinutes: number
    avgRating: string;
    totalReviews: number
    outcomes?: string[]
    requirements?: string[]
    targetAudience?: string[]
    createdAt: string
    updatedAt: string
}

export interface CourseRequest {
    title: string
    description: string
    shortDescription: string
    categoryId: string
    level: string
    language: string
    price: number
    thumbnailUrl: string
    outcomes: string[]
    requirements: string[]
    targetAudience: string[]
}

export interface CourseUpdateRequest {
    categoryId?: string
    title?: string
    description?: string
    language?: string
    level?: CourseLevel
    outcomes?: string[]
    price?: number
    requirements?: string[]
    shortDescription?: string
    targetAudience?: string[]
    thumbnailUrl?: string
}

export interface CourseResponse {
    isSuccess: boolean
    message: string
    data: Course[]
    metadata: Metadata
}

export interface CourseParams {
    keyword?: string
    categoryName?: string
    instructorId?: string
    status?: CourseStatus
    level: CourseLevel
    language?: string
    minPrice?: number
    maxPrice?: number
    minRating?: number
    minStudents?: number
    isActive?: boolean
    isRandom?: boolean
    pageNumber?: number
    pageSize?: number
    isDescending?: boolean
    sortBy?: string
}

const convertParamsToQuery = (params?: CourseParams): RequestParams => {
    if (!params) return {};
    const query: RequestParams = {};
    if (params.keyword) query.keyword = params.keyword;
    if (params.categoryName) query.categoryName = params.categoryName;
    if (params.instructorId) query.instructorId = params.instructorId;
    if (params.status) query.status = params.status;
    if (params.level) query.level = params.level;
    if (params.language) query.language = params.language;
    if (params.minPrice) query.minPrice = params.minPrice;
    if (params.maxPrice) query.maxPrice = params.maxPrice;
    if (params.minRating) query.minRating = params.minRating;
    if (params.minStudents) query.minStudents = params.minStudents;
    if (params.isActive) query.isActive = params.isActive;
    if (params.isRandom) query.isRandom = params.isRandom;
    if (params.pageNumber) query.pageNumber = params.pageNumber;
    if (params.pageSize) query.pageSize = params.pageSize;
    if (params.isDescending) query.isDescending = params.isDescending;
    if (params.sortBy) query.sortBy = params.sortBy;
    return query;
}


export const fetchCourse = {
    createNewCourse: async (course: CourseRequest): Promise<CourseResponse> => {
        const response = await apiService.post<CourseResponse>("api/v1/courses", course);
        return response.data;
    },

    getCourseByInstructor: async (filterParams?: CourseParams): Promise<CourseResponse> => {
        const params = convertParamsToQuery(filterParams);
        const response = await apiService.get<CourseResponse>("api/v1/courses/instructor", params);
        return response.data;
    },

    getCourseById: async (id: string): Promise<CourseResponse> => {
        const response = await apiService.get<CourseResponse>(`api/v1/courses/${id}`);
        return response.data;
    },

    updateCourse: async (id: string, courseData: CourseUpdateRequest): Promise<CourseResponse> => {
        const response = await apiService.patch<CourseResponse>(`api/v1/courses/${id}/metadata`, courseData);
        return response.data;
    }
}
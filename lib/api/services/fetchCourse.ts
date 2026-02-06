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

export enum LessonType {
    Video = "Video",
    Quiz = "Quiz",
    Text = "Text",
    Assignment = "Assignment"
}

export interface Course {
    id: string
    title: string
    slug: string
    shortDescription: string
    // Pricing
    discountPercent: number | null
    discountAmount: number | null
    discountEndsAt: string | null
    finalPrice: number
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

export interface PublicCourseParams {
    keyword?: string
    categoryName?: string
    instructorName?: string
    level?: CourseLevel
    language?: string
    minPrice?: number
    maxPrice?: number
    minRating?: number
    minStudents?: number
    isDescendingPrice?: boolean
    isRandom?: boolean
    pageNumber?: number
    pageSize?: number
    isDescending?: boolean
}

// Params for search endpoint: /api/v1/courses/search
export interface SearchCourseParams {
    keyword?: string
    pageNumber?: number
    pageSize?: number
    isDescending?: boolean
}

export interface PublicCourseResponse {
    isSuccess: boolean
    message: string
    data: Course[]
    metadata: Metadata | null
}

export interface Lesson {
    id: string
    title: string
    description: string | null
    type: LessonType
    order: number
    isPreview: boolean
    durationSeconds: number | null
    videoThumbnailUrl: string | null
    quizId: string | null
    hasTextContent: boolean
}

export interface Section {
    id: string
    title: string
    description: string | null
    order: number
    totalLessons: number
    totalDurationMinutes: number
    lessons: Lesson[]
}

export interface CourseSummary {
    id: string
    title: string
    slug: string
    shortDescription: string | null
    // Pricing
    discountPercent: number | null
    discountAmount: number | null
    discountEndsAt: string | null
    finalPrice: number
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
    avgRating: string | null
    totalReviews: number
    outcomes?: string[]
    requirements?: string[]
    targetAudience?: string[]
    documents: CourseDocument[]
    createdAt: string
    updatedAt: string | null
    sections: Section[]
}

export interface CourseSummaryResponse {
    isSuccess: boolean
    message: string
    data: CourseSummary
    metadata: Metadata | null
}

export interface LessonDetail {
    id: string
    sectionId: string
    title: string
    description: string | null
    type: LessonType
    orderIndex: number
    isPreview: boolean
    isPublished: boolean
    hlsVariants: string | null
    videoOriginalUrl: string | null
    durationSeconds?: number | null
    videoThumbnailUrl?: string | null
    quizId?: string | null
    hasTextContent?: boolean
    textContent?: string | null
    [key: string]: unknown // For additional properties
}

export interface SectionDetail {
    id: string
    courseId: string
    title: string
    description: string | null
    orderIndex: number
    isPublished: boolean
    totalLessons: number
    totalDurationMinutes: number
    assignmentId: string | null
    lessons: LessonDetail[]
    [key: string]: unknown // For additional properties
}

export interface CourseDetail {
    id: string
    title: string
    slug: string
    shortDescription: string | null
    // Pricing
    discountPercent: number | null
    discountAmount: number | null
    discountEndsAt: string | null
    finalPrice: number
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
    avgRating: string | null
    totalReviews: number
    outcomes?: string[]
    requirements?: string[]
    targetAudience?: string[]
    documents: CourseDocument[]
    createdAt: string
    updatedAt: string | null
    sections: SectionDetail[]
}


export interface CourseDocument {
    id: string
    courseId: string
    title: string
    description: string | null
    courseDocumentUrl: string
    isDownloadable: boolean
    downloadCount: number
    isIndexedInVectorDb: boolean
    createdAt: string
    updatedAt: string | null
}

export interface CreateCourseDocumentRequest {
    courseDocumentUrl: string
    courseId: string
    title: string
    description: string | null
    isDownloadable: boolean
}

export interface UpdateCourseDocumentRequest {
    title?: string
    description?: string | null
    courseDocumentUrl?: string
    isDownloadable?: boolean
}

export interface CourseDocumentResponse {
    isSuccess: boolean
    message: string
    data: CourseDocument[]
    metadata: Metadata | null
}

// Course Review Interfaces
export interface CourseReview {
    id: string
    courseId: string
    userId: string
    enrollmentId: string
    rating: number
    review: string | null
    contentQuality: number | null
    instructorQuality: number | null
    valueForMoney: number | null
    isVerifiedPurchase: boolean
    isPublished: boolean
    helpfulCount: number
    notHelpfulCount: number
    isFlagged: boolean
    flagReason: string | null
    moderatedBy: string | null
    moderatedAt: string | null
    createdAt: string
}

export interface CourseReviewParams {
    courseId: string
    pageNumber?: number
    pageSize?: number
    isDescending?: boolean
}

export interface CreateCourseReviewRequest {
    courseId: string
    enrollmentId: string
    rating: number
    review: string | null
    contentQuality: number | null
    instructorQuality: number | null
    valueForMoney: number | null
}

export interface CourseReviewResponse {
    isSuccess: boolean
    message: string
    data: CourseReview
    metadata: Metadata | null
}

export interface CourseReviewListResponse {
    isSuccess: boolean
    message: string
    data: CourseReview[]
    metadata: Metadata | null
}

export interface CourseDetailResponse {
    isSuccess: boolean
    message: string
    data: CourseDetail
    metadata: Metadata | null
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

const convertPublicCourseParamsToQuery = (params?: PublicCourseParams): RequestParams => {
    if (!params) return {};
    const query: RequestParams = {};
    if (params.keyword) query.keyword = params.keyword;
    if (params.categoryName) query.categoryName = params.categoryName;
    if (params.instructorName) query.instructorName = params.instructorName;
    if (params.level) query.level = params.level;
    if (params.language) query.language = params.language;
    if (params.minPrice) query.minPrice = params.minPrice;
    if (params.maxPrice) query.maxPrice = params.maxPrice;
    if (params.minRating) query.minRating = params.minRating;
    if (params.minStudents) query.minStudents = params.minStudents;
    if (params.isDescendingPrice !== undefined) query.isDescendingPrice = params.isDescendingPrice;
    if (params.isRandom) query.isRandom = params.isRandom;
    if (params.pageNumber) query.pageNumber = params.pageNumber;
    if (params.pageSize) query.pageSize = params.pageSize;
    if (params.isDescending) query.isDescending = params.isDescending;
    return query;
}

const convertSearchCourseParamsToQuery = (params?: SearchCourseParams): RequestParams => {
    if (!params) return {};
    const query: RequestParams = {};
    if (params.keyword) query.keyword = params.keyword;
    if (params.pageNumber) query.pageNumber = params.pageNumber;
    if (params.pageSize) query.pageSize = params.pageSize;
    if (params.isDescending !== undefined) query.isDescending = params.isDescending;
    return query;
}


export const fetchCourse = {
    createNewCourse: async (course: CourseRequest): Promise<CourseResponse> => {
        const response = await apiService.post<CourseResponse>("api/v1/courses", course);
        return response.data;
    },

    getCourses: async (filterParams?: PublicCourseParams): Promise<PublicCourseResponse> => {
        const params = convertPublicCourseParamsToQuery(filterParams);
        const response = await apiService.get<PublicCourseResponse>("api/v1/courses", params);
        return response.data;
    },

    // Search courses by keyword with pagination and sort
    searchCourses: async (filterParams?: SearchCourseParams): Promise<PublicCourseResponse> => {
        const params = convertSearchCourseParamsToQuery(filterParams);
        const response = await apiService.get<PublicCourseResponse>("api/v1/courses/search", params);
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

    getCourseSummary: async (id: string): Promise<CourseSummaryResponse> => {
        const response = await apiService.get<CourseSummaryResponse>(`api/v1/courses/${id}/summary`);
        return response.data;
    },

    getCourseDetails: async (id: string): Promise<CourseDetailResponse> => {
        const response = await apiService.get<CourseDetailResponse>(`api/v1/courses/${id}/details`);
        return response.data;
    },

    getCourseDetailsPreview: async (id: string): Promise<CourseDetailResponse> => {
        const response = await apiService.get<CourseDetailResponse>(`api/v1/courses/${id}/admin-details`);
        return response.data;
    },

    updateCourse: async (id: string, courseData: CourseUpdateRequest): Promise<CourseResponse> => {
        const response = await apiService.patch<CourseResponse>(`api/v1/courses/${id}/metadata`, courseData);
        return response.data;
    },

    createCourseDocument: async (courseDocument: CreateCourseDocumentRequest): Promise<CourseDocumentResponse> => {
        const response = await apiService.post<CourseDocumentResponse>(`api/v1/course-documents`, courseDocument);
        return response.data;
    },

    getCourseDocument: async (courseId: string): Promise<CourseDocumentResponse> => {
        const response = await apiService.get<CourseDocumentResponse>(`api/v1/course-documents/course/${courseId}`);
        return response.data;
    },

    updateCourseDocument: async (id: string, request: UpdateCourseDocumentRequest): Promise<CourseDocumentResponse> => {
        const response = await apiService.patch<CourseDocumentResponse>(`api/v1/course-documents/${id}`, request);
        return response.data;
    },

    deleteCourseDocument: async (id: string): Promise<CourseDocumentResponse> => {
        const response = await apiService.delete<CourseDocumentResponse>(`api/v1/course-documents/${id}`);
        return response.data;
    },

    toggleDownloadCourseDocument: async (id: string): Promise<CourseDocumentResponse> => {
        const response = await apiService.patch<CourseDocumentResponse>(`api/v1/course-documents/${id}/toggle-downloadable`);
        return response.data;
    },

    // Course Reviews
    getCourseReviews: async (params: CourseReviewParams): Promise<CourseReviewListResponse> => {
        const query: RequestParams = {
            courseId: params.courseId,
        };
        if (params.pageNumber !== undefined) query.pageNumber = params.pageNumber;
        if (params.pageSize !== undefined) query.pageSize = params.pageSize;
        if (params.isDescending !== undefined) query.isDescending = params.isDescending;
        
        const response = await apiService.get<CourseReviewListResponse>("api/v1/course-reviews", query);
        return response.data;
    },

    createCourseReview: async (review: CreateCourseReviewRequest): Promise<CourseReviewResponse> => {
        const response = await apiService.post<CourseReviewResponse>("api/v1/course-reviews", review);
        return response.data;
    },

}
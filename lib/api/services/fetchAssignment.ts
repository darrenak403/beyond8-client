import apiService, { RequestParams } from '../core'
import type { ApiResponse } from '@/types/api'

export enum SubmissionType {
    Text = 'Text',
    File = 'File',
    Both = 'Both',
}

export enum GradingMode {
    AiAssisted = 'AiAssisted',
}

export interface Attachment {
    name: string
    url: string
}

export interface CreateAssignmentRequest {
    courseId: string | null
    sectionId: string | null
    title: string
    description: string
    attachmentUrls: Attachment[]
    submissionType: SubmissionType | string
    allowedFileTypes: string[]
    maxTextLength: number | null
    gradingMode: GradingMode | string
    totalPoints: number
    passScorePercent: number
    rubricUrl: string | null
    timeLimitMinutes: number | null
    maxSubmissions: number
}

export interface UpdateAssignmentRequest {
    courseId: string | null
    sectionId: string | null
    title: string
    description: string
    attachmentUrls: Attachment[]
    submissionType: SubmissionType | string
    allowedFileTypes: string[]
    maxTextLength: number | null
    gradingMode: GradingMode | string
    totalPoints: number
    passScorePercent: number
    rubricUrl: string | null
    timeLimitMinutes: number | null
    maxSubmissions: number
}

export interface Assignment {
    id: string
    instructorId: string
    courseId: string | null
    sectionId: string | null
    title: string
    totalSubmissions: number
    averageScore: number | null
    createdAt: string
    updatedAt: string
    rubricUrl: string | null
    totalPoints: number
    passScorePercent: number
    timeLimitMinutes: number | null
    maxTextLength: number | null
    allowedFileTypes: string[]
    description: string
    attachmentUrls: Attachment[]
    submissionType: SubmissionType | string
    gradingMode: GradingMode | string
    maxSubmissions: number
}

export interface SubmissionAssigment {
    id: string
    studentId: string
    assignmentId: string
    submissionNumber: number
    submittedAt: string
    textContent: string
    fileUrls: string[]
    aiScore: number | null
    aiFeedback: string | null
    finalScore: number | null
    instructorFeedback: string | null
    gradedBy: string | null
    gradedAt: string | null
    status: string
    submissionType: SubmissionType | string
    createdAt: string
    updatedAt: string | null
}

export interface SubmissionAssigmentRequest {
    textContent: string
    fileUrls: string[]
}

export interface GradeAssignmentRequest {
    finalScore: number
    instructorFeedback: string | null
}

export interface SubmissionAssigmentResponse {
    isSuccess: boolean
    message: string
    data: SubmissionAssigment[]
    metadata: null | unknown
}

export interface AssignmentSummary {
    assignmentId: string
    assignmentTitle: string
    totalSubmissions: number
    ungradedSubmissions: number
    submissions: SubmissionAssigment[]
}

export interface GetSubmissionAssigmentResponse {
    isSuccess: boolean
    message: string
    data: AssignmentSummary[]
    metadata: null | unknown
}

export interface SubmissionAssigmentSummary {
    sectionId: string
    totalSubmissions: number
    ungradedSubmissions: number
}

export interface GetSubmissionAssigmentSummaryResponse {
    isSuccess: boolean
    message: string
    data: {
        sections: SubmissionAssigmentSummary[]
        totalUngradedSections: number
        totalAssignments: number
    }
    metadata: null | unknown
}

export interface ParamsAssignment {
    courseId: string
    sectionId: string
    pageNumber: number
    pageSize: number
    isDescending: boolean
}

export interface CreateAssignmentResponse extends ApiResponse<Assignment> {
    isSuccess: boolean
    message: string
    data: Assignment
    metadata: null | unknown
}

export interface UpdateAssignmentResponse extends ApiResponse<Assignment> {
    isSuccess: boolean
    message: string
    data: Assignment
    metadata: null | unknown
}

export interface GetAssignmentResponse {
    isSuccess: boolean
    message: string
    data: Assignment[]
    metadata: null | unknown
}

export interface AssignmentResponse {
    isSuccess: boolean
    message: string
    data: Assignment
    metadata: null | unknown
}


const convertAssignmentParamsToQuery = (params: ParamsAssignment): RequestParams => {
    const query: RequestParams = {}
    if (params.courseId) query.courseId = params.courseId
    if (params.sectionId) query.sectionId = params.sectionId
    if (params.pageNumber) query.pageNumber = params.pageNumber
    if (params.pageSize) query.pageSize = params.pageSize
    if (params.isDescending !== undefined) query.isDescending = params.isDescending
    return query
}


export const assignmentService = {
    createAssignment: async (data: CreateAssignmentRequest): Promise<AssignmentResponse> => {
        const response = await apiService.post<AssignmentResponse, CreateAssignmentRequest>('api/v1/assignments', data)
        return response.data
    },

    updateAssignment: async (id: string, data: UpdateAssignmentRequest): Promise<AssignmentResponse> => {
        const response = await apiService.put<AssignmentResponse, UpdateAssignmentRequest>(`api/v1/assignments/${id}`, data)
        return response.data
    },

    getAssignmentById: async (id: string): Promise<AssignmentResponse> => {
        const response = await apiService.get<AssignmentResponse>(`api/v1/assignments/${id}`)
        return response.data
    },

    getAllAssignment: async (params: ParamsAssignment): Promise<GetAssignmentResponse> => {
        const response = await apiService.get<GetAssignmentResponse>(`api/v1/assignments`, convertAssignmentParamsToQuery(params))
        return response.data
    },

    deleteAssignment: async (id: string): Promise<AssignmentResponse> => {
        const response = await apiService.delete<AssignmentResponse>(`api/v1/assignments/${id}`)
        return response.data
    },

    //Lấy assignment theo ID cho học sinh
    getAssignmentByIdForStudent: async (id: string): Promise<AssignmentResponse> => {
        const response = await apiService.get<AssignmentResponse>(`api/v1/assignments/${id}/student`)
        return response.data
    },

    //Tạo submission cho assignment
    submitAssignment: async (assignmentId: string, data: SubmissionAssigmentRequest): Promise<SubmissionAssigmentResponse> => {
        const response = await apiService.post<SubmissionAssigmentResponse, SubmissionAssigmentRequest>(`api/v1/assignment-submissions/${assignmentId}`, data)
        return response.data
    },


    //Lấy danh sách submission theo assignment ID
    getSubmissionAssigment: async (assignmentId: string): Promise<SubmissionAssigmentResponse> => {
        const response = await apiService.get<SubmissionAssigmentResponse>(`api/v1/assignment-submissions/assignment/${assignmentId}/student`)
        return response.data
    },

    //Chấm điểm submission bởi giảng viên
    gradeAssignment: async (submissionId: string, data: GradeAssignmentRequest): Promise<SubmissionAssigmentResponse> => {
        const response = await apiService.patch<SubmissionAssigmentResponse, GradeAssignmentRequest>(`api/v1/assignment-submissions/${submissionId}/instructor-grade`, data)
        return response.data
    },

    //Lấy tổng quan submissions theo sections cho giảng viên
    getSubmissionOverviewByCourse: async (courseId: string): Promise<GetSubmissionAssigmentSummaryResponse> => {
        const response = await apiService.get<GetSubmissionAssigmentSummaryResponse>(`api/v1/assignment-submissions/course/${courseId}/summary`)
        return response.data
    },

    //Lấy chi tiết các assignments và submissions theo section ID
    getSubmissionOverviewBySection: async (sectionId: string): Promise<GetSubmissionAssigmentResponse> => {
        const response = await apiService.get<GetSubmissionAssigmentResponse>(`/api/v1/assignment-submissions/courses/sections/${sectionId}`)
        return response.data
    },

}
import apiService, { RequestParams } from "../core";
import { Metadata } from "./fetchUsers";


export interface ReassignParams {
    pageNumber: number;
    pageSize: number;
    isDecending: boolean;
}

const convertParamToQuery = (params: ReassignParams): RequestParams => {
    const query: RequestParams = {}
    if (params.pageNumber) {
        query.pageNumber = params.pageNumber;
    }
    if (params.pageSize) {
        query.pageSize = params.pageSize;
    }
    if (params.isDecending) {
        query.isDecending = params.isDecending;
    }
    return query;
}

export interface Reassign {
    id: string;
    type: string;
    sourceId: string
    sourceTitle: string
    studentId: string
    reason: string
    note: string | null
    requestedAt: string
    status: string
}

export enum ReassignReason {
    TechnicalIssue = "TechnicalIssue",
    UnfairGrading = "UnfairGrading",
    NeedMorePractice = "NeedMorePractice",
    Other = "Other",
}

export interface RequestReassignQuiz {
    note: string | null
    reason: ReassignReason
}

export interface ReassignResponse {
    isSuccess: boolean;
    message: string;
    data: Reassign[];
    metadata: Metadata;
}

export const fetchRassign = {
    //Instructor xem tổng quan yêu cầu reassign (pending), có phân trang và tìm kiếm. Duyệt qua 2 endpoint reset bên dưới
    getReassignRequests: async (params: ReassignParams): Promise<ReassignResponse> => {
        const response = await apiService.get<ReassignResponse>("api/v1/reassign/instructor/overview", convertParamToQuery(params));
        return response.data;
    },

    //Học sinh yêu cầu reassign (reset lượt làm) quiz
    requestReassignQuiz: async (quizId: string, request: RequestReassignQuiz): Promise<ReassignResponse> => {
        const response = await apiService.post<ReassignResponse>(`api/v1/reassign/quiz/${quizId}/request`, request);
        return response.data;
    },

    //Học sinh yêu cầu reassign (reset lượt nộp) assignment
    requestReassignAssignment: async (assignmentId: string, request: RequestReassignQuiz): Promise<ReassignResponse> => {
        const response = await apiService.post<ReassignResponse>(`api/v1/reassign/assignment/${assignmentId}/request`, request);
        return response.data;
    },

    //Instructor reset lượt làm quiz cho student để làm lại
    resetQuiz: async (quizId: string, studentId: string): Promise<ReassignResponse> => {
        const response = await apiService.post<ReassignResponse>(`api/v1/reassign/quiz/${quizId}/reset/${studentId}`);
        return response.data;
    },

    //Instructor reset lượt nộp assignment cho student để nộp lại
    resetAssignment: async (assignmentId: string, studentId: string): Promise<ReassignResponse> => {
        const response = await apiService.post<ReassignResponse>(`api/v1/reassign/assignment/${assignmentId}/reset/${studentId}`);
        return response.data;
    },
}
import apiService, { RequestParams } from "../core";

export interface UserResponse {
    isSuccess: boolean;
    message: string;
    data: User[];
    metadata: Metadata;
}

export interface User {
    id: string;
    email: string;
    passwordHash: string;
    role: string[];
    fullName: string;
    avatarUrl: string;
    phoneNumber: string;
    isActive: boolean;
    isEmailVerified: boolean;
    lastLoginAt: string;
    timezone: string;
    locale: string;
    status: string;
}

export interface Metadata {
    pageNumber: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export interface UserParams {
    pageNumber: number;
    pageSize: number;
    isDescending: boolean;
}

const convertUserParamsToQuery = (params?: UserParams): RequestParams => {
    if (!params) return {};
    const query: RequestParams = {};
    if (params.pageNumber) query.pageNumber = params.pageNumber;
    if (params.pageSize) query.pageSize = params.pageSize;
    if (params.isDescending) query.isDescending = params.isDescending;
    return query;
}

export const fetchUsers = {
    getAll: async (filterParams?: UserParams): Promise<UserResponse> => {
        const params = convertUserParamsToQuery(filterParams);
        const response = await apiService.get<UserResponse>("/api/v1/users", params);
        return response.data;
    }
}
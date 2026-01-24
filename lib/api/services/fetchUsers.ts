import apiService, { RequestParams } from "../core";

export enum Role {
    Admin = "Admin",
    Instructor = "Giảng viên",
    Student = "Học sinh",
    Staff = "Nhân viên"
}

export interface AddUserRequest {
    avatarUrl: string;
    coverUrl: string;
    dateOfBirth: string;
    email: string;
    fullName: string;
    locale: string;
    password: string;
    phoneNumber: string;
    roles: string[];
    timezone: string;
}

export interface UpdateUserRequest {
    roles: string[];
}

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
    roles: string[];
    fullName: string;
    avatarUrl: string;
    coverUrl?: string;
    phoneNumber: string;
    dateOfBirth?: string;
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
    fullName?: string;
}

const convertUserParamsToQuery = (params?: UserParams): RequestParams => {
    if (!params) return {};
    const query: RequestParams = {};
    if (params.pageNumber) query.pageNumber = params.pageNumber;
    if (params.pageSize) query.pageSize = params.pageSize;
    if (params.isDescending !== undefined) query.isDescending = params.isDescending;
    if (params.fullName) query.fullName = params.fullName;
    return query;
}

export const fetchUsers = {
    getAll: async (filterParams?: UserParams): Promise<UserResponse> => {
        const params = convertUserParamsToQuery(filterParams);
        const response = await apiService.get<UserResponse>("/api/v1/users", params);
        return response.data;
    },

    addUser: async (user: AddUserRequest): Promise<UserResponse> => {
        const response = await apiService.post<UserResponse>("/api/v1/users", user);
        return response.data;
    },

    updateUser: async (id: string, roles: string[]): Promise<UserResponse> => {
        const response = await apiService.patch<UserResponse>(`/api/v1/users/${id}/roles`, { roles });
        return response.data;
    },

    deleteUser: async (id: string): Promise<any> => {
        const response = await apiService.delete<any>(`/api/v1/users/${id}`);
        return response.data;
    },

    updateUserStatus: async (id: string): Promise<UserResponse> => {
        const response = await apiService.patch<UserResponse>(`/api/v1/users/${id}/toggle-status`);
        return response.data;
    }
}

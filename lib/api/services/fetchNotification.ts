import type { ApiResponse } from "@/types/api";
import apiService, { RequestParams } from "../core";

export enum NotificationStatus {
  Pending = "Pending",
  Delivered = "Delivered",
  Failed = "Failed",
}

export enum NotificationChannel {
  App = "App",
  Email = "Email",
  Other = "Other",
}

export interface NotificationParams {
  status?: NotificationStatus;
  channel?: NotificationChannel;
  isRead?: boolean;
  pageNumber?: number;
  pageSize?: number;
  isDescending?: boolean;
}

const convertParamsToQuery = (params: NotificationParams): RequestParams => {
  if (!params) return {};
  const query: RequestParams = {};
  if (params.status) query.Status = params.status;
  if (params.channel) query.Channel = params.channel;
  if (params.isRead !== undefined) query.IsRead = params.isRead;
  if (params.pageNumber) query.PageNumber = params.pageNumber;
  if (params.pageSize) query.PageSize = params.pageSize;
  if (params.isDescending !== undefined) query.IsDescending = params.isDescending;
  return query;
};

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  userId: string;
  target: string;
  status: string;
  channels: string[];
  readAt: string | null;
  isRead: boolean | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface NotificationStatusData {
  isRead: boolean;
  unreadCount: number;
}

export interface NotificationLogItem {
  id: string;
  userId: string;
  target: string;
  status: string;
  channels: string[];
  readAt: string | null;
  isRead: boolean | null;
  context: string;
  createdAt: string;
  updatedAt: string | null;
}

export const notificationService = {
  getStudentNotifications: async (
    params: NotificationParams
  ): Promise<ApiResponse<NotificationItem[]>> => {
    const query = convertParamsToQuery(params);
    const response = await apiService.get<ApiResponse<NotificationItem[]>>(
      "api/v1/notifications/student",
      query
    );
    return response.data;
  },

  getInstructorNotifications: async (
    params: NotificationParams
  ): Promise<ApiResponse<NotificationItem[]>> => {
    const query = convertParamsToQuery(params);
    const response = await apiService.get<ApiResponse<NotificationItem[]>>(
      "api/v1/notifications/instructor",
      query
    );
    return response.data;
  },

  getStaffNotifications: async (
    params: NotificationParams
  ): Promise<ApiResponse<NotificationItem[]>> => {
    const query = convertParamsToQuery(params);
    const response = await apiService.get<ApiResponse<NotificationItem[]>>(
      "api/v1/notifications/staff",
      query
    );
    return response.data;
  },

  markReadAll: async (): Promise<ApiResponse<boolean>> => {
    const response = await apiService.put<ApiResponse<boolean>>(
      "api/v1/notifications/instructor/read-all",
      {}
    );
    return response.data;
  },

  markAllReadStudent: async (): Promise<ApiResponse<boolean>> => {
    const response = await apiService.put<ApiResponse<boolean>>(
      "api/v1/notifications/student/read-all",
      {}
    );
    return response.data;
  },

  deleteNotification: async (id: string): Promise<ApiResponse<boolean>> => {
    const response = await apiService.delete<ApiResponse<boolean>>(
      `api/v1/notifications/${id}`
    );
    return response.data;
  },

  deleteAllNotifications: async (): Promise<ApiResponse<boolean>> => {
    const response = await apiService.delete<ApiResponse<boolean>>(
      "api/v1/notifications/student/delete-all"
    );
    return response.data;
  },

  deleteInstructorNotifications : async (): Promise<ApiResponse<boolean>> => {
    const response = await apiService.delete<ApiResponse<boolean>>(
      "api/v1/notifications/instructor/delete-all"
    );
    return response.data;
  },

  getNotificationStatus: async (): Promise<ApiResponse<NotificationStatusData>> => {
    const response = await apiService.get<ApiResponse<NotificationStatusData>>(
      "api/v1/notifications/instructor/status"
    );
    return response.data;
  },

  getStudentNotificationStatus: async (): Promise<ApiResponse<NotificationStatusData>> => {
    const response = await apiService.get<ApiResponse<NotificationStatusData>>(
      "api/v1/notifications/student/status"
    );
    return response.data;
  },

  getStaffNotificationStatus: async (): Promise<ApiResponse<NotificationStatusData>> => {
    const response = await apiService.get<ApiResponse<NotificationStatusData>>(
      "api/v1/notifications/staff/status"
    );
    return response.data;
  },

  getAdminNotificationLogs: async (
    params: NotificationParams
  ): Promise<ApiResponse<NotificationLogItem[]>> => {
    const query = convertParamsToQuery(params);
    const response = await apiService.get<ApiResponse<NotificationLogItem[]>>(
      "api/v1/notifications/admin/logs",
      query
    );
    return response.data;
  },
};

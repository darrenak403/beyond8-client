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

export interface Notification {
  id: string;
  title: string;
  message: string;
  status: NotificationStatus;
  channel: NotificationChannel;
  isRead: boolean;
  createdAt: string;
  type?: string; 

}

export interface NotificationResponse {
  notifications: NotificationItem[];
  totalCount: number;
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

export interface PaginatedNotifications {
  items: NotificationItem[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

export interface InstructorNotificationsData {
  userNotifications: PaginatedNotifications;
  instructorNotifications: PaginatedNotifications;
}

export interface NotificationStatusData {
  isRead: boolean;
  unreadCount: number;
}




export const notificationService = {
  getMyNotifications: async (
    params: NotificationParams
  ): Promise<ApiResponse<NotificationItem[]>> => {
    const query = convertParamsToQuery(params);
    const response = await apiService.get<ApiResponse<NotificationItem[]>>(
      "/api/v1/notifications/my-notifications",
      query
    );
    return response.data;
  },

  getInstructorNotifications: async (
    params: NotificationParams
  ): Promise<ApiResponse<InstructorNotificationsData>> => {
    const query = convertParamsToQuery(params);
    const response = await apiService.get<ApiResponse<InstructorNotificationsData>>(
      "/api/v1/notifications/instructor-notifications",
      query
    );
    return response.data;
  },

  markAllRead: async (): Promise<ApiResponse<boolean>> => {
    const response = await apiService.put<ApiResponse<boolean>>(
      "/api/v1/notifications/read-all",
      {}
    );
    return response.data;
  },

  deleteNotification: async (id: string): Promise<ApiResponse<boolean>> => {
    const response = await apiService.delete<ApiResponse<boolean>>(
      `/api/v1/notifications/${id}`
    );
    return response.data;
  },

  deleteAllNotifications: async (): Promise<ApiResponse<boolean>> => {
    const response = await apiService.delete<ApiResponse<boolean>>(
      "/api/v1/notifications/delete-all"
    );
    return response.data;
  },

  getNotificationStatus: async (): Promise<ApiResponse<NotificationStatusData>> => {
    const response = await apiService.get<ApiResponse<NotificationStatusData>>(
      "/api/v1/notifications/status"
    );
    return response.data;
  },
};

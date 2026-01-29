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
  sender?: {
      name: string;
      avatar: string;
  }
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
  updatedAt: string;
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




export const notificationService = {
  getMyNotifications: async (
    params: NotificationParams
  ): Promise<ApiResponse<NotificationResponse>> => {
    const query = convertParamsToQuery(params);
    const response = await apiService.get<ApiResponse<NotificationResponse>>(
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
      "/api/v1/notifications/read",
      {}
    );
    return response.data;
  },
};

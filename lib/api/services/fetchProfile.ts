import type { ApiResponse } from "@/types/api";
import apiService from "../core";

export interface SubscriptionPlan {
  code: string;
  name: string;
  description: string | null;
  price: number;
  currency: string;
  durationDays: number;
  totalRequestsInPeriod: number;
  maxRequestsPerWeek: number;
  includes: string[];
}

export interface Subscription {
  remainingRequests: number;
  isRequestLimitedReached: boolean;
  requestLimitedEndsAt: string | null;
  subscriptionPlan: SubscriptionPlan;
}

export interface UserProfile {
  id: string;
  email: string;
  passwordHash: string;
  roles: string[];
  fullName: string;
  avatarUrl: string | null;
  coverUrl: string | null;
  phoneNumber: string | null;
  dateOfBirth: string | null;
  specialization: string | null;
  address: string | null;
  bio: string | null;
  isActive: boolean;
  isEmailVerified: boolean;
  lastLoginAt: string | null;
  timezone: string;
  locale: string;
  status: "Active" | "Inactive" | "Suspended";
  subscription: Subscription | null;
}

export interface UpdateUserProfileRequest {
  fullName?: string;
  phoneNumber?: string;
  dateOfBirth?: string | null;
  specialization?: string | null;
  address?: string | null;
  bio?: string | null;
  timezone?: string;
  locale?: string;
}

export const userService = {
  // Get current user profile
  getMe: async (): Promise<ApiResponse<UserProfile>> => {
    const response = await apiService.get<ApiResponse<UserProfile>>("api/v1/users/me");
    return response.data;
  },

  // Update user profile
  updateProfile: async (data: UpdateUserProfileRequest): Promise<ApiResponse<UserProfile>> => {
    const response = await apiService.put<ApiResponse<UserProfile>>("api/v1/users/me", data);
    return response.data;
  },

  // Upload avatar
  uploadAvatar: async (file: File): Promise<ApiResponse<{ avatarUrl: string }>> => {
    const formData = new FormData();
    formData.append("avatar", file);
    const response = await apiService.upload<ApiResponse<{ avatarUrl: string }>>(
      "api/v1/users/me/avatar",
      formData
    );
    return response.data;
  },
};

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

// Public instructor profile (by id)
export interface InstructorUserInfo {
  id: string;
  email: string;
  fullName: string;
  dateOfBirth: string | null;
  avatarUrl: string | null;
}

export interface InstructorEducation {
  school: string;
  degree: string;
  fieldOfStudy: string;
  start: number;
  end: number;
}

export interface InstructorWorkExperience {
  company: string;
  role: string;
  from: string;
  to: string | null;
  isCurrentJob: boolean;
  description: string | null;
}

export interface InstructorSocialLinks {
  facebook: string | null;
  linkedIn: string | null;
  website: string | null;
}

export interface InstructorCertificate {
  name: string;
  url: string;
  issuer: string;
  year: number;
}

export type InstructorVerificationStatus = "Pending" | "Verified" | "Rejected";

export interface InstructorPublicProfile {
  id: string;
  user: InstructorUserInfo;
  bio: string | null;
  headline: string | null;
  expertiseAreas: string[];
  education: InstructorEducation[];
  workExperience: InstructorWorkExperience[];
  socialLinks: InstructorSocialLinks;
  certificates: InstructorCertificate[];
  teachingLanguages: string[];
  introVideoUrl: string | null;
  totalStudents: number;
  totalCourses: number;
  avgRating: number | null;
  verificationStatus: InstructorVerificationStatus;
  verifiedAt: string | null;
  createdAt: string;
  updatedAt: string | null;
  instructorSubscriptionPlan: SubscriptionPlan | null;
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

  // Get public instructor profile by id
  getInstructorById: async (id: string): Promise<ApiResponse<InstructorPublicProfile>> => {
    const response = await apiService.get<ApiResponse<InstructorPublicProfile>>(
      `api/v1/instructors/${id}`
    );
    return response.data;
  },

  // Get user profile by id
  getUserById: async (id: string): Promise<ApiResponse<UserProfile>> => {
    const response = await apiService.get<ApiResponse<UserProfile>>(
      `api/v1/users/${id}`
    );
    return response.data;
  },

  // Get instructor profile by userId
  getInstructorByUserId: async (userId: string): Promise<ApiResponse<InstructorPublicProfile>> => {
    const response = await apiService.get<ApiResponse<InstructorPublicProfile>>(
      `api/v1/instructors/users/${userId}`
    );
    return response.data;
  },
};

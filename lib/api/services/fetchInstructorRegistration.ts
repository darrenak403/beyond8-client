import type { ApiResponse } from "@/types/api";
import apiService, { RequestParams } from "../core";

export interface InstructorRegistrationRequest {
  bio: string;
  headline: string;
  expertiseAreas: string[];
  education: Array<{
    school: string;
    degree: string;
    start: number;
    end: number;
  }>;
  workExperience: Array<{
    company: string;
    role: string;
    from: string;
    to: string;
  }>;
  socialLinks: {
    facebook: string | null;
    linkedIn: string | null;
    website: string | null;
  };
  bankInfo: string;
  taxId: string | null;
  identityDocuments: Array<{
    frontImg: string;
    backImg: string;
  }>;
  certificates: Array<{
    name: string;
    url: string;
    issuer: string;
    year: number;
  }>;
}

export interface InstructorUser {
  id: string;
  email: string;
  fullName: string;
  dateOfBirth: string | null;
  avatarUrl: string | null;
  coverUrl: string | null;
}

export interface InstructorEducation {
  school: string;
  degree: string;
  start: number;
  end: number;
}

export interface InstructorWorkExperience {
  company: string;
  role: string;
  from: string;
  to: string;
}

export interface InstructorSocialLinks {
  facebook: string | null;
  linkedIn: string | null;
  website: string | null;
}

export interface InstructorRegistrationResponse {
  id: string;
  user: InstructorUser;
  bio: string | null;
  headline: string | null;
  expertiseAreas: string[];
  education: InstructorEducation[];
  workExperience: InstructorWorkExperience[];
  socialLinks: InstructorSocialLinks;
  totalStudents: number;
  totalCourses: number;
  avgRating: number | null;
  verificationStatus: "Pending" | "Approved" | "Rejected";
  verifiedAt: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface InstructorRegistrationResponseList {
  isSuccess: boolean;
  message: string;
  data: InstructorRegistrationResponse[];
  metadata: Metadata;
}

export interface Metadata {
  pageNumber: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface AIReviewDetail {
  sectionName: string;
  status: "Valid" | "Invalid" | "Warning";
  score: number;
  issues: string[];
  suggestions: string[];
}

export interface AIReviewResponse {
  isAccepted: boolean;
  totalScore: number;
  feedbackSummary: string | null;
  details: AIReviewDetail[];
  additionalFeedback: string | null;
}

export enum InstructorRegistrationStatus {
  All = "All",
  Pending = "Pending",
  Verified = "Verified",
  Rejected = "Rejected",
  RequestUpdate = "RequestUpdate"
}

export interface InstructorRegistrationParams {
  status: InstructorRegistrationStatus;
  pageNumber: number;
  pageSize: number;
  IsDescending: boolean;
}

const convertParamsToQuery = (params: InstructorRegistrationParams): RequestParams => {
  if (!params) return {};
  const query: RequestParams = {};
  if (params.status) query.status = params.status;
  if (params.pageNumber) query.pageNumber = params.pageNumber;
  if (params.pageSize) query.pageSize = params.pageSize;
  if (params.IsDescending) query.isDescending = params.IsDescending;
  return query;
}

export const instructorRegistrationService = {
  reviewApplication: async (
    request: InstructorRegistrationRequest
  ): Promise<ApiResponse<AIReviewResponse>> => {
    const response = await apiService.post<ApiResponse<AIReviewResponse>>(
      "api/v1/ai/instructor-application-review",
      request
    );
    return response.data;
  },

  register: async (
    request: InstructorRegistrationRequest
  ): Promise<ApiResponse<InstructorRegistrationResponse>> => {
    const response = await apiService.post<ApiResponse<InstructorRegistrationResponse>>(
      "api/v1/instructors/apply",
      request
    );
    return response.data;
  },

  approveRegistration: async (
    profileId: string
  ): Promise<ApiResponse<InstructorRegistrationResponse>> => {
    const response = await apiService.put<ApiResponse<InstructorRegistrationResponse>>(
      `/api/v1/instructors/${profileId}/approve`
    );
    return response.data;
  },

  rejectRegistration: async (
    profileId: string
  ): Promise<ApiResponse<InstructorRegistrationResponse>> => {
    const response = await apiService.put<ApiResponse<InstructorRegistrationResponse>>(
      `/api/v1/instructors/${profileId}/reject`
    );
    return response.data;
  },

  getAll: async (
    filters: InstructorRegistrationParams
  ): Promise<InstructorRegistrationResponseList> => {

    const params = convertParamsToQuery(filters);

    const response = await apiService.get<InstructorRegistrationResponseList>(
      "/api/v1/instructors/admin", params
    );
    return response.data;
  },

  getMe: async (): Promise<ApiResponse<InstructorRegistrationResponse>> => {
    const response = await apiService.get<ApiResponse<InstructorRegistrationResponse>>(
      "/api/v1/instructors/me"
    );
    return response.data;
  }
};

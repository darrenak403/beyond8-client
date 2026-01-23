import type { ApiResponse } from "@/types/api";
import apiService, { RequestParams } from "../core";

export interface InstructorRegistrationRequest {
  bio: string;
  headline: string;
  expertiseAreas: string[];
  education: Array<{
    school: string;
    degree: string;
    fieldOfStudy: string;
    start: number;
    end: number;
  }>;
  workExperience: Array<{
    company: string;
    role: string;
    from: string;
    to: string;
    isCurrentJob: boolean;
    description: string | null;
  }>;
  socialLinks: {
    facebook: string | null;
    linkedIn: string | null;
    website: string | null;
  };
  bankInfo: {
    bankName: string;
    accountNumber: string;
    accountHolderName: string;
  };
  taxId: string | null;
  teachingLanguages: string[];
  introVideoUrl: string | null;
  identityDocuments: Array<{
    type: string;
    number: string;
    issuerDate: string | null;
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
  fieldOfStudy: string;
  start: number;
  end: number;
}

export interface InstructorWorkExperience {
  company: string;
  role: string;
  from: string;
  to: string;
  isCurrentJob: boolean;
  description: string | null;
}

export interface InstructorSocialLinks {
  facebook: string | null;
  linkedIn: string | null;
  website: string | null;
}

export enum VerificationStatus {
  Pending = "Pending",
  Verified = "Verified",
  Hidden = "Hidden",
  RequestUpdate = "RequestUpdate"
}

export interface RejectRegistrationRequest {
  notApproveReason: string,
  verificationStatus: VerificationStatus.Hidden | VerificationStatus.RequestUpdate
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
  teachingLanguages: string[];
  introVideoUrl: string | null;
  totalStudents: number;
  totalCourses: number;
  avgRating: number | null;
  verificationStatus: VerificationStatus;
  verifiedAt: string | null;
  createdAt: string;
  updatedAt: string | null;
  bankInfo: BankInfo;
  taxId: string | null;
  identityDocuments: IdentityDocuments[];
  certificates: Certificates[];
}

export interface InstructorProfileResponse {
  id: string;
  user: InstructorUser;
  bio: string | null;
  headline: string | null;
  expertiseAreas: string[];
  education: InstructorEducation[];
  workExperience: InstructorWorkExperience[];
  socialLinks: InstructorSocialLinks;
  certificates: Certificates[];
  teachingLanguages: string[];
  introVideoUrl: string | null;
  totalStudents: number;
  totalCourses: number;
  avgRating: number | null;
  verificationStatus: VerificationStatus;
  verifiedAt: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface BankInfo {
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
}

export interface IdentityDocuments {
  type: string;
  number: string;
  issuerDate: string | null;
  frontImg: string;
  backImg: string;
}

export interface Certificates {
  name: string;
  url: string;
  issuer: string;
  year: number;
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
  status: string | null;
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

export interface AIProfileReviewRequest {
  bio: string;
  headline: string;
  expertiseAreas: string[];
  education: Array<{
    school: string;
    degree: string;
    fieldOfStudy: string;
    start: number;
    end: number;
  }>;
  workExperience: Array<{
    company: string;
    role: string;
    from: string;
    to: string;
    isCurrentJob: boolean;
    description: string | null;
  }>;
  certificates: Array<{
    name: string;
    url: string;
    issuer: string;
    year: number;
  }>;
  teachingLanguages: string[];
}

export enum InstructorRegistrationParamsStatus {
  All = "All",
  Pending = "Pending",
  Verified = "Verified",
  Rejected = "Rejected",
  RequestUpdate = "RequestUpdate"
}

export interface InstructorRegistrationParams {
  status: InstructorRegistrationParamsStatus;
  fullName: string;
  pageNumber: number;
  pageSize: number;
  IsDescending: boolean;
}

const convertParamsToQuery = (params: InstructorRegistrationParams): RequestParams => {
  if (!params) return {};
  const query: RequestParams = {};
  if (params.status) query.status = params.status;
  if (params.fullName) query.fullName = params.fullName;
  if (params.pageNumber) query.pageNumber = params.pageNumber;
  if (params.pageSize) query.pageSize = params.pageSize;
  if (params.IsDescending) query.isDescending = params.IsDescending;
  return query;
}

export const instructorRegistrationService = {
  reviewApplication: async (
    request: AIProfileReviewRequest
  ): Promise<ApiResponse<AIReviewResponse>> => {
    const response = await apiService.post<ApiResponse<AIReviewResponse>>(
      "api/v1/ai/profile-review",
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
    const response = await apiService.post<ApiResponse<InstructorRegistrationResponse>>(
      `api/v1/instructors/${profileId}/approve`
    );
    return response.data;
  },

  rejectRegistration: async (
    profileId: string,
    data: RejectRegistrationRequest
  ): Promise<ApiResponse<InstructorRegistrationResponse>> => {
    const response = await apiService.post<ApiResponse<InstructorRegistrationResponse>>(
      `api/v1/instructors/${profileId}/not-approve`, data
    );
    return response.data;
  },

  getAll: async (
    filters: InstructorRegistrationParams
  ): Promise<InstructorRegistrationResponseList> => {

    const params = convertParamsToQuery(filters);

    const response = await apiService.get<InstructorRegistrationResponseList>(
      "api/v1/instructors/admin", params
    );
    return response.data;
  },

  getMe: async (): Promise<ApiResponse<InstructorProfileResponse>> => {
    const response = await apiService.get<ApiResponse<InstructorProfileResponse>>(
      "/api/v1/instructors/me"
    );
    return response.data;
  },

  checkApply: async (): Promise<ApiResponse<boolean>> => {
    const response = await apiService.get<ApiResponse<boolean>>(
      "/api/v1/instructors/check-apply"
    );
    return response.data;
  }
};

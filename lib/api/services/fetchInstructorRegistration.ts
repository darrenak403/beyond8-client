import type { ApiResponse } from "@/types/api";
import apiService from "../core";

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
    type: string;
    number: string;
    issuedDate: string;
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

export const instructorRegistrationService = {
  register: async (
    request: InstructorRegistrationRequest
  ): Promise<ApiResponse<InstructorRegistrationResponse>> => {
    const response = await apiService.post<ApiResponse<InstructorRegistrationResponse>>(
      "api/v1/instructors/registration",
      request
    );
    return response.data;
  },
};

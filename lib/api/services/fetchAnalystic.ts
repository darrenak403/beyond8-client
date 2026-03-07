import { ApiResponse } from "@/types/api";
import apiService from "../core";

// --- Analytics Types ---

export interface AIUsageChartModelData {
  model: string;
  provider: number;
  totalInputTokens: number;
  totalOutputTokens: number;
  totalTokens: number;
  totalInputCost: number;
  totalOutputCost: number;
  totalCost: number;
  usageCount: number;
}

export interface AIUsageChartData {
  snapshotDate: string;
  models: AIUsageChartModelData[];
}

export interface GetAIUsageChartParams {
  PeriodMonths?: number;
  StartDate?: string;
  EndDate?: string;
}

export interface InstructorAnalytics {
  instructorId: string;
  instructorName: string;
  totalCourses: number;
  draftCourses: number;
  pendingApprovalCourses: number;
  approvedCourses: number;
  publishedCourses: number;
  rejectedCourses: number;
  totalStudents: number;
  totalInstructorEarnings: number;
  availableBalance: number;
  avgCourseRating: number;
  totalReviews: number;
  snapshotDate: string;
  updatedAt: string | null;
}

export const fetchAnalystic = {
  // AI Usage Chart
  getAIUsageChart: async (params: GetAIUsageChartParams): Promise<ApiResponse<AIUsageChartData[]>> => {
    const response = await apiService.get<ApiResponse<AIUsageChartData[]>>("api/v1/analytics/ai-usage/chart", params);
    return response.data;
  },

  // Instructor Analytics
  getInstructorAnalytics: async (): Promise<ApiResponse<InstructorAnalytics>> => {
    const response = await apiService.get<ApiResponse<InstructorAnalytics>>("/api/v1/analytics/instructors/me");
    return response.data;
  },
};

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
  courses: {
    total: number;
    draft: number;
    pendingApproval: number;
    approved: number;
    published: number;
    rejected: number;
    archived: number;
    suspended: number;
    publishedThisMonth: number;
    publishedLastMonth: number;
    publishedGrowthPercent: number;
    publishedGrowthAbsolute: number;
  };
  students: {
    total: number;
    thisMonth: number;
    lastMonth: number;
    growthPercent: number;
    growthAbsolute: number;
  };
  revenue: {
    totalEarnings: number;
    availableBalance: number;
    thisMonth: number;
    lastMonth: number;
    growthPercent: number;
    growthAbsolute: number;
  };
  rating: {
    average: number;
    totalReviews: number;
  };
  snapshotDate: string;
  updatedAt: string | null;
}

export interface SystemDashboardAnalytics {
  totalUsers: number;
  totalInstructors: number;
  totalStudents: number;
  totalCourses: number;
  totalPublishedCourses: number;
  totalEnrollments: number;
  totalCompletedEnrollments: number;
  totalPlatformFee: number;
  avgCourseRating: number;
  updatedAt: string | null;
}

export type RevenueTrendGroupBy = "Year" | "Quarter" | "Month" | "Custom";

export interface GetSystemRevenueTrendParams {
  GroupBy: RevenueTrendGroupBy;
  Year?: number;
  Quarter?: number;
  Month?: number;
  StartDate?: string;
}

export interface RevenueTrendDataPoint {
  period: string;
  label: string;
  revenue: number;
  profit: number;
  instructorEarnings: number;
  newEnrollments: number;
}

export interface SystemRevenueTrend {
  periodLabel: string;
  totalRevenue: number;
  totalProfit: number;
  totalInstructorEarnings: number;
  totalNewEnrollments: number;
  dataPoints: RevenueTrendDataPoint[];
}

export const fetchAnalystic = {
  // AI Usage Chart
  getAIUsageChart: async (params: GetAIUsageChartParams): Promise<ApiResponse<AIUsageChartData[]>> => {
    const response = await apiService.get<ApiResponse<AIUsageChartData[]>>("api/v1/analytics/ai-usage/chart", params);
    return response.data;
  },

  // Instructor Analytics
  getInstructorAnalytics: async (): Promise<ApiResponse<InstructorAnalytics>> => {
    const response = await apiService.get<ApiResponse<InstructorAnalytics>>("api/v1/analytics/instructors/me");
    return response.data;
  },

  // System Dashboard Analytics
  getSystemDashboardAnalytics: async (): Promise<ApiResponse<SystemDashboardAnalytics>> => {
    const response = await apiService.get<ApiResponse<SystemDashboardAnalytics>>("api/v1/analytics/system/dashboard");
    return response.data;
  },

  // System Revenue Trend Analytics
  getSystemRevenueTrend: async (
    params: GetSystemRevenueTrendParams,
  ): Promise<ApiResponse<SystemRevenueTrend>> => {
    const response = await apiService.get<ApiResponse<SystemRevenueTrend>>("api/v1/analytics/system/revenue-trend", params);
    return response.data;
  },
};

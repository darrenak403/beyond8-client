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

export const fetchAnalystic = {
  // AI Usage Chart
  getAIUsageChart: async (params: GetAIUsageChartParams): Promise<ApiResponse<AIUsageChartData[]>> => {
    const response = await apiService.get<ApiResponse<AIUsageChartData[]>>("api/v1/analytics/ai-usage/chart", params);
    return response.data;
  },
};

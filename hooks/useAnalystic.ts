import { useQuery } from '@tanstack/react-query';
import {
  fetchAnalystic,
  type GetAIUsageChartParams,
  type AIUsageChartData,
  type AIUsageChartModelData,
  type InstructorAnalytics,
  type SystemDashboardAnalytics,
  type RevenueTrendGroupBy,
  type GetSystemRevenueTrendParams,
  type RevenueTrendDataPoint,
  type SystemRevenueTrend,
} from '@/lib/api/services/fetchAnalystic';

export type {
  GetAIUsageChartParams,
  AIUsageChartData,
  AIUsageChartModelData,
  InstructorAnalytics,
  SystemDashboardAnalytics,
  RevenueTrendGroupBy,
  GetSystemRevenueTrendParams,
  RevenueTrendDataPoint,
  SystemRevenueTrend,
};

export function useAIUsageChart(params: GetAIUsageChartParams) {
  return useQuery({
    queryKey: ['ai-usage-chart', params],
    queryFn: async () => await fetchAnalystic.getAIUsageChart(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useInstructorAnalytics() {
  return useQuery({
    queryKey: ['instructor-analytics'],
    queryFn: async () => {
      const response = await fetchAnalystic.getInstructorAnalytics();
      if (!response.isSuccess) {
        throw new Error(response.message || "Failed to fetch instructor analytics");
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useSystemDashboardAnalytics() {
  return useQuery({
    queryKey: ['system-dashboard-analytics'],
    queryFn: async () => {
      const response = await fetchAnalystic.getSystemDashboardAnalytics();
      if (!response.isSuccess) {
        throw new Error(response.message || 'Failed to fetch system dashboard analytics');
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useSystemRevenueTrend(params: GetSystemRevenueTrendParams) {
  return useQuery({
    queryKey: ['system-revenue-trend', params],
    queryFn: async () => {
      const response = await fetchAnalystic.getSystemRevenueTrend(params);
      if (!response.isSuccess) {
        throw new Error(response.message || 'Failed to fetch system revenue trend');
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

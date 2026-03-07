import { useQuery } from '@tanstack/react-query';
import {
  fetchAnalystic,
  type GetAIUsageChartParams,
  type AIUsageChartData,
  type AIUsageChartModelData,
  type InstructorAnalytics,
} from '@/lib/api/services/fetchAnalystic';

export type { GetAIUsageChartParams, AIUsageChartData, AIUsageChartModelData, InstructorAnalytics };

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

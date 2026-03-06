import { useQuery } from '@tanstack/react-query';
import {
  fetchAnalystic,
  type GetAIUsageChartParams,
  type AIUsageChartData,
  type AIUsageChartModelData,
} from '@/lib/api/services/fetchAnalystic';

export type { GetAIUsageChartParams, AIUsageChartData, AIUsageChartModelData };

export function useAIUsageChart(params: GetAIUsageChartParams) {
  return useQuery({
    queryKey: ['ai-usage-chart', params],
    queryFn: async () => await fetchAnalystic.getAIUsageChart(params),
    staleTime: 5 * 60 * 1000,
  });
}

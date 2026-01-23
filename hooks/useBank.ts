import { useQuery } from '@tanstack/react-query';
import { bankService } from '@/lib/api/services/fetchBank';

export function useBanks() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['banks'],
    queryFn: async () => {
      const response = await bankService.getBanks();
      return response.data;
    },
    staleTime: 24 * 60 * 60 * 1000, // 24 hours - bank list doesn't change often
  });

  return {
    banks: data || [],
    isLoading,
    error
  };
}

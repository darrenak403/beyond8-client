import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  fetchAI, 
  GetUsageHistoryParams, 
  GetAIPromptsParams, 
  CreateAIPromptRequest, 
  UpdateAIPromptRequest 
} from '@/lib/api/services/fetchAI';

// Usage Hooks
export function useAIUsageStatistics() {
  return useQuery({
    queryKey: ['ai-usage-statistics'],
    queryFn: fetchAI.getStatistics,
    staleTime: 5 * 60 * 1000, 
  });
}

export function useAIUsageHistory(params: GetUsageHistoryParams) {
  return useQuery({
    queryKey: ['ai-usage-history', params],
    queryFn: () => fetchAI.getHistory(params),
    staleTime: 5 * 60 * 1000,
  });
}

// Prompt Hooks
export function useAIPrompts(params: GetAIPromptsParams) {
  return useQuery({
    queryKey: ['ai-prompts', params],
    queryFn: () => fetchAI.getPrompts(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useAIPrompt(id: string) {
  return useQuery({
    queryKey: ['ai-prompt', id],
    queryFn: () => fetchAI.getPromptById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

import { toast } from 'sonner';

export function useCreateAIPrompt() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateAIPromptRequest) => fetchAI.createPrompt(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['ai-prompts'] });
      toast.success(response.message || 'Tạo prompt thành công!');
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error.message || 'Tạo prompt thất bại!');
    },
  });
}

export function useUpdateAIPrompt() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAIPromptRequest }) => fetchAI.updatePrompt(id, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ['ai-prompts'] });
      queryClient.invalidateQueries({ queryKey: ['ai-prompt', variables.id] });
      toast.success(response.message || 'Cập nhật prompt thành công!');
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error.message || 'Cập nhật prompt thất bại!');
    },
  });
}

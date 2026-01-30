import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { 
  fetchAI, 
  type GetUsageHistoryParams, 
  type GetAIPromptsParams, 
  type CreateAIPromptRequest, 
  type UpdateAIPromptRequest,
  type AIUsageStatistics, 
  type AIUsageRecord,
  type AIPrompt,
} from '@/lib/api/services/fetchAI';

export type { GetUsageHistoryParams, GetAIPromptsParams, CreateAIPromptRequest, UpdateAIPromptRequest, AIUsageStatistics, AIUsageRecord, AIPrompt };

// Usage Hooks
export function useAIUsageStatistics() {
  return useQuery({
    queryKey: ['ai-usage-statistics'],
    queryFn: async () => await fetchAI.getStatistics(),
    staleTime: 5 * 60 * 1000, 
  });
}

export function useAIUsageHistory(params: GetUsageHistoryParams) {
  return useQuery({
    queryKey: ['ai-usage-history', params],
    queryFn: async () => await fetchAI.getHistory(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useAIAllHistory(params?: GetUsageHistoryParams) {
  return useQuery({
    queryKey: ['ai-usage-all-history', params],
    queryFn: async () => await fetchAI.getAllHistory(params),
    staleTime: 5 * 60 * 1000,
  });
}

// Prompt Hooks
export function useAIPrompts(params: GetAIPromptsParams) {
  return useQuery({
    queryKey: ['ai-prompts', params],
    queryFn: async () => await fetchAI.getPrompts(params),
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
}

export function useAIPrompt(id: string) {
  return useQuery({
    queryKey: ['ai-prompt', id],
    queryFn: async () => await fetchAI.getPromptById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

import { toast } from 'sonner';

export function useCreateAIPrompt() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateAIPromptRequest) => await fetchAI.createPrompt(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-prompts'] });
      toast.success('Tạo prompt thành công');
    },
    onError: () => {
        toast.error('Có lỗi xảy ra khi tạo prompt');
    }
  });
}

export function useDeleteAIPrompt() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => await fetchAI.deletePrompt(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-prompts'] });
      toast.success('Xóa prompt thành công');
    },
    onError: () => {
        toast.error('Có lỗi xảy ra khi xóa prompt');
    }
  });
}



export function useUpdateAIPrompt() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateAIPromptRequest }) => await fetchAI.updatePrompt(id, data),
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

export function useToggleAIPromptStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => await fetchAI.toggleStatus(id),
    onSuccess: (response, id) => {
        queryClient.invalidateQueries({ queryKey: ['ai-prompts'] });
        queryClient.invalidateQueries({ queryKey: ['ai-prompt', id] });
        toast.success(response.message || 'Cập nhật trạng thái thành công');
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
        toast.error(error.message || 'Cập nhật trạng thái thất bại');
    }
  });
}

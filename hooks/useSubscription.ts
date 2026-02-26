import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { subscriptionService } from "@/lib/api/services/fetchSupscripton";
import { toast } from "sonner";
import { PaymentResponse } from "@/lib/api/services/fetchSupscripton";


export interface UseBuySubscriptionOptions {
  onSuccess?: (data: unknown) => void;
  onError?: (error: Error) => void;
}

export function useSubscription() {
  const { data: subscription, isLoading, error } = useQuery({
    queryKey: ["subscription"],
    queryFn: async () => {
      const response = await subscriptionService.getMe();
      if (!response.isSuccess) {
        throw new Error(response.message);
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return { subscription, isLoading, error };
}

export function useSubscriptionPlans() {
  const { data: plans, isLoading, error } = useQuery({
    queryKey: ["subscriptionPlans"],
    queryFn: async () => {
      const response = await subscriptionService.getPlans();
      if (!response.isSuccess) {
        throw new Error(response.message);
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  return { plans, isLoading, error };
}

export function useBuySubscription(options?: UseBuySubscriptionOptions) {
  const queryClient = useQueryClient();
  const { onSuccess, onError } = options ?? {};

  const { mutateAsync, isPending, error, isError } = useMutation<PaymentResponse, Error, string>({
    mutationFn: async (planCode: string) => {
      return await subscriptionService.buySubscription(planCode);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["subscription"] });
      toast.success(data.message || "Mua gói thành công!");
      onSuccess?.(data.data);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Mua gói thất bại!");
      onError?.(error);
    },
  });

  return {
    buySubscription: mutateAsync,
    isPending,
    error,
    isError,
  };
}

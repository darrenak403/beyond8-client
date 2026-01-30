import { useQuery } from "@tanstack/react-query";
import { subscriptionService } from "@/lib/api/services/fetchSupscripton";

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

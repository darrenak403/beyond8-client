import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationService, NotificationParams } from "@/lib/api/services/fetchNotification";

export function useNotification(params: NotificationParams, options?: { enabled?: boolean }) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["notifications", params],
    queryFn: async () => {
      const response = await notificationService.getMyNotifications(params);
      if (!response.isSuccess) {
        throw new Error(response.message);
      }
      return response.data;
    },
    refetchInterval: 30000, 
    enabled: options?.enabled
  });

  return {
    notifications: data?.notifications || [],
    totalCount: data?.totalCount || 0,
    isLoading,
    error,
    refetch,
  };
}

export function useInstructorNotification(params: NotificationParams, options?: { enabled?: boolean }) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["instructor-notifications", params],
    queryFn: async () => {
      const response = await notificationService.getInstructorNotifications(params);
      if (!response.isSuccess) {
        throw new Error(response.message);
      }
      return response.data;
    },
    refetchInterval: 30000,
    enabled: options?.enabled
  });

  return {
    data,
    isLoading,
    error,
    refetch,
  };
}

export function useMarkAllRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await notificationService.markAllRead();
      if (!response.isSuccess) {
        throw new Error(response.message);
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["instructor-notifications"] });
      
    },
  });
}

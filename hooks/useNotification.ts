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
    notifications: data || [],
    totalCount: data?.length || 0,
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
      queryClient.invalidateQueries({ queryKey: ["notification-status"] });
    },
  });
}

export function useDeleteNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await notificationService.deleteNotification(id);
      if (!response.isSuccess) {
        throw new Error(response.message);
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["instructor-notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notification-status"] });
    },
  });
}

export function useDeleteAllNotifications() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await notificationService.deleteAllNotifications();
      if (!response.isSuccess) {
        throw new Error(response.message);
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["instructor-notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notification-status"] });
    },
  });
}

export function useNotificationStatus(options?: { enabled?: boolean }) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["notification-status"],
    queryFn: async () => {
      const response = await notificationService.getNotificationStatus();
      if (!response.isSuccess) {
        throw new Error(response.message);
      }
      return response.data;
    },
    refetchInterval: 30000,
    enabled: options?.enabled,
  });

  return {
    status: data,
    isLoading,
    error,
    refetch,
  };
}
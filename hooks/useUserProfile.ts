import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userService, type UserProfile, type UpdateUserProfileRequest } from "@/lib/api/services/fetchProfile";
import { toast } from "sonner";

export function useUserProfile() {
  const queryClient = useQueryClient();

  // Fetch user profile
  const {
    data: userProfile,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const response = await userService.getMe();
      if (!response.isSuccess) {
        throw new Error(response.message);
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: UpdateUserProfileRequest) => {
      const response = await userService.updateProfile(data);
      if (!response.isSuccess) {
        throw new Error(response.message);
      }
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["userProfile"], (old: UserProfile | undefined) => {
        if (!old) return data;
        return {
          ...old,
          ...data,
          // Preserve roles if they are missing or empty in the response
          roles: (data.roles && data.roles.length > 0) ? data.roles : old.roles
        };
      });
      toast.success("Cập nhật thông tin thành công!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Cập nhật thông tin thất bại!");
    },
  });

  // Upload avatar mutation
  const uploadAvatarMutation = useMutation({
    mutationFn: async (file: File) => {
      const response = await userService.uploadAvatar(file);
      if (!response.isSuccess) {
        throw new Error(response.message);
      }
      return response.data;
    },
    onSuccess: (data) => {
      // Update the cached user profile with new avatar
      queryClient.setQueryData(["userProfile"], (old: UserProfile | undefined) => {
        if (!old) return old;
        return { ...old, avatarUrl: data.avatarUrl };
      });
      toast.success("Cập nhật ảnh đại diện thành công!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Cập nhật ảnh đại diện thất bại!");
    },
  });

  return {
    userProfile,
    isLoading,
    error,
    refetch,
    updateProfile: updateProfileMutation.mutate,
    isUpdating: updateProfileMutation.isPending,
    uploadAvatar: uploadAvatarMutation.mutate,
    isUploadingAvatar: uploadAvatarMutation.isPending,
  };
}

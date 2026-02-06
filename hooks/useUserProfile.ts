import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  userService,
  type UserProfile,
  type UpdateUserProfileRequest,
  type InstructorPublicProfile,
} from "@/lib/api/services/fetchProfile";
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

// Public instructor (by id)
export function useInstructorById(id: string | undefined) {
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["instructor", id],
    enabled: !!id,
    queryFn: async () => {
      if (!id) {
        throw new Error("Instructor id is required");
      }
      const response = await userService.getInstructorById(id);
      if (!response.isSuccess) {
        throw new Error(response.message);
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  return {
    instructor: data as InstructorPublicProfile | undefined,
    isLoading,
    error,
    refetch,
  };
}

// Get user by id
export function useUserById(id: string | undefined) {
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["user", id],
    enabled: !!id,
    queryFn: async () => {
      if (!id) {
        throw new Error("User id is required");
      }
      const response = await userService.getUserById(id);
      if (!response.isSuccess) {
        throw new Error(response.message);
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  return {
    user: data as UserProfile | undefined,
    isLoading,
    error,
    refetch,
  };
}

// Get instructor profile by userId
export function useInstructorByUserId(userId: string | undefined) {
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["instructor", "user", userId],
    enabled: !!userId,
    queryFn: async () => {
      if (!userId) {
        throw new Error("User id is required");
      }
      const response = await userService.getInstructorByUserId(userId);
      if (!response.isSuccess) {
        throw new Error(response.message);
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  return {
    instructor: data as InstructorPublicProfile | undefined,
    isLoading,
    error,
    refetch,
  };
}
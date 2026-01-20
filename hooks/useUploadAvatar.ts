import { useMutation, useQueryClient } from "@tanstack/react-query";
import { avatarService } from "@/lib/api/services/fetchUploadAvatar";
import { mediaService } from "@/lib/api/services/fetchMedia";
import type { UserProfile } from "@/lib/api/services/fetchProfile";
import { toast } from "sonner";

export function useUploadAvatar() {
  const queryClient = useQueryClient();

  // Complete avatar upload flow
  const uploadAvatarMutation = useMutation({
    mutationFn: async (file: File) => {
      // Step 1-4: Upload file and get fileUrl
      const mediaFile = await mediaService.uploadAvatar(file);

      // Step 5: Update user avatar with fileUrl
      const response = await avatarService.updateAvatar({
        fileUrl: mediaFile.fileUrl,
      });

      if (!response.isSuccess) {
        throw new Error(response.message || "Failed to update avatar");
      }

      return mediaFile.fileUrl;
    },
    onSuccess: (avatarUrl) => {
      // Update the cached user profile with new avatar
      queryClient.setQueryData(["userProfile"], (old: UserProfile | undefined) => {
        if (!old) return old;
        return { ...old, avatarUrl };
      });
      toast.success("Cập nhật ảnh đại diện thành công!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Cập nhật ảnh đại diện thất bại!");
    },
  });

  return {
    uploadAvatar: uploadAvatarMutation.mutate,
    uploadAvatarAsync: uploadAvatarMutation.mutateAsync,
    isUploading: uploadAvatarMutation.isPending,
    error: uploadAvatarMutation.error,
  };
}

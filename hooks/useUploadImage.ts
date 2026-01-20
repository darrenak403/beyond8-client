import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ImageService } from "@/lib/api/services/fetchUploadImage";
import { mediaService } from "@/lib/api/services/fetchMedia";
import type { UserProfile } from "@/lib/api/services/fetchProfile";
import { toast } from "sonner";

export function useUploadImage() {
  const queryClient = useQueryClient();

  const uploadAvatarMutation = useMutation({
    mutationFn: async (file: File) => {
      const mediaFile = await mediaService.uploadAvatar(file);
      const response = await ImageService.updateAvatar({
        fileUrl: mediaFile.fileUrl,
      });

      if (!response.isSuccess) {
        throw new Error(response.message || "Failed to update avatar");
      }

      return mediaFile.fileUrl;
    },
    onSuccess: (avatarUrl) => {
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

  const uploadCoverMutation = useMutation({
    mutationFn: async (file: File) => {
      const mediaFile = await mediaService.uploadCover(file);
      const response = await ImageService.updateCover({
        fileUrl: mediaFile.fileUrl,
      });

      if (!response.isSuccess) {
        throw new Error(response.message || "Failed to update cover");
      }

      return mediaFile.fileUrl;
    },
    onSuccess: (coverUrl) => {
      queryClient.setQueryData(["userProfile"], (old: UserProfile | undefined) => {
        if (!old) return old;
        return { ...old, coverUrl };
      });
      toast.success("Cập nhật ảnh bìa thành công!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Cập nhật ảnh bìa thất bại!");
    },
  });

  return {
    uploadAvatar: uploadAvatarMutation.mutate,
    uploadAvatarAsync: uploadAvatarMutation.mutateAsync,
    isUploadingAvatar: uploadAvatarMutation.isPending,
    avatarError: uploadAvatarMutation.error,
    uploadCover: uploadCoverMutation.mutate,
    uploadCoverAsync: uploadCoverMutation.mutateAsync,
    isUploadingCover: uploadCoverMutation.isPending,
    coverError: uploadCoverMutation.error,
  };
}

import { useMutation } from "@tanstack/react-query";
import { mediaService, type MediaFile } from "@/lib/api/services/fetchMedia";
import { toast } from "sonner";

export function useMedia() {
  // Upload avatar mutation
  const uploadAvatarMutation = useMutation({
    mutationFn: async (file: File) => {
      return await mediaService.uploadAvatar(file);
    },
    onSuccess: (data: MediaFile) => {
      toast.success("Upload ảnh thành công!");
      return data;
    },
    onError: (error: Error) => {
      toast.error(error.message || "Upload ảnh thất bại!");
    },
  });

  return {
    uploadAvatar: uploadAvatarMutation.mutate,
    uploadAvatarAsync: uploadAvatarMutation.mutateAsync,
    isUploading: uploadAvatarMutation.isPending,
    uploadError: uploadAvatarMutation.error,
    uploadedFile: uploadAvatarMutation.data,
  };
}

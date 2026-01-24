import { useMutation, useQueryClient } from "@tanstack/react-query";
import { mediaService, type MediaFile } from "@/lib/api/services/fetchMedia";
import { toast } from "sonner";

export function useMedia() {
  const queryClient = useQueryClient();
  
  // Upload avatar mutation
  const uploadAvatarMutation = useMutation({
    mutationFn: async (file: File) => {
      return await mediaService.uploadAvatar(file);
    },
    onSuccess: (data: MediaFile) => {
      toast.success("Upload ảnh thành công!");
      queryClient.invalidateQueries({ queryKey: ["media"] });
      return data;
    },
    onError: (error: Error) => {
      toast.error(error.message || "Upload ảnh thất bại!");
    },
  });

  // Upload certificate mutation
  const uploadCertificateMutation = useMutation({
    mutationFn: async (file: File) => {
      return await mediaService.uploadCertificate(file);
    },
    onSuccess: (data: MediaFile) => {
      toast.success("Upload chứng chỉ thành công!");
      queryClient.invalidateQueries({ queryKey: ["media"] });
      return data;
    },
    onError: (error: Error) => {
      toast.error(error.message || "Upload chứng chỉ thất bại!");
    },
  });

  // Upload intro video mutation
  const uploadIntroVideoMutation = useMutation({
    mutationFn: async (file: File) => {
      return await mediaService.uploadIntroVideo(file);
    },
    onSuccess: (data: MediaFile) => {
      toast.success("Upload video giới thiệu thành công!");
      queryClient.invalidateQueries({ queryKey: ["media"] });
      return data;
    },
    onError: (error: Error) => {
      toast.error(error.message || "Upload video thất bại!");
    },
  });

  return {
    // Avatar
    uploadAvatar: uploadAvatarMutation.mutate,
    uploadAvatarAsync: uploadAvatarMutation.mutateAsync,
    isUploading: uploadAvatarMutation.isPending,
    uploadError: uploadAvatarMutation.error,
    uploadedFile: uploadAvatarMutation.data,

    // Certificate
    uploadCertificate: uploadCertificateMutation.mutate,
    uploadCertificateAsync: uploadCertificateMutation.mutateAsync,
    isUploadingCertificate: uploadCertificateMutation.isPending,
    uploadCertificateError: uploadCertificateMutation.error,
    uploadedCertificate: uploadCertificateMutation.data,

    // Intro Video
    uploadIntroVideo: uploadIntroVideoMutation.mutate,
    uploadIntroVideoAsync: uploadIntroVideoMutation.mutateAsync,
    isUploadingIntroVideo: uploadIntroVideoMutation.isPending,
    uploadIntroVideoError: uploadIntroVideoMutation.error,
    uploadedIntroVideo: uploadIntroVideoMutation.data,
  };
}

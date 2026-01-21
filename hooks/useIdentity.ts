import { useMutation } from "@tanstack/react-query";
import { identityService, type IdentityCardUploadResult } from "@/lib/api/services/fetchIdentity";
import { toast } from "sonner";

export function useIdentity() {
  const uploadFrontMutation = useMutation({
    mutationFn: async (file: File): Promise<IdentityCardUploadResult> => {
      return await identityService.uploadIdentityCard(file, 2); // 2 = front
    },
    onSuccess: () => {
      toast.success("Upload CCCD mặt trước thành công!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Upload CCCD mặt trước thất bại!");
    },
  });

  const uploadBackMutation = useMutation({
    mutationFn: async (file: File): Promise<IdentityCardUploadResult> => {
      return await identityService.uploadIdentityCard(file, 3); // 3 = back
    },
    onSuccess: () => {
      toast.success("Upload CCCD mặt sau thành công!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Upload CCCD mặt sau thất bại!");
    },
  });

  return {
    // Front
    uploadFront: uploadFrontMutation.mutate,
    uploadFrontAsync: uploadFrontMutation.mutateAsync,
    isUploadingFront: uploadFrontMutation.isPending,
    frontError: uploadFrontMutation.error,
    uploadedFront: uploadFrontMutation.data,
    
    // Back
    uploadBack: uploadBackMutation.mutate,
    uploadBackAsync: uploadBackMutation.mutateAsync,
    isUploadingBack: uploadBackMutation.isPending,
    backError: uploadBackMutation.error,
    uploadedBack: uploadBackMutation.data,
  };
}

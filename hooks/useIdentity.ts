import { useMutation, useQueryClient } from "@tanstack/react-query";
import { identityService, type IdentityCardUploadResult } from "@/lib/api/services/fetchIdentity";
import { toast } from "sonner";

export function useIdentity() {
  const queryClient = useQueryClient();
  
  const uploadFrontMutation = useMutation({
    mutationFn: async (file: File): Promise<IdentityCardUploadResult> => {
      return await identityService.uploadIdentityCard(file, true); // true = front
    },
    onSuccess: (data) => {
      toast.success("Upload CCCD mặt trước thành công!");
      queryClient.invalidateQueries({ queryKey: ["identity", data] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Upload CCCD mặt trước thất bại!");
    },
  });

  const uploadBackMutation = useMutation({
    mutationFn: async (file: File): Promise<IdentityCardUploadResult> => {
      return await identityService.uploadIdentityCard(file, false); // false = back
    },
    onSuccess: (data) => {
      toast.success("Upload CCCD mặt sau thành công!");
      queryClient.invalidateQueries({ queryKey: ["identity", data] });
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

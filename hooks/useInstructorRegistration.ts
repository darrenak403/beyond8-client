import { useMutation } from "@tanstack/react-query";
import { 
  instructorRegistrationService, 
  type InstructorRegistrationRequest,
  type InstructorRegistrationResponse,
  type AIReviewResponse
} from "@/lib/api/services/fetchInstructorRegistration";
import { toast } from "sonner";

export function useInstructorRegistration() {
  const reviewMutation = useMutation({
    mutationFn: async (
      request: InstructorRegistrationRequest
    ): Promise<AIReviewResponse> => {
      const response = await instructorRegistrationService.reviewApplication(request);
      
      if (!response.isSuccess || !response.data) {
        throw new Error(response.message || "Đánh giá hồ sơ thất bại");
      }
      
      return response.data;
    },
    onError: (error: Error) => {
      toast.error(error.message || "Đánh giá hồ sơ thất bại!");
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (
      request: InstructorRegistrationRequest
    ): Promise<InstructorRegistrationResponse> => {
      const response = await instructorRegistrationService.register(request);
      
      if (!response.isSuccess || !response.data) {
        throw new Error(response.message || "Đăng ký giảng viên thất bại");
      }
      
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Đăng ký giảng viên thành công!", {
        description: `Trạng thái: ${data.verificationStatus}`,
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Đăng ký giảng viên thất bại!");
    },
  });

  return {
    // Review
    reviewApplication: reviewMutation.mutate,
    reviewApplicationAsync: reviewMutation.mutateAsync,
    isReviewing: reviewMutation.isPending,
    reviewError: reviewMutation.error,
    reviewData: reviewMutation.data,
    
    // Register
    register: registerMutation.mutate,
    registerAsync: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    error: registerMutation.error,
    registrationData: registerMutation.data,
  };
}

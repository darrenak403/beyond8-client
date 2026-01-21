import { useMutation, useQuery } from "@tanstack/react-query";
import {
  instructorRegistrationService,
  type InstructorRegistrationRequest,
  type InstructorRegistrationResponse,
  type AIReviewResponse,
  InstructorRegistrationStatus,
  InstructorRegistrationParams,
  InstructorRegistrationResponseList
} from "@/lib/api/services/fetchInstructorRegistration";
import { toast } from "sonner";
import { ApiResponse } from "@/types/api";

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

export function useGetAllRegistration(filterParams: InstructorRegistrationParams) {
  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['instructor-registration', 'getAll'],
    queryFn: () => instructorRegistrationService.getAll(filterParams),
    select: (data: InstructorRegistrationResponseList) => ({
      registrations: data.data,
      count: data.metadata.totalItems,
      page: data.metadata.pageNumber,
      pageSize: data.metadata.pageSize,
      totalPages: data.metadata.totalPages,
      hasNextPage: data.metadata.hasNextPage,
      hasPreviousPage: data.metadata.hasPreviousPage
    }),
  })

  return {
    data,
    isLoading,
    error,
    refetch,
    isFetching
  }
}

export function useAproveRegistration() {
  const mutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await instructorRegistrationService.approveRegistration(id);

      if (!response.isSuccess || !response.data) {
        throw new Error(response.message || "Duyệt đăng ký thất bại");
      }

      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Duyệt đăng ký thành công!", {
        description: `Trạng thái: ${data.verificationStatus}`,
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Duyệt đăng ký thất bại!");
    },
  });

  return {
    approve: mutation.mutate,
    approveAsync: mutation.mutateAsync,
    isApproving: mutation.isPending,
    error: mutation.error,
    approvalData: mutation.data,
  };
}

export function useRejectRegistration() {
  const mutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await instructorRegistrationService.rejectRegistration(id);

      if (!response.isSuccess || !response.data) {
        throw new Error(response.message || "Từ chối đăng ký thất bại");
      }

      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Từ chối đăng ký thành công!", {
        description: `Trạng thái: ${data.verificationStatus}`,
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Từ chối đăng ký thất bại!");
    },
  });

  return {
    reject: mutation.mutate,
    rejectAsync: mutation.mutateAsync,
    isRejecting: mutation.isPending,
    error: mutation.error,
    rejectionData: mutation.data,
  };
}


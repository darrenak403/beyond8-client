import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  instructorRegistrationService,
  type InstructorRegistrationRequest,
  type InstructorRegistrationResponse,
  type AIReviewResponse,
  type AIProfileReviewRequest,
  type RejectRegistrationRequest,
  InstructorRegistrationParams,
  InstructorRegistrationResponseList
} from "@/lib/api/services/fetchInstructorRegistration";
import { toast } from "sonner";
import { ApiError } from "@/types/api";

export function useInstructorRegistration() {
  const queryClient = useQueryClient();

  const reviewMutation = useMutation({
    mutationFn: async (
      request: AIProfileReviewRequest
    ): Promise<AIReviewResponse> => {
      const response = await instructorRegistrationService.reviewApplication(request);

      if (!response.isSuccess || !response.data) {
        throw new Error(response.message || "Đánh giá hồ sơ thất bại");
      }

      return response.data;
    },
    onError: (error: any) => {
      toast.error(error.data.value.message || "Đánh giá hồ sơ thất bại!");
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
      queryClient.invalidateQueries({ queryKey: ["instructor-registration"] });
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
    onError: (error: ApiError) => {
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
    queryKey: ['instructor-registration', 'getAll', filterParams],
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
  const queryClient = useQueryClient();

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
      queryClient.invalidateQueries({ queryKey: ["instructor-registration"] });
    },
    onError: (error: any) => {
      toast.error(error.data.value.message || "Duyệt đăng ký thất bại!");
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
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (args: { id: string; data: RejectRegistrationRequest }) => {
      const response = await instructorRegistrationService.rejectRegistration(args.id, args.data);

      if (!response.isSuccess || !response.data) {
        throw new Error(response.message || "Từ chối đăng ký thất bại");
      }

      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Từ chối đăng ký thành công!", {
        description: `Trạng thái: ${data.verificationStatus}`,
      });
      queryClient.invalidateQueries({ queryKey: ["instructor-registration"] });
    },
    onError: (error: any) => {
      toast.error(error.data.value.message || "Từ chối đăng ký thất bại!");
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

export function useGetInstructorProfile() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["instructor-profile"],
    queryFn: async () => {
      const response = await instructorRegistrationService.getMe();

      if (!response.isSuccess || !response.data) {
        throw new Error(response.message || "Lấy thông tin giảng viên thất bại");
      }

      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });

  return {
    instructorProfile: data,
    isLoading,
    error,
    refetch,
  };
}

  export function useUnHiddenProfile() {
    const queryClient = useQueryClient();
    const mutation = useMutation({
      mutationFn: async (profileId: string) => {
        const response = await instructorRegistrationService.unhidden(profileId);   
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || "Khôi phục hiển thị hồ sơ giảng viên thất bại");
        }
        return response.data;
      },
      onSuccess: (data) => {
        toast.success("Khôi phục hiển thị hồ sơ giảng viên thành công!");
        queryClient.invalidateQueries({ queryKey: ["instructor-profile"] });
      },
      onError: (error: any) => {
        toast.error(error.data.value.message || "Khôi phục hiển thị hồ sơ giảng viên thất bại!");
      },
    }); 

  return {
    unhideProfile: mutation.mutate,
    unhideProfileAsync: mutation.mutateAsync,
    isUnhiding: mutation.isPending,
    error: mutation.error,
    unhideProfileData: mutation.data,
  };
}

  export function useHiddenProfile() {
    const queryClient = useQueryClient();
    const mutation = useMutation({
      mutationFn: async (profileId: string) => {
        const response = await instructorRegistrationService.hidden(profileId);   
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || "Khôi phục hiển thị hồ sơ giảng viên thất bại");
        }
        return response.data;
      },
      onSuccess: () => {
        toast.success("Khôi phục hiển thị hồ sơ giảng viên thành công!");
        queryClient.invalidateQueries({ queryKey: ["instructor-profile"] });
      },
      onError: (error: any) => {
        toast.error(error.data.value.message || "Khôi phục hiển thị hồ sơ giảng viên thất bại!");
      },
    }); 

  return {
    unhideProfile: mutation.mutate,
    unhideProfileAsync: mutation.mutateAsync,
    isUnhiding: mutation.isPending,
    error: mutation.error,
    unhideProfileData: mutation.data,
  };
}

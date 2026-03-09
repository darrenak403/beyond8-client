import {
  Course,
  CourseCertificateConfigResponse,
  CourseDetail,
  CourseDetailResponse,
  CourseDocument,
  CourseDocumentResponse,
  CourseParams,
  CourseRequest,
  CourseResponse,
  CourseReview,
  CourseReviewListResponse,
  CourseReviewParams,
  CourseSummary,
  CourseSummaryResponse,
  CourseUpdateRequest,
  CreateCourseDocumentRequest,
  CreateCourseReviewRequest,
  PublicCourseParams,
  PublicCourseResponse,
  SearchCourseParams,
  UpdateCourseCertificateConfigRequest,
  UpdateCourseDiscountRequest,
  UpdateCourseDocumentRequest,
  fetchCourse,
} from "@/lib/api/services/fetchCourse";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiError } from "next/dist/server/api-utils";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useCreateCourse() {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (course: CourseRequest) => fetchCourse.createNewCourse(course),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["courses"],
      });
      toast.success("Tạo khóa học mới thành công!");
    },
    onError: (error: ApiError) => {
      toast.error(error?.message || "Tạo khóa học mới thất bại!");
    },
  });

  return {
    createCourse: mutateAsync,
    isPending,
  };
}

export function useGetCourses(filterParams?: PublicCourseParams) {
  const { data, isLoading, refetch, isFetching, isError } = useQuery<
    PublicCourseResponse,
    Error,
    {
      courses: Course[];
      count: number;
      page: number;
      pageSize: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    }
  >({
    queryKey: ["courses", "public", filterParams],
    queryFn: () => fetchCourse.getCourses(filterParams),
    select: (data) => ({
      courses: data.data,
      count: data.metadata?.totalItems ?? 0,
      page: data.metadata?.pageNumber ?? 1,
      pageSize: data.metadata?.pageSize ?? 10,
      totalPages: data.metadata?.totalPages ?? 0,
      hasNextPage: data.metadata?.hasNextPage ?? false,
      hasPreviousPage: data.metadata?.hasPreviousPage ?? false,
    }),
    placeholderData: keepPreviousData,
  });

  return {
    courses: data?.courses ?? [],
    count: data?.count ?? 0,
    page: data?.page ?? 1,
    pageSize: data?.pageSize ?? 10,
    totalPages: data?.totalPages ?? 0,
    hasNextPage: data?.hasNextPage ?? false,
    hasPreviousPage: data?.hasPreviousPage ?? false,
    isLoading,
    refetch,
    isFetching,
    isError,
  };
}

// Search public courses using /api/v1/courses/search
export function useSearchCourses(filterParams?: SearchCourseParams) {
  const { data, isLoading, refetch, isFetching, isError } = useQuery<
    PublicCourseResponse,
    Error,
    {
      courses: Course[];
      count: number;
      page: number;
      pageSize: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    }
  >({
    queryKey: ["courses", "search", filterParams],
    queryFn: () => fetchCourse.searchCourses(filterParams),
    select: (data) => ({
      courses: data.data,
      // metadata của /search có thể null, nên dùng optional chaining & default
      count: data.metadata?.totalItems ?? data.data.length ?? 0,
      page: data.metadata?.pageNumber ?? 1,
      pageSize: data.metadata?.pageSize ?? filterParams?.pageSize ?? 10,
      totalPages: data.metadata?.totalPages ?? 1,
      hasNextPage: data.metadata?.hasNextPage ?? false,
      hasPreviousPage: data.metadata?.hasPreviousPage ?? false,
    }),
    placeholderData: keepPreviousData,
    // Chỉ gọi API khi có keyword search
    enabled: !!filterParams?.keyword && filterParams.keyword.trim().length > 0,
  });

  return {
    courses: data?.courses ?? [],
    count: data?.count ?? 0,
    page: data?.page ?? 1,
    pageSize: data?.pageSize ?? 10,
    totalPages: data?.totalPages ?? 0,
    hasNextPage: data?.hasNextPage ?? false,
    hasPreviousPage: data?.hasPreviousPage ?? false,
    isLoading,
    refetch,
    isFetching,
    isError,
  };
}

export function useGetCourseByInstructor(filterParams?: CourseParams) {
  const { data, isLoading, refetch, isFetching, isError } = useQuery<
    CourseResponse,
    Error,
    {
      courses: Course[];
      count: number;
      page: number;
      pageSize: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    }
  >({
    queryKey: ["courses", "instructor", "instructor-stats", filterParams],
    queryFn: () => fetchCourse.getCourseByInstructor(filterParams),
    select: (data) => ({
      courses: data.data,
      count: data.metadata.totalItems,
      page: data.metadata.pageNumber,
      pageSize: data.metadata.pageSize,
      totalPages: data.metadata.totalPages,
      hasNextPage: data.metadata.hasNextPage,
      hasPreviousPage: data.metadata.hasPreviousPage,
    }),
    placeholderData: keepPreviousData,
  });

  return {
    courses: data?.courses ?? [],
    count: data?.count ?? 0,
    page: data?.page ?? 1,
    pageSize: data?.pageSize ?? 10,
    totalPages: data?.totalPages ?? 0,
    hasNextPage: data?.hasNextPage ?? false,
    hasPreviousPage: data?.hasPreviousPage ?? false,
    isLoading,
    refetch,
    isFetching,
    isError,
  };
}

export function useGetCourseById(id: string) {
  const { data, isLoading, isError, refetch } = useQuery<CourseResponse, Error, Course>({
    queryKey: ["course", id],
    queryFn: () => fetchCourse.getCourseById(id),
    select: (data) => data.data[0] || (data.data as unknown as Course),
    enabled: !!id,
  });

  return {
    course: data,
    isLoading,
    isError,
    refetch,
  };
}

export function useGetCourseSummary(
  id: string,
  options?: {
    enabled?: boolean;
  }
) {
  const { data, isLoading, isError, refetch } = useQuery<
    CourseSummaryResponse,
    Error,
    CourseSummary
  >({
    queryKey: ["course", "summary", id],
    queryFn: () => fetchCourse.getCourseSummary(id),
    select: (data) => data.data,
    enabled: options?.enabled ?? !!id,
  });

  return {
    courseSummary: data,
    isLoading,
    isError,
    refetch,
  };
}

export function useGetCourseDetails(
  id: string,
  options?: {
    enabled?: boolean;
  }
) {
  const { data, isLoading, isError, refetch } = useQuery<CourseDetailResponse, Error, CourseDetail>(
    {
      queryKey: ["course", "details", id],
      queryFn: () => fetchCourse.getCourseDetails(id),
      select: (data: CourseDetailResponse) => data.data,
      // Cho phép truyền enabled từ ngoài để kiểm soát khi nào được phép fetch details
      enabled: options?.enabled ?? !!id,
    }
  );

  return {
    courseDetails: data,
    isLoading,
    isError,
    refetch,
  };
}

export function useUpdateCourse() {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: ({ id, courseData }: { id: string; courseData: Partial<CourseUpdateRequest> }) =>
      fetchCourse.updateCourse(id, courseData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["course"],
      });
      queryClient.invalidateQueries({
        queryKey: ["course", "details-preview", variables.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["courses", "instructor", "instructor-stats"]
      });
      toast.success("Cập nhật khóa học thành công!");
    },
    onError: (error: ApiError) => {
      toast.error(error?.message || "Lỗi khi cập nhật khóa học!");
    },
  });

  return {
    updateCourse: mutateAsync,
    isPending,
  };
}

export function useCreateCourseDocument() {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (courseData: CreateCourseDocumentRequest) =>
      fetchCourse.createCourseDocument(courseData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["course"],
      });
      if (variables.courseId) {
        queryClient.invalidateQueries({
          queryKey: ["course", "details-preview", variables.courseId],
        });
      }
      toast.success("Thêm tài liệu khóa học thành công!");
    },
    onError: (error: ApiError) => {
      toast.error(error?.message || "Lỗi khi thêm tài liệu khóa học!");
    },
  });

  return {
    createCourseDocument: mutateAsync,
    isPending,
  };
}

export function useUpdateCourseDocument() {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: ({
      id,
      courseData,
    }: {
      id: string;
      courseData: Partial<UpdateCourseDocumentRequest>;
    }) => fetchCourse.updateCourseDocument(id, courseData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["course"],
      });
      toast.success("Cập nhật tài liệu khóa học thành công!");
    },
    onError: (error: ApiError) => {
      toast.error(error?.message || "Lỗi khi cập nhật tài liệu khóa học!");
    },
  });

  return {
    updateCourse: mutateAsync,
    isPending,
  };
}

export function useGetCourseDocument(id: string) {
  const { data, isLoading, isError, refetch } = useQuery<
    CourseDocumentResponse,
    Error,
    CourseDocument[]
  >({
    queryKey: ["course", "document", id],
    queryFn: () => fetchCourse.getCourseDocument(id),
    select: (data) => data.data,
    enabled: !!id,
  });

  return {
    courseDocument: data,
    isLoading,
    isError,
    refetch,
  };
}

export function useDeleteCourseDocument() {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: ({ id }: { id: string }) => fetchCourse.deleteCourseDocument(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["course"],
      });
      toast.success("Xóa tài liệu khóa học thành công!");
    },
    onError: (error: ApiError) => {
      toast.error(error?.message || "Lỗi khi xóa tài liệu khóa học!");
    },
  });

  return {
    deleteCourseDocument: mutateAsync,
    isPending,
  };
}

export function useToggleDownloadCourseDocument() {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: ({ id }: { id: string }) => fetchCourse.toggleDownloadCourseDocument(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["course"],
      });
      toast.success("Cập nhật tài liệu khóa học thành công!");
    },
    onError: (error: ApiError) => {
      toast.error(error?.message || "Lỗi khi cập nhật tài liệu khóa học!");
    },
  });

  return {
    toggleDownloadCourseDocument: mutateAsync,
    isPending,
  };
}

export function useGetCourseDetailsPreview(
  id: string,
  options?: {
    enabled?: boolean;
  }
) {
  const { data, isLoading, isError, refetch } = useQuery<CourseDetailResponse, Error, CourseDetail>(
    {
      queryKey: ["course", "details-preview", id],
      queryFn: () => fetchCourse.getCourseDetailsPreview(id),
      select: (data: CourseDetailResponse) => data.data,
      enabled: options?.enabled ?? !!id,
    }
  );

  return {
    courseDetailsPreview: data,
    isLoading,
    isError,
    refetch,
  };
}

export function useGetCoursesForAdmin(filterParams?: CourseParams) {
  const { data, isLoading, isError, refetch } = useQuery<CourseResponse, Error, Course[]>({
    queryKey: ["course", "admin", filterParams],
    queryFn: () => fetchCourse.getCoursesForAdmin(filterParams),
    select: (data: CourseResponse) => data.data,
  });

  return {
    courses: data ?? [],
    isLoading,
    isError,
    refetch,
  };
}

export function useSubmitCourseForReview() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: ({ id }: { id: string }) => fetchCourse.submitCourseForReview(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["course"],
      });
      queryClient.invalidateQueries({
        queryKey: ["courses"],
      });
      queryClient.invalidateQueries({
        queryKey: ["instructor-analytics"],
      });
      toast.success("Nộp duyệt khóa học thành công!");
      router.push(`/instructor/courses`);
    },
    onError: (error: ApiError) => {
      toast.error(error?.message || "Lỗi khi nộp duyệt khóa học!");
    },
  });

  return {
    submitCourseForReview: mutateAsync,
    isPending,
  };
}

// Course Reviews Hooks
export function useGetCourseReviews(params: CourseReviewParams) {
  const { data, isLoading, refetch, isFetching, isError } = useQuery<
    CourseReviewListResponse,
    Error,
    {
      reviews: CourseReview[];
      count: number;
      page: number;
      pageSize: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    }
  >({
    queryKey: [
      "course-reviews",
      params.courseId,
      params.pageNumber,
      params.pageSize,
      params.isDescending,
    ],
    queryFn: () => fetchCourse.getCourseReviews(params),
    select: (data) => ({
      reviews: data.data,
      count: data.metadata?.totalItems ?? data.data.length ?? 0,
      page: data.metadata?.pageNumber ?? 1,
      pageSize: data.metadata?.pageSize ?? params.pageSize ?? 10,
      totalPages: data.metadata?.totalPages ?? 1,
      hasNextPage: data.metadata?.hasNextPage ?? false,
      hasPreviousPage: data.metadata?.hasPreviousPage ?? false,
    }),
    placeholderData: keepPreviousData,
    enabled: !!params.courseId,
  });

  return {
    reviews: data?.reviews ?? [],
    count: data?.count ?? 0,
    page: data?.page ?? 1,
    pageSize: data?.pageSize ?? 10,
    totalPages: data?.totalPages ?? 0,
    hasNextPage: data?.hasNextPage ?? false,
    hasPreviousPage: data?.hasPreviousPage ?? false,
    isLoading,
    refetch,
    isFetching,
    isError,
  };
}

export function useCreateCourseReview() {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (review: CreateCourseReviewRequest) => fetchCourse.createCourseReview(review),
    onSuccess: (data, variables) => {
      // Invalidate course reviews for the specific course
      queryClient.invalidateQueries({
        queryKey: ["course-reviews", variables.courseId],
      });
      // Also invalidate course details to refresh rating
      queryClient.invalidateQueries({
        queryKey: ["course", "summary", variables.courseId],
      });
      queryClient.invalidateQueries({
        queryKey: ["course", "details", variables.courseId],
      });
      toast.success("Đánh giá khóa học thành công!");
    },
    onError: (error: ApiError) => {
      toast.error(error?.message || "Đánh giá khóa học thất bại!");
    },
  });

  return {
    createReview: mutateAsync,
    isPending,
  };
}

export function useApproveCourse() {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: ({ id, notes }: { id: string; notes: string | null }) =>
      fetchCourse.approveCourse(id, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["course"],
      });
      toast.success("Phê duyệt khóa học thành công!");
    },
    onError: (error: ApiError) => {
      toast.error(error?.message || "Lỗi khi phê duyệt khóa học!");
    },
  });

  return {
    approveCourse: mutateAsync,
    isPending,
  };
}

export function useRejectCourse() {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string | null }) =>
      fetchCourse.rejectCourse(id, reason ?? ""),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["course"],
      });
      toast.success("Từ chối khóa học thành công!");
    },
    onError: (error: ApiError) => {
      toast.error(error?.message || "Lỗi khi từ chối khóa học!");
    },
  });

  return {
    rejectCourse: mutateAsync,
    isPending,
  };
}

export function usePublishCourse() {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: ({ id }: { id: string }) => fetchCourse.publishCourse(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["course"],
      });
      queryClient.invalidateQueries({
        queryKey: ["courses"],
      });
      toast.success("Công khai khóa học thành công!");
    },
    onError: (error: ApiError) => {
      toast.error(error?.message || "Lỗi khi công khai khóa học!");
    },
  });

  return {
    publishCourse: mutateAsync,
    isPending,
  };
}

export function useUnpublishCourse() {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: ({ id }: { id: string }) => fetchCourse.unpublishCourse(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["course"],
      });
      queryClient.invalidateQueries({
        queryKey: ["courses"],
      });
      toast.success("Ẩn khóa học thành công!");
    },
    onError: (error: ApiError) => {
      toast.error(error?.message || "Lỗi khi ẩn khóa học!");
    },
  });

  return {
    unpublishCourse: mutateAsync,
    isPending,
  };
}

export function useDeleteCourse() {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: ({ id }: { id: string }) => fetchCourse.deleteCourse(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["course"],
      });
      queryClient.invalidateQueries({
        queryKey: ["courses", "instructor"],
      });
      toast.success("Xóa khóa học thành công!");
    },
    onError: (error: ApiError) => {
      toast.error(error?.message || "Lỗi khi xóa khóa học!");
    },
  });

  return {
    deleteCourse: mutateAsync,
    isPending,
  };
}

export function usePublishCourses() {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: ({ ids }: { ids: string[] }) => fetchCourse.publicCourses(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["course"],
      });
      queryClient.invalidateQueries({
        queryKey: ["courses", "instructor"],
      });
      toast.success("Công khai khóa học thành công!");
    },
    onError: (error: ApiError) => {
      toast.error(error?.message || "Lỗi khi công khai khóa học!");
    },
  });

  return {
    publishCourses: mutateAsync,
    isPending,
  };
}

// Get top 10 most popular courses
export function useGetMostPopularCourses() {
  const { data, isLoading, refetch, isFetching, isError } = useQuery<
    PublicCourseResponse,
    Error,
    Course[]
  >({
    queryKey: ["courses", "most-popular", "top-10"],
    queryFn: () => fetchCourse.getMostPopularCourses(),
    select: (data) => data.data,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    courses: data ?? [],
    isLoading,
    refetch,
    isFetching,
    isError,
  };
}

export function useUpdateCourseDiscount() {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCourseDiscountRequest }) =>
      fetchCourse.updateCourseDiscount(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["course"],
      });
      queryClient.invalidateQueries({
        queryKey: ["courses", "instructor", "instructor-stats"],
      });
      toast.success("Cập nhật giảm giá khóa học thành công!");
    },
    onError: (error: ApiError) => {
      toast.error(error?.message || "Lỗi khi cập nhật giảm giá khóa học!");
    },
  });

  return {
    updateCourseDiscount: mutateAsync,
    isPending,
  };
}

export function useGetCourseCertificateConfig(courseId: string, options?: { enabled?: boolean }) {
  const { data, isLoading, refetch, isFetching, isError } = useQuery<
    CourseCertificateConfigResponse,
    Error
  >({
    queryKey: ["course-certificate-config", courseId],
    queryFn: () => fetchCourse.getCourseCertificateConfig(courseId),
    enabled: options?.enabled !== undefined ? options.enabled : !!courseId,
  });

  return {
    courseCertificateConfig: data?.data,
    isLoading,
    refetch,
    isFetching,
    isError,
  };
}

export function useUpdateCourseCertificateConfig() {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: ({
      courseId,
      data,
    }: {
      courseId: string;
      data: UpdateCourseCertificateConfigRequest;
    }) => fetchCourse.updateCourseCertificateConfig(courseId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["course"],
      });
      queryClient.invalidateQueries({
        queryKey: ["course-certificate-config"],
      });
      queryClient.invalidateQueries({
        queryKey: ["courses", "instructor", "instructor-stats"],
      });
      toast.success("Cập nhật cấu hình điều kiện cấp chứng chỉ khóa học thành công!");
    },
    onError: (error: ApiError) => {
      toast.error(error?.message || "Lỗi khi cập nhật cấu hình điều kiện cấp chứng chỉ khóa học!");
    },
  });

  return {
    updateCourseCertificateConfig: mutateAsync,
    isPending,
  };
}

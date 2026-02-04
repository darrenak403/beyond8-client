import {
  Course,
  CourseDetail,
  CourseDetailResponse,
  CourseDocument,
  CourseDocumentResponse,
  CourseParams,
  CourseRequest,
  CourseResponse,
  CourseSummary,
  CourseSummaryResponse,
  CourseUpdateRequest,
  CreateCourseDocumentRequest,
  PublicCourseParams,
  PublicCourseResponse,
  SearchCourseParams,
  UpdateCourseDocumentRequest,
  fetchCourse,
} from "@/lib/api/services/fetchCourse";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiError } from "next/dist/server/api-utils";
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
      pageSize: data.metadata?.pageSize ?? (filterParams?.pageSize ?? 10),
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

export function useGetCourseSummary(id: string) {
  const { data, isLoading, isError, refetch } = useQuery<CourseSummaryResponse, Error, CourseSummary>({
    queryKey: ["course", "summary", id],
    queryFn: () => fetchCourse.getCourseSummary(id),
    select: (data) => data.data,
    enabled: !!id,
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
  const { data, isLoading, isError, refetch } = useQuery<CourseDetailResponse, Error, CourseDetail>({
    queryKey: ["course", "details", id],
    queryFn: () => fetchCourse.getCourseDetails(id),
    select: (data) => data.data,
    // Cho phép truyền enabled từ ngoài để kiểm soát khi nào được phép fetch details
    enabled: options?.enabled ?? !!id,
  });

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
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["course"],
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
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["course"],
      });
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
    mutationFn: ({ id, courseData }: { id: string; courseData: Partial<UpdateCourseDocumentRequest> }) =>
      fetchCourse.updateCourseDocument(id, courseData),
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
  const { data, isLoading, isError, refetch } = useQuery<CourseDocumentResponse, Error, CourseDocument[]>({
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
    mutationFn: ({ id }: { id: string }) =>
      fetchCourse.deleteCourseDocument(id),
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
    mutationFn: ({ id }: { id: string }) =>
      fetchCourse.toggleDownloadCourseDocument(id),
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


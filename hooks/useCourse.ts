import {
  Course,
  CourseParams,
  CourseRequest,
  CourseResponse,
  CourseUpdateRequest,
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

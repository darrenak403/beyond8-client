import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchEnroll,
  EnrollmentResponse,
  CheckEnrollmentResponse,
} from "@/lib/api/services/fetchEnroll";
import { toast } from "sonner";

interface UseCheckEnrollmentOptions {
  enabled?: boolean;
}

// Hook kiểm tra xem user hiện tại đã enroll khoá học hay chưa
export function useCheckEnrollment(
  courseId?: string,
  options?: UseCheckEnrollmentOptions
) {
  const { data, isLoading, isError, refetch } = useQuery<
    CheckEnrollmentResponse,
    Error,
    boolean
  >({
      queryKey: ["enrollments", "check", courseId],
    queryFn: () => fetchEnroll.checkEnrollment(courseId as string),
    enabled: options?.enabled ?? !!courseId,
    select: (res) => res.data,
  });

  return {
    isEnrolled: data ?? false,
    isLoading,
    isError,
    refetch,
  };
}

// Hook để enroll khoá học cho user hiện tại
export function useEnrollCourse() {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation<
    EnrollmentResponse,
    Error,
    string
  >({
    mutationFn: (courseId: string) => fetchEnroll.enrollCourse(courseId),
    onSuccess: (data, courseId) => {
      // Cập nhật lại trạng thái enroll và course summary sau khi tham gia khoá học
      queryClient.invalidateQueries({
        queryKey: ["enrollments", "check", courseId],
      });
      queryClient.invalidateQueries({
        queryKey: ["course", "summary", courseId],
      });
      queryClient.invalidateQueries({
        queryKey: ["course", "details", courseId],
      });

      if (data.isSuccess) {
        toast.success("Tham gia khóa học thành công!");
      } else {
        toast.error(data.message || "Không thể tham gia khóa học!");
      }
    },
    onError: (error) => {
      toast.error(error.message || "Không thể tham gia khóa học!");
    },
  });

  return {
    enrollCourse: mutateAsync,
    isPending,
  };
}


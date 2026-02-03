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

export function useMediaVideoLesson() {
  const queryClient = useQueryClient();

  const uploadThumnailVideoLessonMutation = useMutation({
    mutationFn: async (file: File) => {
      return await mediaService.uploadThumnailVideoLesson(file);
    },
    onSuccess: (data: MediaFile) => {
      toast.success("Upload ảnh thumbnail video bài học thành công!");
      queryClient.invalidateQueries({ queryKey: ["media"] });
      return data;
    },
    onError: (error: Error) => {
      toast.error(error.message || "Upload ảnh thumbnail video thất bại!");
    },
  });

  const uploadVideoLessonMutation = useMutation({
    mutationFn: async (file: File) => {
      return await mediaService.uploadVideoLesson(file);
    },
    onSuccess: (data: MediaFile) => {
      toast.success("Upload video bài học thành công!");
      queryClient.invalidateQueries({ queryKey: ["media"] });
      return data;
    },
    onError: (error: Error) => {
      toast.error(error.message || "Upload video thất bại!");
    },
  });

  return {
    uploadThumnailVideoLesson: uploadThumnailVideoLessonMutation.mutate,
    uploadThumnailVideoLessonAsync: uploadThumnailVideoLessonMutation.mutateAsync,
    isUploadingThumnailVideoLesson: uploadThumnailVideoLessonMutation.isPending,
    uploadThumnailVideoLessonError: uploadThumnailVideoLessonMutation.error,
    uploadedThumnailVideoLesson: uploadThumnailVideoLessonMutation.data,

    uploadVideoLesson: uploadVideoLessonMutation.mutate,
    uploadVideoLessonAsync: uploadVideoLessonMutation.mutateAsync,
    isUploadingVideoLesson: uploadVideoLessonMutation.isPending,
    uploadVideoLessonError: uploadVideoLessonMutation.error,
    uploadedVideoLesson: uploadVideoLessonMutation.data,
  };
}

export function useMediaDocumentCourse() {
  const queryClient = useQueryClient();

  const uploadDocumentCourseMutation = useMutation({
    mutationFn: async (file: File) => {
      return await mediaService.uploadDocumentCourse(file);
    },
    onSuccess: (data: MediaFile) => {
      toast.success("Upload tài liệu khóa học thành công!");
      queryClient.invalidateQueries({ queryKey: ["media"] });
      return data;
    },
    onError: (error: Error) => {
      toast.error(error.message || "Upload tài liệu khóa học thất bại!");
    },
  });

  return {
    uploadDocumentCourse: uploadDocumentCourseMutation.mutate,
    uploadDocumentCourseAsync: uploadDocumentCourseMutation.mutateAsync,
    isUploadingDocumentCourse: uploadDocumentCourseMutation.isPending,
    uploadDocumentCourseError: uploadDocumentCourseMutation.error,
    uploadedDocumentCourse: uploadDocumentCourseMutation.data,
  };
}


import type { ApiResponse } from "@/types/api";
import apiService from "../core";
import axios from "axios";

// Types
export interface PresignedUrlRequest {
  fileName: string;
  contentType: string;
  size: number;
  metadata?: Record<string, unknown> | null;
}

export interface PresignedUrlResponse {
  fileId: string;
  presignedUrl: string;
  fileKey: string;
  expiresAt: string;
  fileName: string;
  contentType: string;
}

export interface ConfirmUploadRequest {
  fileId: string;
}

export interface MediaFile {
  id: string;
  userId: string;
  provider: "S3" | "Local";
  filePath: string;
  fileUrl: string;
  originalFileName: string;
  contentType: string;
  extension: string;
  size: number;
  status: "Pending" | "Confirmed" | "Failed";
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

export const mediaService = {
  getAvatarPresignedUrl: async (
    request: PresignedUrlRequest
  ): Promise<ApiResponse<PresignedUrlResponse>> => {
    const response = await apiService.post<ApiResponse<PresignedUrlResponse>>(
      "api/v1/media/avatar/presigned-url",
      request
    );
    return response.data;
  },

  getCoverPresignedUrl: async (
    request: PresignedUrlRequest
  ): Promise<ApiResponse<PresignedUrlResponse>> => {
    const response = await apiService.post<ApiResponse<PresignedUrlResponse>>(
      "api/v1/media/cover/presigned-url",
      request
    );
    return response.data;
  },

  // Identity Card presigned URLs
  getIdentityCardFrontPresignedUrl: async (
    request: PresignedUrlRequest
  ): Promise<ApiResponse<PresignedUrlResponse>> => {
    const response = await apiService.post<ApiResponse<PresignedUrlResponse>>(
      "api/v1/media/identity-card/front/presigned-url",
      request
    );
    return response.data;
  },

  getIdentityCardBackPresignedUrl: async (
    request: PresignedUrlRequest
  ): Promise<ApiResponse<PresignedUrlResponse>> => {
    const response = await apiService.post<ApiResponse<PresignedUrlResponse>>(
      "api/v1/media/identity-card/back/presigned-url",
      request
    );
    return response.data;
  },

  // Certificate presigned URL
  getCertificatePresignedUrl: async (
    request: PresignedUrlRequest
  ): Promise<ApiResponse<PresignedUrlResponse>> => {
    const response = await apiService.post<ApiResponse<PresignedUrlResponse>>(
      "api/v1/media/certificate/presigned-url",
      request
    );
    return response.data;
  },

  // Intro video presigned URL
  getIntroVideoPresignedUrl: async (
    request: PresignedUrlRequest
  ): Promise<ApiResponse<PresignedUrlResponse>> => {
    const response = await apiService.post<ApiResponse<PresignedUrlResponse>>(
      "api/v1/media/intro-video/presigned-url",
      request
    );
    return response.data;
  },

  uploadToPresignedUrl: async (presignedUrl: string, file: File): Promise<void> => {
    await axios.put(presignedUrl, file, {
      headers: {
        "Content-Type": file.type,
      },
    });
  },

  confirmUpload: async (
    request: ConfirmUploadRequest
  ): Promise<ApiResponse<MediaFile>> => {
    const response = await apiService.post<ApiResponse<MediaFile>>(
      "api/v1/media/confirm",
      request
    );
    return response.data;
  },

  getMediaFile: async (fileId: string): Promise<ApiResponse<MediaFile>> => {
    const response = await apiService.get<ApiResponse<MediaFile>>(
      `api/v1/media/${fileId}`
    );
    return response.data;
  },

  uploadAvatar: async (file: File): Promise<MediaFile> => {
    const presignedResponse = await mediaService.getAvatarPresignedUrl({
      fileName: file.name,
      contentType: file.type,
      size: file.size,
      metadata: null,
    });

    if (!presignedResponse.isSuccess || !presignedResponse.data) {
      throw new Error(presignedResponse.message || "Failed to get presigned URL");
    }

    const { fileId, presignedUrl } = presignedResponse.data;

    await mediaService.uploadToPresignedUrl(presignedUrl, file);

    const confirmResponse = await mediaService.confirmUpload({ fileId });

    if (!confirmResponse.isSuccess || !confirmResponse.data) {
      throw new Error(confirmResponse.message || "Failed to confirm upload");
    }

    const mediaResponse = await mediaService.getMediaFile(fileId);

    if (!mediaResponse.isSuccess || !mediaResponse.data) {
      throw new Error(mediaResponse.message || "Failed to get media file");
    }

    return mediaResponse.data;
  },

  uploadCover: async (file: File): Promise<MediaFile> => {
    const presignedResponse = await mediaService.getCoverPresignedUrl({
      fileName: file.name,
      contentType: file.type,
      size: file.size,
      metadata: null,
    });

    if (!presignedResponse.isSuccess || !presignedResponse.data) {
      throw new Error(presignedResponse.message || "Failed to get presigned URL");
    }

    const { fileId, presignedUrl } = presignedResponse.data;

    await mediaService.uploadToPresignedUrl(presignedUrl, file);

    const confirmResponse = await mediaService.confirmUpload({ fileId });

    if (!confirmResponse.isSuccess || !confirmResponse.data) {
      throw new Error(confirmResponse.message || "Failed to confirm upload");
    }

    const mediaResponse = await mediaService.getMediaFile(fileId);

    if (!mediaResponse.isSuccess || !mediaResponse.data) {
      throw new Error(mediaResponse.message || "Failed to get media file");
    }

    return mediaResponse.data;
  },

  // Upload identity card with full flow
  uploadIdentityCardFront: async (file: File): Promise<MediaFile> => {
    const presignedResponse = await mediaService.getIdentityCardFrontPresignedUrl({
      fileName: file.name,
      contentType: file.type,
      size: file.size,
      metadata: null,
    });

    if (!presignedResponse.isSuccess || !presignedResponse.data) {
      throw new Error(presignedResponse.message || "Không thể lấy URL tải lên");
    }

    const { fileId, presignedUrl } = presignedResponse.data;

    await mediaService.uploadToPresignedUrl(presignedUrl, file);

    const confirmResponse = await mediaService.confirmUpload({ fileId });

    if (!confirmResponse.isSuccess || !confirmResponse.data) {
      throw new Error(confirmResponse.message || "Không thể xác nhận tải lên");
    }

    const mediaResponse = await mediaService.getMediaFile(fileId);

    if (!mediaResponse.isSuccess || !mediaResponse.data) {
      throw new Error(mediaResponse.message || "Không thể lấy thông tin file");
    }

    return mediaResponse.data;
  },

  uploadIdentityCardBack: async (file: File): Promise<MediaFile> => {
    const presignedResponse = await mediaService.getIdentityCardBackPresignedUrl({
      fileName: file.name,
      contentType: file.type,
      size: file.size,
      metadata: null,
    });

    if (!presignedResponse.isSuccess || !presignedResponse.data) {
      throw new Error(presignedResponse.message || "Không thể lấy URL tải lên");
    }

    const { fileId, presignedUrl } = presignedResponse.data;

    await mediaService.uploadToPresignedUrl(presignedUrl, file);

    const confirmResponse = await mediaService.confirmUpload({ fileId });

    if (!confirmResponse.isSuccess || !confirmResponse.data) {
      throw new Error(confirmResponse.message || "Không thể xác nhận tải lên");
    }

    const mediaResponse = await mediaService.getMediaFile(fileId);

    if (!mediaResponse.isSuccess || !mediaResponse.data) {
      throw new Error(mediaResponse.message || "Không thể lấy thông tin file");
    }

    return mediaResponse.data;
  },

  // Upload certificate with full flow
  uploadCertificate: async (file: File): Promise<MediaFile> => {
    const presignedResponse = await mediaService.getCertificatePresignedUrl({
      fileName: file.name,
      contentType: file.type,
      size: file.size,
      metadata: null,
    });

    if (!presignedResponse.isSuccess || !presignedResponse.data) {
      throw new Error(presignedResponse.message || "Không thể lấy URL tải lên chứng chỉ");
    }

    const { fileId, presignedUrl } = presignedResponse.data;

    await mediaService.uploadToPresignedUrl(presignedUrl, file);

    const confirmResponse = await mediaService.confirmUpload({ fileId });

    if (!confirmResponse.isSuccess || !confirmResponse.data) {
      throw new Error(confirmResponse.message || "Không thể xác nhận tải lên chứng chỉ");
    }

    const mediaResponse = await mediaService.getMediaFile(fileId);

    if (!mediaResponse.isSuccess || !mediaResponse.data) {
      throw new Error(mediaResponse.message || "Không thể lấy thông tin file chứng chỉ");
    }

    return mediaResponse.data;
  },

  // Upload intro video with full flow
  uploadIntroVideo: async (file: File): Promise<MediaFile> => {
    const presignedResponse = await mediaService.getIntroVideoPresignedUrl({
      fileName: file.name,
      contentType: file.type,
      size: file.size,
      metadata: null,
    });

    if (!presignedResponse.isSuccess || !presignedResponse.data) {
      throw new Error(presignedResponse.message || "Không thể lấy URL tải lên video");
    }

    const { fileId, presignedUrl } = presignedResponse.data;

    await mediaService.uploadToPresignedUrl(presignedUrl, file);

    const confirmResponse = await mediaService.confirmUpload({ fileId });

    if (!confirmResponse.isSuccess || !confirmResponse.data) {
      throw new Error(confirmResponse.message || "Không thể xác nhận tải lên video");
    }

    const mediaResponse = await mediaService.getMediaFile(fileId);

    if (!mediaResponse.isSuccess || !mediaResponse.data) {
      throw new Error(mediaResponse.message || "Không thể lấy thông tin file video");
    }

    return mediaResponse.data;
  },
};

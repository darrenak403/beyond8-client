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
  // Step 1: Get presigned URL for avatar upload
  getAvatarPresignedUrl: async (
    request: PresignedUrlRequest
  ): Promise<ApiResponse<PresignedUrlResponse>> => {
    const response = await apiService.post<ApiResponse<PresignedUrlResponse>>(
      "api/v1/media/avatar/presigned-url",
      request
    );
    return response.data;
  },

  // Step 1: Get presigned URL for cover upload
  getCoverPresignedUrl: async (
    request: PresignedUrlRequest
  ): Promise<ApiResponse<PresignedUrlResponse>> => {
    const response = await apiService.post<ApiResponse<PresignedUrlResponse>>(
      "api/v1/media/cover/presigned-url",
      request
    );
    return response.data;
  },

  // Step 2: Upload file to presigned URL
  uploadToPresignedUrl: async (presignedUrl: string, file: File): Promise<void> => {
    await axios.put(presignedUrl, file, {
      headers: {
        "Content-Type": file.type,
      },
    });
  },

  // Step 3: Confirm upload
  confirmUpload: async (
    request: ConfirmUploadRequest
  ): Promise<ApiResponse<MediaFile>> => {
    const response = await apiService.post<ApiResponse<MediaFile>>(
      "api/v1/media/confirm",
      request
    );
    return response.data;
  },

  // Step 4: Get media file info
  getMediaFile: async (fileId: string): Promise<ApiResponse<MediaFile>> => {
    const response = await apiService.get<ApiResponse<MediaFile>>(
      `api/v1/media/${fileId}`
    );
    return response.data;
  },

  // Complete avatar upload flow
  uploadAvatar: async (file: File): Promise<MediaFile> => {
    // Step 1: Get presigned URL
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

    // Step 2: Upload to presigned URL
    await mediaService.uploadToPresignedUrl(presignedUrl, file);

    // Step 3: Confirm upload
    const confirmResponse = await mediaService.confirmUpload({ fileId });

    if (!confirmResponse.isSuccess || !confirmResponse.data) {
      throw new Error(confirmResponse.message || "Failed to confirm upload");
    }

    // Step 4: Get final media file info
    const mediaResponse = await mediaService.getMediaFile(fileId);

    if (!mediaResponse.isSuccess || !mediaResponse.data) {
      throw new Error(mediaResponse.message || "Failed to get media file");
    }

    return mediaResponse.data;
  },

  // Complete cover upload flow
  uploadCover: async (file: File): Promise<MediaFile> => {
    // Step 1: Get presigned URL for cover
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

    // Step 2: Upload to presigned URL
    await mediaService.uploadToPresignedUrl(presignedUrl, file);

    // Step 3: Confirm upload
    const confirmResponse = await mediaService.confirmUpload({ fileId });

    if (!confirmResponse.isSuccess || !confirmResponse.data) {
      throw new Error(confirmResponse.message || "Failed to confirm upload");
    }

    // Step 4: Get final media file info
    const mediaResponse = await mediaService.getMediaFile(fileId);

    if (!mediaResponse.isSuccess || !mediaResponse.data) {
      throw new Error(mediaResponse.message || "Failed to get media file");
    }

    return mediaResponse.data;
  },
};

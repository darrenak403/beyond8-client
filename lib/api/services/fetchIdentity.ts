import type { ApiResponse } from "@/types/api";
import apiService from "../core";
import { mediaService, type MediaFile } from "./fetchMedia";

export interface IsIdentityCardResponse {
  img: string | null;
  fileName: string | null;
  liveness: string;
  liveness_msg: string;
  face_swapping: boolean;
  fake_liveness: boolean;
}

export interface ClassifyRequest {
  img: string;
  is_front: boolean;
}

export interface ClassifyResponse {
  type_name: string;
  card_name: string;
  id_number: string | null;
  issue_date: string | null;
}

export interface IdentityCardUploadResult {
  fileUrl: string;
  fileId: string;
  classifyResult: ClassifyResponse;
  isFront: boolean;
}

export const identityService = {
  isIdentityCard: async (file: File): Promise<ApiResponse<IsIdentityCardResponse>> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiService.post<ApiResponse<IsIdentityCardResponse>>(
      "api/v1/vnpt-ekyc/is-identity-card",
      formData
    );
    return response.data;
  },

  classifyIdentityCard: async (
    request: ClassifyRequest
  ): Promise<ApiResponse<ClassifyResponse>> => {
    const response = await apiService.post<ApiResponse<ClassifyResponse>>(
      "api/v1/vnpt-ekyc/classify",
      request
    );
    return response.data;
  },

  uploadIdentityCard: async (
    file: File,
    isFront: boolean
  ): Promise<IdentityCardUploadResult> => {
    const isIdentityResponse = await identityService.isIdentityCard(file);

    if (!isIdentityResponse.isSuccess || !isIdentityResponse.data) {
      throw new Error(isIdentityResponse.message || "Không phải ảnh CCCD hợp lệ");
    }

    const { img } = isIdentityResponse.data;

    if (!img) {
      throw new Error("Không thể xử lý ảnh CCCD");
    }

    const classifyResponse = await identityService.classifyIdentityCard({
      img,
      is_front: isFront,
    });

    if (!classifyResponse.isSuccess || !classifyResponse.data) {
      throw new Error(classifyResponse.message || "Không thể phân loại ảnh CCCD");
    }

    const mediaFile: MediaFile = isFront
      ? await mediaService.uploadIdentityCardFront(file)
      : await mediaService.uploadIdentityCardBack(file);

    return {
      fileUrl: mediaFile.fileUrl,
      fileId: mediaFile.id,
      classifyResult: classifyResponse.data,
      isFront,
    };
  },
};

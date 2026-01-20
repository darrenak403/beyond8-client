import type { ApiResponse } from "@/types/api";
import apiService from "../core";

export interface UpdateAvatarRequest {
  fileUrl: string;
}

export interface UpdateCoverRequest {
  fileUrl: string;
}

export const ImageService = {
  // Update user avatar
  updateAvatar: async (
    request: UpdateAvatarRequest
  ): Promise<ApiResponse<null>> => {
    const response = await apiService.post<ApiResponse<null>>(
      "api/v1/users/avatar",
      request
    );
    return response.data;
  },

  // Update user cover
  updateCover: async (
    request: UpdateCoverRequest
  ): Promise<ApiResponse<null>> => {
    const response = await apiService.post<ApiResponse<null>>(
      "api/v1/users/cover",
      request
    );
    return response.data;
  },
};

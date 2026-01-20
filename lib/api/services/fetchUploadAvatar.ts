import type { ApiResponse } from "@/types/api";
import apiService from "../core";

export interface UpdateAvatarRequest {
  fileUrl: string;
}

export const avatarService = {
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
};

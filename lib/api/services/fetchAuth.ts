import type { ApiResponse } from "@/types/api";
import apiService from "../core";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  isSuccess: boolean;
  message: string;
  data: token;
  metadata: unknown;
}

export interface LogoutResponse {
  isSuccess: boolean;
  message: string;
  data: unknown;
  metadata: unknown;
}

export interface token {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  tokenType: string;
}

export const fetchAuth = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiService.post<LoginResponse>("api/v1/auth/login", data);
    return response.data;
  },

  logout: async (): Promise<LogoutResponse> => {
    const response = await apiService.post<LogoutResponse>("api/v1/auth/logout");
    return response.data;
  }
};

import type { ApiResponse } from "@/types/api";
import apiService from "../core";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface VerifyOtpRequest {
  email: string;
  otpCode: string;
}

export interface ResetPasswordRequest {
  email: string;
  otpCode: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  id: string;
  email: string;
  fullName: string;
  dateOfBirth: string | null;
  avatarUrl: string | null;
  coverUrl: string | null;
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

  register: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiService.post<LoginResponse>("api/v1/auth/register", data);
    return response.data;
  },

  verifyOtpRegister: async (data: VerifyOtpRequest): Promise<LoginResponse> => {
    const response = await apiService.post<LoginResponse>("/api/v1/auth/register/verify-otp", data);
    return response.data;
  },

  verifyOtpForgotPassword: async (data: VerifyOtpRequest): Promise<LoginResponse> => {
    const response = await apiService.post<LoginResponse>("/api/v1/auth/forgot-password/verify-otp", data);
    return response.data;
  },

  forgotPassword: async (email: string): Promise<ApiResponse<unknown>> => {
    const response = await apiService.post<ApiResponse<unknown>>("api/v1/auth/forgot-password", { email });
    return response.data;
  },

  resendOtp: async (email: string): Promise<ApiResponse<unknown>> => {
    const response = await apiService.post<ApiResponse<unknown>>("api/v1/auth/resend-otp", { email });
    return response.data;
  },

  resetPassword: async (data: ResetPasswordRequest): Promise<ApiResponse<unknown>> => {
    const response = await apiService.post<ApiResponse<unknown>>("api/v1/auth/reset-password", data);
    return response.data;
  },

  changePassword: async (data: ChangePasswordRequest): Promise<ApiResponse<ChangePasswordResponse>> => {
    const response = await apiService.put<ApiResponse<ChangePasswordResponse>>("api/v1/auth/change-password", data);
    return response.data;
  },

  logout: async (): Promise<LogoutResponse> => {
    const response = await apiService.post<LogoutResponse>("api/v1/auth/logout");
    return response.data;
  }
};

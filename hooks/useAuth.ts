import { fetchAuth, LoginRequest, LoginResponse, ResetPasswordRequest, token, VerifyOtpRequest } from '@/lib/api/services/fetchAuth';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks'
import { selectAuth, selectUser, selectIsAuthenticated, setToken, decodeToken, logout } from '@/lib/redux/slices/authSlice'
import { Roles } from '@/lib/types/roles'
import { ApiResponse } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteCookie, setCookie } from 'cookies-next';
import { getAuthCookieConfig } from '@/utils/cookieConfig';
import { useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';


export function useLogin() {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const [error, setError] = useState<string | null>(null);
  const [needsOtpVerification, setNeedsOtpVerification] = useState(false);
  const [verifyKey, setVerifyKey] = useState<string | null>(null);
  const router = useRouter();

  const { mutate: mutateLogin, isPending: isLoading } = useMutation({
    mutationFn: async (credentials: LoginRequest): Promise<LoginResponse> => {
      const response = await fetchAuth.login(credentials);
      if (!response.isSuccess) {
        throw new Error(response.message);
      }
      return response;
    },
    onSuccess: (data) => {
      dispatch(setToken(data.data.accessToken));
      setCookie('authToken', data.data.accessToken, getAuthCookieConfig());
      queryClient.invalidateQueries({ queryKey: ['auth'] });
      setError(null);

      const user = decodeToken(data.data.accessToken);

      toast.success('Đăng nhập thành công!');

      if (user?.role === Roles.Admin) {
        router.push('/admin/dashboard');
      } else if (user?.role === Roles.Instructor) {
        router.push('/instructor/dashboard');
      } else if (user?.role === Roles.Student) {
        router.push('/courses');
      }
    },
    onError: (error: LoginResponse) => {
      toast.error(error.message || 'Đăng nhập thất bại!');
    },
  });

  return {
    mutateLogin,
    isLoading,
    error,
    needsOtpVerification,
    verifyKey,
  };
}

export function useRegister() {
  const queryClient = useQueryClient();
  const { mutate: mutateRegister, isPending: isLoading } = useMutation({
    mutationFn: async (credentials: LoginRequest): Promise<LoginResponse> => {
      const response = await fetchAuth.register(credentials);
      queryClient.invalidateQueries({ queryKey: ['auth'] });
      if (!response.isSuccess) {
        throw new Error(response.message);
      }
      return response;
    },
    onSuccess: (data) => {
      toast.success('Đăng ký thành công! Vui lòng xác thực OTP.');
    },
    onError: (error: LoginResponse) => {
      toast.error(error.message || 'Đăng ký thất bại!');
    },
  });

  return {
    mutateRegister,
    isLoading,
  };
}

export function useVerifyOtpRegister() {
  const queryClient = useQueryClient();

  const { mutate: mutateVerifyOtpRegister, isPending: isLoading } = useMutation({
    mutationFn: async (data: VerifyOtpRequest): Promise<LoginResponse> => {
      const response = await fetchAuth.verifyOtpRegister(data);
      if (!response.isSuccess) {
        throw new Error(response.message);
      }
      return response;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
    onError: (error: LoginResponse) => {
      toast.error(error.message || 'Xác thực thất bại!');
    },
  });

  return {
    mutateVerifyOtpRegister,
    isLoading,
  };
}

export function useVerifyOtpForgotPassword() {
  const queryClient = useQueryClient();

  const { mutate: mutateVerifyOtpForgotPassword, isPending: isLoading } = useMutation({
    mutationFn: async (data: VerifyOtpRequest): Promise<LoginResponse> => {
      const response = await fetchAuth.verifyOtpForgotPassword(data);
      if (!response.isSuccess) {
        throw new Error(response.message);
      }
      return response;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['auth'] });
      toast.success('Xác thực OTP thành công!');
    },
    onError: (error: LoginResponse) => {
      toast.error(error.message || 'Xác thực thất bại!');
    },
  });

  return {
    mutateVerifyOtpForgotPassword,
    isLoading,
  };
}

export function useForgotPassword() {
  const queryClient = useQueryClient();
  const { mutate: mutateForgotPassword, isPending: isLoading } = useMutation({
    mutationFn: async (email: string) => {
      const response = await fetchAuth.forgotPassword(email);
      if (!response.isSuccess) {
        throw new Error(String(response.message));
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth'] });
      toast.success('Mã OTP đã được gửi đến email của bạn!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Gửi mã thất bại!');
    },
  });

  return {
    mutateForgotPassword,
    isLoading,
  };
}

export function useResetPassword() {
  const queryClient = useQueryClient();
  const { mutate: mutateResetPassword, isPending: isLoading } = useMutation({
    mutationFn: async (data: ResetPasswordRequest) => {
      const response = await fetchAuth.resetPassword(data);
      if (!response.isSuccess) {
        throw new Error(String(response.message));
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth'] });
      toast.success('Đặt lại mật khẩu thành công!', {
        description: 'Vui lòng đăng nhập lại với mật khẩu mới.',
      });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Đặt lại mật khẩu thất bại!');
    },
  });

  return {
    mutateResetPassword,
    isLoading,
  };
}

export function useChangePassword() {
  const queryClient = useQueryClient();

  const { mutate: mutateChangePassword, isPending: isLoading } = useMutation({
    mutationFn: async (data: { oldPassword: string; newPassword: string }) => {
      const response = await fetchAuth.changePassword(data);
      if (!response.isSuccess) {
        throw new Error(String(response.message));
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      toast.success('Đổi mật khẩu thành công!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Đổi mật khẩu thất bại!');
    },
  });

  return {
    mutateChangePassword,
    isLoading,
  };
}

export function useResendOtp() {
  const queryClient = useQueryClient();
  const { mutate: mutateResendOtp, isPending: isLoading } = useMutation({
    mutationFn: async (email: string) => {
      const response = await fetchAuth.resendOtp(email);
      if (!response.isSuccess) {
        throw new Error(String(response.message));
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth'] });
      toast.success('Mã OTP đã được gửi lại đến email của bạn!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Gửi lại mã thất bại!');
    },
  });

  return {
    mutateResendOtp,
    isLoading,
  };
}

export function useLogout() {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { mutate: mutateLogout, isPending: isLoading } = useMutation({
    mutationFn: async () => {
      const response = await fetchAuth.logout();
      if (!response.isSuccess) {
        throw new Error(response.message);
      }
      return response;
    },
    onSuccess: () => {
      dispatch(logout());
      deleteCookie('authToken');
      queryClient.invalidateQueries({ queryKey: ['auth'] });
      toast.success('Đăng xuất thành công!');
      router.push('/login');
    },
    onError: (error: LoginResponse) => {
      toast.error(error.message || 'Đăng xuất thất bại!');
    },
  });

  return {
    mutateLogout,
    isLoading,
  };
}

export function useAuth() {
  const auth = useAppSelector(selectAuth)
  const user = useAppSelector(selectUser)
  const isAuthenticated = useAppSelector(selectIsAuthenticated)

  return {
    ...auth,
    user,
    isAuthenticated,
    role: user?.role,
    isAdmin: user?.role === Roles.Admin,
    isInstructor: user?.role === Roles.Instructor,
    isStudent: user?.role === Roles.Student,
  }
}

import { fetchAuth, LoginRequest, LoginResponse, token } from '@/lib/api/services/fetchAuth';
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

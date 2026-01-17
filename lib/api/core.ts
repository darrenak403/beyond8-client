/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, {AxiosInstance, AxiosRequestConfig, AxiosResponse} from 'axios'
import {deleteCookie} from 'cookies-next'
import {store} from '@/lib/redux/store'
import {logout} from '@/lib/redux/slices/authSlice'

export interface ApiError {
  code?: number
  message: string
  status: boolean
  data?: unknown
}

class ApiService {
  private client: AxiosInstance
  private authToken: string | null = null

  constructor(baseURL: string, timeout = 10000) {
    this.client = axios.create({
      baseURL,
      timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    // Request Interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add auth token from Redux store
        const token = store.getState().auth.token
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }

        // Handle FormData - remove Content-Type to let browser set it with boundary
        if (config.data instanceof FormData) {
          delete config.headers['Content-Type']
        }

        return config
      },
      (error) => Promise.reject(error)
    )

    // Response Interceptor
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        // Handle 401 Unauthorized
        if (error.response?.status === 401) {
          deleteCookie('auth-token', {path: '/'})
          store.dispatch(logout())

          // Dispatch logout event for other tabs/windows
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('logout'))
          }
        }

        // Standardize error format
        const apiError: ApiError = {
          code: error.response?.status,
          message: error.response?.data?.message || error.message || 'Có lỗi xảy ra',
          status: false,
          data: error.response?.data,
        }

        return Promise.reject(apiError)
      }
    )
  }

  // Set auth token manually (for initial sync)
  setAuthToken(token: string | null) {
    this.authToken = token
  }

  // Generic request method
  async request<T>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    try {
      return await this.client.request<T>(config)
    } catch (error) {
      throw error
    }
  }

  // GET with query params
  async get<T>(url: string, params?: Record<string, any>): Promise<AxiosResponse<T>> {
    return this.request<T>({
      method: 'GET',
      url,
      params: params ? new URLSearchParams(params) : undefined,
    })
  }

  // POST
  async post<T, D = any>(url: string, data?: D): Promise<AxiosResponse<T>> {
    return this.request<T>({
      method: 'POST',
      url,
      data,
    })
  }

  // PUT
  async put<T, D = any>(url: string, data?: D): Promise<AxiosResponse<T>> {
    return this.request<T>({
      method: 'PUT',
      url,
      data,
    })
  }

  // PATCH
  async patch<T, D = any>(url: string, data?: D): Promise<AxiosResponse<T>> {
    return this.request<T>({
      method: 'PATCH',
      url,
      data,
    })
  }

  // DELETE
  async delete<T>(url: string): Promise<AxiosResponse<T>> {
    return this.request<T>({
      method: 'DELETE',
      url,
    })
  }

  // File upload with progress
  async upload<T>(
    url: string,
    formData: FormData,
    onProgress?: (progress: number) => void
  ): Promise<AxiosResponse<T>> {
    return this.request<T>({
      method: 'POST',
      url,
      data: formData,
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          onProgress(percentCompleted)
        }
      },
    })
  }
}

// Singleton instance
const apiService = new ApiService(
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  600000 // 10 minutes timeout
)

export default apiService


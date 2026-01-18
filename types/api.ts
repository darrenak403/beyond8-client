// API Response Types
export interface ApiResponse<T> {
  isSuccess: boolean
  message: string
  data: T
  metadata: unknown
}

export interface ApiError {
  isSuccess: boolean
  message: string
  data: unknown
  metadata: unknown
}


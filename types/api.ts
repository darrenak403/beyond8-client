// API Response Types
export interface ApiResponse<T> {
  code: number
  status: boolean
  message: string
  data: T
}

export interface ApiError {
  code?: number
  message: string
  status: boolean
  data?: unknown
}


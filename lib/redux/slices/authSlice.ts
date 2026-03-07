/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { setCookie, deleteCookie } from 'cookies-next'
import { jwtDecode } from 'jwt-decode'
import apiService from '@/lib/api/core'
import { fetchAuth } from '@/lib/api/services/fetchAuth'
import { getAuthCookieConfig } from '@/utils/cookieConfig'
import type { RootState, AppDispatch } from '../store'

// Types
export interface User {
  id: string
  email: string
  userNname: string
  role: string[]
}

export interface DecodedToken extends User {
  nbf?: number
  exp?: number
  iat?: number
}

interface AuthState {
  user: User | null
  token: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

// Global timer reference for auto-refresh
let refreshTimer: NodeJS.Timeout | null = null

// Initial state
const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
}

// Helper to decode token safely
export const decodeToken = (token: string): User | null => {
  try {
    const decoded: any = jwtDecode(token)

    // Normalize role to array if it is a string
    if (decoded.role && !Array.isArray(decoded.role)) {
      decoded.role = [decoded.role]
    }

    return decoded as User
  } catch (error) {
    console.error('Failed to decode token:', error)
    return null
  }
}

// Helper to decode token with expiration info
export const decodeTokenWithExpiry = (token: string): DecodedToken | null => {
  try {
    const decoded: any = jwtDecode(token)

    // Normalize role to array if it is a string
    if (decoded.role && !Array.isArray(decoded.role)) {
      decoded.role = [decoded.role]
    }

    return {
      ...decoded,
      nbf: decoded.nbf,
      exp: decoded.exp,
      iat: decoded.iat,
    } as DecodedToken
  } catch (error) {
    console.error('Failed to decode token:', error)
    return null
  }
}

// Helper to setup auto-refresh timer
export const setupAutoRefresh = (token: string, dispatch: AppDispatch) => {
  // Clear existing timer
  if (refreshTimer) {
    clearTimeout(refreshTimer)
    refreshTimer = null
  }

  const decoded = decodeTokenWithExpiry(token)
  if (!decoded || !decoded.exp || !decoded.nbf) {
    console.warn('Token does not have expiration info')
    return
  }

  // Calculate when to refresh (2 minutes before expiration)
  const refreshTime = decoded.exp * 1000 - Date.now() - 2 * 60 * 1000 // 2 minutes in milliseconds

  if (refreshTime <= 0) {
    // Token expires in less than 2 minutes, refresh immediately
    dispatch(refreshTokenAsync())
    return
  }

  // Set timer to refresh token 2 minutes before expiration
  refreshTimer = setTimeout(() => {
    dispatch(refreshTokenAsync())
  }, refreshTime)

  console.log(`Auto-refresh scheduled in ${Math.round(refreshTime / 1000)} seconds`)
}

// Helper to clear auto-refresh timer
export const clearAutoRefresh = () => {
  if (refreshTimer) {
    clearTimeout(refreshTimer)
    refreshTimer = null
  }
}

// Async thunks
export const loginAsync = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await fetchAuth.login(credentials)

      if (response.isSuccess && response.data.accessToken) {
        const token = response.data.accessToken
        const user = decodeToken(token)

        setCookie('authToken', token, getAuthCookieConfig())
        apiService.setAuthToken(token)

        return { token, user }
      }

      return rejectWithValue(response.message || 'Login failed')
    } catch (error: any) {
      return rejectWithValue(error.message || 'Login failed')
    }
  }
)

export const logoutAsync = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await apiService.post('/auth/logout')
    deleteCookie('authToken', { path: '/' })
    apiService.setAuthToken(null)
    return true
  } catch (error: any) {
    return rejectWithValue(error.message)
  }
})

export const refreshTokenAsync = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await apiService.post<{
        status: boolean
        data: { accessToken: string }
      }>('/auth/refresh')

      if (response.data.status && response.data.data.accessToken) {
        const token = response.data.data.accessToken
        const user = decodeToken(token)

        setCookie('authToken', token, getAuthCookieConfig())
        apiService.setAuthToken(token)

        // Setup auto-refresh for the new token
        setupAutoRefresh(token, dispatch as AppDispatch)

        return { token, user }
      }

      return rejectWithValue('Refresh failed')
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = true
      state.error = null
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload
      apiService.setAuthToken(action.payload)

      const user = decodeToken(action.payload)
      if (user) {
        state.user = user
        state.isAuthenticated = true
      }
    },
    setTokenWithRefresh: (state, action: PayloadAction<{ accessToken: string; refreshToken: string }>) => {
      state.token = action.payload.accessToken
      state.refreshToken = action.payload.refreshToken
      apiService.setAuthToken(action.payload.accessToken)

      const user = decodeToken(action.payload.accessToken)
      if (user) {
        state.user = user
        state.isAuthenticated = true
      }
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.refreshToken = null
      state.isAuthenticated = false
      state.error = null
      deleteCookie('authToken', { path: '/' })
      apiService.setAuthToken(null)
      clearAutoRefresh()
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginAsync.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.isLoading = false
        state.token = action.payload.token
        state.user = action.payload.user
        state.isAuthenticated = true
        state.error = null
        // Setup auto-refresh will be handled by the component/hook that calls loginAsync
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Logout
    builder
      .addCase(logoutAsync.pending, (state) => {
        state.isLoading = true
      })
      .addCase(logoutAsync.fulfilled, (state) => {
        state.user = null
        state.token = null
        state.isAuthenticated = false
        state.isLoading = false
        state.error = null
      })
      .addCase(logoutAsync.rejected, (state) => {
        state.isLoading = false
      })

    // Refresh Token
    builder
      .addCase(refreshTokenAsync.fulfilled, (state, action) => {
        state.token = action.payload.token
        state.user = action.payload.user
        state.isAuthenticated = true
        // Auto-refresh is already setup in the thunk
      })
      .addCase(refreshTokenAsync.rejected, (state) => {
        state.user = null
        state.token = null
        state.isAuthenticated = false
        clearAutoRefresh()
      })
  },
})

// Actions
export const { setCredentials, setToken, setTokenWithRefresh, logout, clearError } = authSlice.actions

// Selectors
export const selectAuth = (state: RootState) => state.auth
export const selectUser = (state: RootState) => state.auth.user
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated
export const selectAuthToken = (state: RootState) => state.auth.token
export const selectRefreshToken = (state: RootState) => state.auth.refreshToken

export default authSlice.reducer

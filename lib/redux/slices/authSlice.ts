/* eslint-disable @typescript-eslint/no-explicit-any */
import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit'
import {setCookie, deleteCookie} from 'cookies-next'
import {jwtDecode} from 'jwt-decode'
import apiService from '@/lib/api/core'
import type {RootState} from '../store'

// Types
export interface User {
  id: string
  email: string
  name: string
  role: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

// Initial state
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
}

// Async thunks
export const loginAsync = createAsyncThunk(
  'auth/login',
  async (credentials: {email: string; password: string}, {rejectWithValue}) => {
    try {
      const response = await apiService.post<{
        status: boolean
        data: {accessToken: string; user: User}
      }>('/auth/login', credentials)

      if (response.data.status && response.data.data.accessToken) {
        const token = response.data.data.accessToken

        setCookie('auth-token', token, {maxAge: 7 * 24 * 60 * 60, path: '/'})
        apiService.setAuthToken(token)

        return {token, user: response.data.data.user}
      }

      return rejectWithValue('Login failed')
    } catch (error: any) {
      return rejectWithValue(error.message || 'Login failed')
    }
  }
)

export const logoutAsync = createAsyncThunk('auth/logout', async (_, {rejectWithValue}) => {
  try {
    await apiService.post('/auth/logout')
    deleteCookie('auth-token', {path: '/'})
    apiService.setAuthToken(null)
    return true
  } catch (error: any) {
    return rejectWithValue(error.message)
  }
})

export const refreshTokenAsync = createAsyncThunk(
  'auth/refreshToken',
  async (_, {rejectWithValue}) => {
    try {
      const response = await apiService.post<{
        status: boolean
        data: {accessToken: string}
      }>('/auth/refresh')

      if (response.data.status && response.data.data.accessToken) {
        const token = response.data.data.accessToken
        setCookie('auth-token', token, {maxAge: 24 * 60 * 60, path: '/'})
        apiService.setAuthToken(token)
        return token
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
    setCredentials: (state, action: PayloadAction<{user: User; token: string}>) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = true
      state.error = null
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload
      apiService.setAuthToken(action.payload)

      try {
        const decoded = jwtDecode<User>(action.payload)
        state.user = decoded
        state.isAuthenticated = true
      } catch (error) {
        console.error('Failed to decode token:', error)
      }
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.error = null
      deleteCookie('auth-token', {path: '/'})
      apiService.setAuthToken(null)
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
        state.token = action.payload
      })
      .addCase(refreshTokenAsync.rejected, (state) => {
        state.user = null
        state.token = null
        state.isAuthenticated = false
      })
  },
})

// Actions
export const {setCredentials, setToken, logout, clearError} = authSlice.actions

// Selectors
export const selectAuth = (state: RootState) => state.auth
export const selectUser = (state: RootState) => state.auth.user
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated
export const selectAuthToken = (state: RootState) => state.auth.token

export default authSlice.reducer


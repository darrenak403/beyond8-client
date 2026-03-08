# 🚀 NEXT.JS FULL-STACK FRONTEND - COMPLETE SETUP GUIDE

Hướng dẫn setup từ đầu project Next.js 16 với Redux Toolkit, TanStack React Query, **Tailwind CSS v4**, SignalR real-time, RBAC Middleware.

**Đã được kiểm chứng từ project Beyond8 (AI Learning Platform) - Copy đúng code dưới đây!**

> ⚠️ **Lưu ý Tailwind v4**: Project này dùng Tailwind CSS v4. **Không có `tailwind.config.ts`** — thay vào đó dùng `@theme {}` trong `globals.css` và `@tailwindcss/postcss` plugin. Xem Section 2 để biết thêm.

---

## 📋 MỤC LỤC

1. [Cài đặt Dependencies](#1-cài-đặt-dependencies)
2. [Cấu hình môi trường](#2-cấu-hình-môi-trường)
3. [Cài đặt Code Quality Tools](#3-cài-đặt-code-quality-tools)
4. [Cấu trúc thư mục](#4-cấu-trúc-thư-mục)
5. [File Types](#5-file-types)
6. [API Service Core](#6-api-service-core)
7. [Redux Store & Auth](#7-redux-store--auth)
8. [Providers](#8-providers)
9. [SignalR Real-time](#9-signalr-real-time)
10. [Layout & Globals](#10-layout--globals)
11. [Middleware RBAC](#11-middleware-rbac)
12. [Utils & Hooks](#12-utils--hooks)
13. [File mẫu API Service](#13-file-mẫu-api-service)
14. [Checklist cuối](#14-checklist-cuối)

---

## 1. CÀI ĐẶT DEPENDENCIES

### Bước 1: Cài đặt tất cả dependencies

```bash
# Core Framework
npm install next@latest react@latest react-dom@latest typescript @types/react @types/node

# State Management & Data Fetching
npm install @reduxjs/toolkit react-redux redux-persist
npm install @tanstack/react-query axios
npm install -D @tanstack/react-query-devtools

# UI & Styling (Tailwind v4 — KHÔNG cần autoprefixer standalone)
npm install tailwindcss @tailwindcss/postcss
npm install class-variance-authority clsx tailwind-merge
npm install lucide-react @iconify/react
npm install next-themes

# Radix UI primitives (cài theo nhu cầu)
npm install @radix-ui/react-accordion @radix-ui/react-alert-dialog @radix-ui/react-avatar
npm install @radix-ui/react-checkbox @radix-ui/react-dialog @radix-ui/react-dropdown-menu
npm install @radix-ui/react-label @radix-ui/react-popover @radix-ui/react-progress
npm install @radix-ui/react-radio-group @radix-ui/react-scroll-area @radix-ui/react-select
npm install @radix-ui/react-separator @radix-ui/react-slider @radix-ui/react-slot
npm install @radix-ui/react-switch @radix-ui/react-tabs @radix-ui/react-toast
npm install @radix-ui/react-tooltip

# Forms & Validation (primary: react-hook-form + zod; secondary: formik + yup)
npm install react-hook-form @hookform/resolvers zod
npm install formik yup

# Data Tables
npm install @tanstack/react-table

# Animation
npm install framer-motion gsap motion

# Rich Text Editor (TipTap)
npm install @tiptap/react @tiptap/starter-kit @tiptap/core @tiptap/pm
npm install @tiptap/extension-text-align @tiptap/extension-underline

# Video Streaming
npm install hls.js @vidstack/react

# Real-time (SignalR WebSocket)
npm install @microsoft/signalr

# Carousel
npm install embla-carousel-react

# OTP Input
npm install input-otp

# Charts & Analytics
npm install recharts

# Image Processing
npm install react-easy-crop

# Notifications (toast)
npm install sonner

# Utilities
npm install cookies-next jwt-decode dayjs date-fns js-cookie
npm install crypto-js bcryptjs
npm install -D @types/js-cookie

# Code Quality
npm install -D eslint prettier
```

### Bước 2: Tạo file cấu hình

```bash
# Tailwind v4 KHÔNG cần init — chỉ tạo postcss.config.mjs thủ công (xem Section 2)
# Không cần: npx tailwindcss init -p
```

---

## 2. CẤU HÌNH MÔI TRƯỜNG

### `.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/
NEXT_PUBLIC_APP_NAME=My App
NEXT_PUBLIC_APP_URL=http://localhost:5173
NEXT_PUBLIC_CRYPTO_SECRET_KEY=your-secret-key-here
NEXT_PUBLIC_ENV=development
```

> ⚠️ **Production**: Set `NEXT_PUBLIC_ENV=production` và `NEXT_PUBLIC_API_URL` trỏ đến API server production.

### `next.config.ts`

```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'utfs.io' },          // UploadThing
      { protocol: 'https', hostname: 'github.com' },
      { protocol: 'https', hostname: '*.cloudfront.net' }, // AWS CloudFront CDN
      // Thêm các domain ảnh khác tùy project
    ],
  },
}

export default nextConfig
```

---

> ## ⚠️ TAILWIND CSS V4 — KHÔNG dùng `tailwind.config.ts`
>
> Tailwind v4 đã thay đổi hoàn toàn cách cấu hình. Không cần file `tailwind.config.ts`. Thay vào đó:
> - Dùng `@import "tailwindcss"` thay cho `@tailwind base/components/utilities`
> - Định nghĩa token màu/spacing trong `globals.css` với directive `@theme {}`
> - PostCSS chỉ cần plugin `@tailwindcss/postcss` (không cần `autoprefixer` standalone)
>
> **Nếu vẫn muốn dùng Tailwind v3**: `npm install tailwindcss@3 autoprefixer` và chạy `npx tailwindcss init -p`

### `postcss.config.mjs` (Tailwind v4)

```javascript
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}

export default config
```

### `app/globals.css` (Tailwind v4)

```css
@import "tailwindcss";
/* Nếu dùng Vidstack player: */
/* @import '@vidstack/react/player/styles/base.css'; */

@layer base {
  :root {
    /* Brand Colors — Tùy chỉnh theo project */
    --brand-pink: #f4449b;
    --brand-magenta: #ad1c9a;
    --brand-purple: #67178d;
    --brand-dark: #0a000e;

    /* Base */
    --background: #ffffff;
    --foreground: #0a000e;

    /* Primary */
    --primary: #ad1c9a;
    --primary-foreground: #ffffff;

    /* Secondary */
    --secondary: #67178d;
    --secondary-foreground: #ffffff;

    /* Accent */
    --accent: #f4449b;
    --accent-foreground: #ffffff;

    /* Muted */
    --muted: #f3f4f6;
    --muted-foreground: #6b7280;

    /* Destructive */
    --destructive: #ef4444;
    --destructive-foreground: #ffffff;

    /* Border & Input */
    --border: #e5e7eb;
    --input: #e5e7eb;
    --ring: #ad1c9a;

    /* Card */
    --card: #ffffff;
    --card-foreground: #0a000e;

    /* Popover */
    --popover: #ffffff;
    --popover-foreground: #0a000e;

    /* Border Radius */
    --radius: 0.5rem;
  }
}

/* Tailwind v4: ánh xạ CSS variables → utility classes */
@theme {
  --color-brand-pink: var(--brand-pink);
  --color-brand-magenta: var(--brand-magenta);
  --color-brand-purple: var(--brand-purple);
  --color-brand-dark: var(--brand-dark);

  --color-background: var(--background);
  --color-foreground: var(--foreground);

  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);

  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);

  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);

  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);

  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);

  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);

  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);

  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);

  --radius-lg: var(--radius);
  --radius-md: calc(var(--radius) - 2px);
  --radius-sm: calc(var(--radius) - 4px);

  /* Fonts — đặt tên theo font Google bạn dùng */
  --font-sans: var(--font-quicksand);
  --font-serif: var(--font-open-sans);
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

### `utils/cookieConfig.ts`

```typescript
interface CookieOptions {
  maxAge?: number
  path?: string
  secure?: boolean
  sameSite?: 'strict' | 'lax' | 'none'
  httpOnly?: boolean
  domain?: string
}

function getCookieDomain(): string | undefined {
  const isProduction =
    process.env.NODE_ENV === 'production' ||
    process.env.NEXT_PUBLIC_ENV === 'production'

  if (!isProduction) return undefined

  // Ở production: set domain để cookie hoạt động trên tất cả subdomain
  // Ví dụ: ".yourdomain.com" → hoạt động cho app.yourdomain.com, api.yourdomain.com
  return process.env.NEXT_PUBLIC_COOKIE_DOMAIN || undefined
}

export function getSecureCookieConfig(customOptions: Partial<CookieOptions> = {}): CookieOptions {
  const isProduction =
    process.env.NODE_ENV === 'production' ||
    process.env.NEXT_PUBLIC_ENV === 'production'
  const isSecureEnvironment =
    typeof window !== 'undefined'
      ? window.location.protocol === 'https:'
      : isProduction

  const defaultConfig: CookieOptions = {
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
    secure: isSecureEnvironment,
    sameSite: isProduction ? 'strict' : 'lax',
    httpOnly: false, // false = JavaScript có thể đọc (cần cho client-side auth check)
    domain: getCookieDomain(),
  }

  return { ...defaultConfig, ...customOptions }
}

export function getAuthCookieConfig(rememberMe = false): CookieOptions {
  return getSecureCookieConfig({
    maxAge: rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 7, // 30 days or 7 days
  })
}
```

---

## 3. CÀI ĐẶT CODE QUALITY TOOLS

### Bước 1: Cài đặt ESLint & Prettier

ESLint và Prettier đã được cài từ bước 1. Kiểm tra file config:

### `eslint.config.mjs`

```javascript
import {defineConfig, globalIgnores} from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
])

export default eslintConfig
```

### `.prettierrc` (tạo file mới)

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": false,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false
}
```

### `.prettierignore` (tạo file mới)

```
.next
out
build
dist
node_modules
*.lock
package-lock.json
.env*
```

---

## 4. CẤU TRÚC THƯ MỤC

Tạo các thư mục sau:

```
your-project/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   ├── (auth)/
│   │   ├── layout.tsx
│   │   └── login/ register/ reset-password/
│   ├── (admin)/
│   │   └── admin/dashboard/
│   ├── (instructor)/
│   │   └── instructor/dashboard/
│   └── (student)/
│       └── layout.tsx
├── components/
│   ├── ui/          # Base components (button, card, input…)
│   ├── layout/      # Header, Footer
│   └── widget/      # Feature-specific widgets
├── lib/
│   ├── api/
│   │   ├── core.ts
│   │   └── services/
│   │       └── fetchAuth.ts   # Pattern: fetchXxx.ts
│   ├── redux/
│   │   ├── store.ts
│   │   ├── hooks.ts
│   │   └── slices/
│   │       └── authSlice.ts
│   ├── providers/
│   │   ├── reduxProvider.tsx
│   │   ├── queryProvider.tsx
│   │   ├── signalRProvider.tsx
│   │   └── index.tsx
│   ├── realtime/
│   │   └── signalr.ts
│   ├── types/
│   │   └── roles.ts
│   └── utils/
│       ├── cn.ts
│       ├── formatCurrency.ts
│       ├── formatDate.ts
│       ├── formatImageUrl.ts
│       └── generateSlug.ts
├── hooks/
│   ├── useAuth.ts
│   ├── useSignalR.ts
│   └── useSignalRNotifications.ts
├── types/
│   ├── api.ts
│   └── models.ts
├── utils/
│   └── cookieConfig.ts
├── middleware.ts
└── .env.local
```

Tạo thư mục:

```bash
mkdir -p lib/api/services lib/redux/slices lib/providers lib/realtime lib/types lib/utils hooks types utils components/ui components/layout components/widget
```

---

## 5. FILE TYPES

### `types/api.ts`

```typescript
// API Response - shape của response từ backend
export interface ApiResponse<T> {
  isSuccess: boolean      // hoặc dùng `status: boolean` tùy backend
  message: string
  data: T
  metadata?: unknown
}

export interface ApiError {
  code?: number
  message: string
  status: boolean
  data?: unknown
}

// Request params chung
export interface RequestParams {
  [key: string]: string | number | boolean | undefined | null | string[]
}
```

### `types/models.ts`

```typescript
// User Model
export interface User {
  id: string
  email: string
  userNname: string   // tên trường tùy backend — đổi thành fullName/name nếu cần
  role: string[]      // QUAN TRỌNG: role là ARRAY, không phải string đơn
  avatarUrl?: string
}

// Decoded JWT Token
export interface DecodedToken extends User {
  nbf?: number
  exp?: number
  iat?: number
}
```

### `lib/types/roles.ts`

```typescript
// Role constants — dùng trong middleware và RBAC checks
export const ROLE_ADMIN = 'ROLE_ADMIN'
export const ROLE_INSTRUCTOR = 'ROLE_INSTRUCTOR'
export const ROLE_STUDENT = 'ROLE_STUDENT'

export type UserRole = typeof ROLE_ADMIN | typeof ROLE_INSTRUCTOR | typeof ROLE_STUDENT
```

---

## 6. API SERVICE CORE

### `lib/api/core.ts`

**⚠️ QUAN TRỌNG: Bao gồm Token Refresh Queue — tự động retry request sau khi refresh token!**

```typescript
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { deleteCookie } from 'cookies-next'
import { store } from '@/lib/redux/store'
import { logout } from '@/lib/redux/slices/authSlice'

export interface ApiError {
  code?: number
  message: string
  status: boolean
  data?: unknown
}

export interface RequestParams {
  [key: string]: string | number | boolean | undefined | null | string[]
}

class ApiService {
  private client: AxiosInstance
  private authToken: string | null = null
  private isRefreshing = false
  // Queue: lưu các request 401 để retry sau khi refresh token thành công
  private failedQueue: Array<{
    resolve: (token: string) => void
    reject: (error: any) => void
  }> = []

  constructor(baseURL: string, timeout = 600000) {
    this.client = axios.create({
      baseURL,
      timeout,
      headers: { 'Content-Type': 'application/json' },
    })
    this.setupInterceptors()
  }

  private processQueue(error: any, token: string | null = null) {
    this.failedQueue.forEach((prom) => {
      if (error) prom.reject(error)
      else prom.resolve(token!)
    })
    this.failedQueue = []
  }

  private setupInterceptors() {
    // Request Interceptor: tự động đính Bearer token
    this.client.interceptors.request.use(
      (config) => {
        const token = store.getState().auth.token
        if (token) config.headers.Authorization = `Bearer ${token}`
        // FormData: bỏ Content-Type để browser tự set boundary
        if (config.data instanceof FormData) delete config.headers['Content-Type']
        return config
      },
      (error) => Promise.reject(error)
    )

    // Response Interceptor: xử lý 401 — refresh token rồi retry
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config

        if (error.response?.status === 401 && !originalRequest._retry) {
          // Nếu đang refresh, thêm request vào queue để retry sau
          if (this.isRefreshing) {
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject })
            })
              .then((token) => {
                originalRequest.headers['Authorization'] = 'Bearer ' + token
                return this.client(originalRequest)
              })
              .catch((err) => Promise.reject(err))
          }

          originalRequest._retry = true
          this.isRefreshing = true

          try {
            const refreshToken = store.getState().auth.refreshToken
            if (!refreshToken) throw new Error('No refresh token')

            // Dùng axios thuần để tránh vòng lặp interceptor
            const response = await axios.post(
              `${process.env.NEXT_PUBLIC_API_URL}api/v1/auth/refresh-token`,
              { refreshToken },
              { headers: { 'Content-Type': 'application/json' } }
            )

            if (response.data?.data?.accessToken) {
              const { accessToken, refreshToken: newRefreshToken } = response.data.data

              // Dynamic import để tránh circular dependency
              const { setTokenWithRefresh } = await import('@/lib/redux/slices/authSlice')
              const { setCookie } = await import('cookies-next')
              const { getAuthCookieConfig } = await import('@/utils/cookieConfig')

              store.dispatch(setTokenWithRefresh({ accessToken, refreshToken: newRefreshToken }))
              setCookie('authToken', accessToken, getAuthCookieConfig())
              this.setAuthToken(accessToken)

              this.processQueue(null, accessToken)
              this.isRefreshing = false

              originalRequest.headers['Authorization'] = 'Bearer ' + accessToken
              return this.client(originalRequest)
            }

            throw new Error('Invalid refresh response')
          } catch (refreshError) {
            this.isRefreshing = false
            this.processQueue(refreshError, null)

            deleteCookie('authToken', { path: '/' })
            store.dispatch(logout())

            if (typeof window !== 'undefined') {
              window.dispatchEvent(new Event('logout'))
            }

            return Promise.reject({
              code: 401,
              message: 'Session expired. Please login again.',
              status: false,
            } as ApiError)
          }
        }

        // Standardize error format cho các lỗi khác
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

  setAuthToken(token: string | null) {
    this.authToken = token
  }

  async request<T>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.request<T>(config)
  }

  async get<T>(url: string, params?: Record<string, any>): Promise<AxiosResponse<T>> {
    return this.request<T>({ method: 'GET', url, params })
  }

  async post<T, D = any>(url: string, data?: D): Promise<AxiosResponse<T>> {
    return this.request<T>({ method: 'POST', url, data })
  }

  async put<T, D = any>(url: string, data?: D): Promise<AxiosResponse<T>> {
    return this.request<T>({ method: 'PUT', url, data })
  }

  async patch<T, D = any>(url: string, data?: D): Promise<AxiosResponse<T>> {
    return this.request<T>({ method: 'PATCH', url, data })
  }

  async delete<T>(url: string): Promise<AxiosResponse<T>> {
    return this.request<T>({ method: 'DELETE', url })
  }

  async upload<T>(
    url: string,
    formData: FormData,
    onProgress?: (progress: number) => void
  ): Promise<AxiosResponse<T>> {
    return this.request<T>({
      method: 'POST',
      url,
      data: formData,
      onUploadProgress: (e) => {
        if (onProgress && e.total) {
          onProgress(Math.round((e.loaded * 100) / e.total))
        }
      },
    })
  }
}

// Singleton instance
const apiService = new ApiService(
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/'
)

export default apiService
```

---

## 7. REDUX STORE & AUTH

### `lib/redux/store.ts`

```typescript
import { configureStore, combineReducers } from '@reduxjs/toolkit'
import {
  persistStore,
  persistReducer,
  FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import authSlice from './slices/authSlice'

const rootReducer = combineReducers({
  auth: authSlice,
})

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: ['auth'],
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
```

### `lib/redux/hooks.ts`

```typescript
import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from './store'

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
```

### `lib/redux/slices/authSlice.ts`

**⚠️ QUAN TRỌNG: `role` là `string[]` (array), có `refreshToken` state, auto-refresh timer!**

```typescript
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
  userNname: string   // đổi thành trường tên thực từ JWT payload của backend
  role: string[]      // LUÔN là array
}

export interface DecodedToken extends User {
  nbf?: number
  exp?: number
  iat?: number
}

interface AuthState {
  user: User | null
  token: string | null
  refreshToken: string | null   // lưu refresh token để tự động renew
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

// Global timer cho auto-refresh
let refreshTimer: NodeJS.Timeout | null = null

const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
}

// Decode JWT token an toàn
export const decodeToken = (token: string): User | null => {
  try {
    const decoded: any = jwtDecode(token)
    if (decoded.role && !Array.isArray(decoded.role)) {
      decoded.role = [decoded.role]
    }
    return decoded as User
  } catch {
    return null
  }
}

export const decodeTokenWithExpiry = (token: string): DecodedToken | null => {
  try {
    const decoded: any = jwtDecode(token)
    if (decoded.role && !Array.isArray(decoded.role)) {
      decoded.role = [decoded.role]
    }
    return decoded as DecodedToken
  } catch {
    return null
  }
}

// Lên lịch refresh token 2 phút trước khi hết hạn
export const setupAutoRefresh = (token: string, dispatch: AppDispatch) => {
  if (refreshTimer) { clearTimeout(refreshTimer); refreshTimer = null }

  const decoded = decodeTokenWithExpiry(token)
  if (!decoded?.exp) return

  const refreshTime = decoded.exp * 1000 - Date.now() - 2 * 60 * 1000 // 2 phút trước

  if (refreshTime <= 0) {
    dispatch(refreshTokenAsync())
    return
  }

  refreshTimer = setTimeout(() => dispatch(refreshTokenAsync()), refreshTime)
}

export const clearAutoRefresh = () => {
  if (refreshTimer) { clearTimeout(refreshTimer); refreshTimer = null }
}

// Async Thunks
export const loginAsync = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await fetchAuth.login(credentials)

      if (response.isSuccess && response.data.accessToken) {
        const { accessToken, refreshToken } = response.data
        const user = decodeToken(accessToken)

        setCookie('authToken', accessToken, getAuthCookieConfig())
        apiService.setAuthToken(accessToken)

        return { token: accessToken, refreshToken, user }
      }

      return rejectWithValue(response.message || 'Login failed')
    } catch (error: any) {
      return rejectWithValue(error.message || 'Login failed')
    }
  }
)

export const logoutAsync = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await apiService.post('/api/v1/auth/logout')
    deleteCookie('authToken', { path: '/' })
    apiService.setAuthToken(null)
    clearAutoRefresh()
    return true
  } catch (error: any) {
    return rejectWithValue(error.message)
  }
})

export const refreshTokenAsync = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue, dispatch, getState }) => {
    try {
      const state = getState() as RootState
      const { refreshToken } = state.auth
      if (!refreshToken) return rejectWithValue('No refresh token')

      const response = await apiService.post<{
        isSuccess: boolean
        data: { accessToken: string; refreshToken: string }
      }>('/api/v1/auth/refresh-token', { refreshToken })

      if (response.data.isSuccess && response.data.data.accessToken) {
        const { accessToken, refreshToken: newRefreshToken } = response.data.data
        const user = decodeToken(accessToken)

        setCookie('authToken', accessToken, getAuthCookieConfig())
        apiService.setAuthToken(accessToken)

        setupAutoRefresh(accessToken, dispatch as AppDispatch)

        return { token: accessToken, refreshToken: newRefreshToken, user }
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
    setTokenWithRefresh: (
      state,
      action: PayloadAction<{ accessToken: string; refreshToken: string }>
    ) => {
      state.token = action.payload.accessToken
      state.refreshToken = action.payload.refreshToken
      apiService.setAuthToken(action.payload.accessToken)
      const user = decodeToken(action.payload.accessToken)
      if (user) { state.user = user; state.isAuthenticated = true }
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
    clearError: (state) => { state.error = null },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.pending, (state) => { state.isLoading = true; state.error = null })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.isLoading = false
        state.token = action.payload.token
        state.refreshToken = action.payload.refreshToken ?? null
        state.user = action.payload.user
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    builder
      .addCase(logoutAsync.fulfilled, (state) => {
        state.user = null; state.token = null; state.refreshToken = null
        state.isAuthenticated = false; state.isLoading = false; state.error = null
      })

    builder
      .addCase(refreshTokenAsync.fulfilled, (state, action) => {
        state.token = action.payload.token
        state.refreshToken = action.payload.refreshToken
        state.user = action.payload.user
      })
      .addCase(refreshTokenAsync.rejected, (state) => {
        state.user = null; state.token = null; state.refreshToken = null
        state.isAuthenticated = false
      })
  },
})

export const { setTokenWithRefresh, logout, clearError } = authSlice.actions

// Selectors
export const selectAuth = (state: RootState) => state.auth
export const selectUser = (state: RootState) => state.auth.user
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated
export const selectAuthToken = (state: RootState) => state.auth.token

export default authSlice.reducer
```

---

## 8. PROVIDERS

### `lib/providers/reduxProvider.tsx`

```typescript
'use client'

import { ReactNode } from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from '@/lib/redux/store'

export function ReduxProvider({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  )
}
```

### `lib/providers/queryProvider.tsx`

```typescript
'use client'

import { ReactNode, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,      // 1 phút cache
            refetchOnWindowFocus: false,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
```

### `lib/providers/signalRProvider.tsx`

```typescript
'use client'

import { ReactNode } from 'react'
import { useSignalR } from '@/hooks/useSignalR'
import { useSignalRNotifications } from '@/hooks/useSignalRNotifications'

/**
 * Auto-connects SignalR WebSocket khi app load.
 * Đặt cao trong cây component để giữ 1 connection duy nhất.
 */
export function SignalRProvider({ children }: { children: ReactNode }) {
  useSignalR()
  useSignalRNotifications()
  return <>{children}</>
}
```

### `lib/providers/index.tsx`

**Provider order quan trọng: Redux → Query → SignalR → AuthSync**

```typescript
'use client'

import { ReactNode } from 'react'
import { ReduxProvider } from './reduxProvider'
import { QueryProvider } from './queryProvider'
import { SignalRProvider } from './signalRProvider'
import { useAuthSyncAcrossTabs } from '@/hooks/useAuthSyncAcrossTabs'

// Sync logout giữa các tabs
function AuthSyncProvider({ children }: { children: ReactNode }) {
  useAuthSyncAcrossTabs()
  return <>{children}</>
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ReduxProvider>
      <QueryProvider>
        <SignalRProvider>
          <AuthSyncProvider>{children}</AuthSyncProvider>
        </SignalRProvider>
      </QueryProvider>
    </ReduxProvider>
  )
}
```

### `hooks/useAuthSyncAcrossTabs.ts`

```typescript
'use client'

import { useEffect } from 'react'
import { useAppDispatch } from '@/lib/redux/hooks'
import { logout } from '@/lib/redux/slices/authSlice'

/**
 * Lắng nghe sự kiện logout từ các tab khác.
 * Khi tab A logout → dispatch event → tab B/C/D cũng logout.
 */
export function useAuthSyncAcrossTabs() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const handleLogout = () => dispatch(logout())
    window.addEventListener('logout', handleLogout)
    return () => window.removeEventListener('logout', handleLogout)
  }, [dispatch])
}
```

---

## 9. SIGNALR REAL-TIME

### `lib/realtime/signalr.ts`

```typescript
import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
} from '@microsoft/signalr'
import { store } from '@/lib/redux/store'

export type SignalRStatus = HubConnectionState

let connection: HubConnection | null = null
let startPromise: Promise<void> | null = null

function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/'
}

export function getHubUrl(): string {
  return new URL('/hubs/app', getBaseUrl()).toString()
}

function getAccessToken(): string | null {
  try { return store.getState().auth.token } catch { return null }
}

export function getHubConnection(): HubConnection {
  if (typeof window === 'undefined') throw new Error('SignalR chỉ chạy trên browser')
  if (connection) return connection

  connection = new HubConnectionBuilder()
    .withUrl(getHubUrl(), { accessTokenFactory: () => getAccessToken() || '' })
    .withAutomaticReconnect()
    .configureLogging(
      process.env.NODE_ENV === 'development' ? LogLevel.Information : LogLevel.Warning
    )
    .build()

  connection.onreconnecting((err) => console.info('[SignalR] reconnecting...', err))
  connection.onreconnected((id) => console.info('[SignalR] reconnected:', id))
  connection.onclose((err) => console.info('[SignalR] closed', err))

  return connection
}

export async function startHubConnection(): Promise<HubConnection> {
  const conn = getHubConnection()
  if (conn.state === HubConnectionState.Connected) return conn

  if (conn.state === HubConnectionState.Connecting && startPromise) {
    await startPromise
    return conn
  }

  startPromise = conn.start().then(() => { startPromise = null }).catch((err) => {
    startPromise = null
    throw err
  })

  await startPromise
  return conn
}

export async function stopHubConnection(): Promise<void> {
  if (!connection) return
  try { await connection.stop() } finally { connection = null }
}
```

### `hooks/useSignalR.ts`

```typescript
'use client'

import { useEffect } from 'react'
import { useAppSelector } from '@/lib/redux/hooks'
import { selectIsAuthenticated } from '@/lib/redux/slices/authSlice'
import { startHubConnection, stopHubConnection } from '@/lib/realtime/signalr'

/**
 * Tự động kết nối/ngắt kết nối SignalR dựa trên trạng thái đăng nhập.
 * Dùng trong SignalRProvider.
 */
export function useSignalR() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated)

  useEffect(() => {
    if (!isAuthenticated) return

    startHubConnection().catch((err) => {
      console.error('[useSignalR] failed to connect', err)
    })

    return () => {
      stopHubConnection()
    }
  }, [isAuthenticated])
}
```

### `hooks/useSignalRNotifications.ts`

```typescript
'use client'

import { useEffect } from 'react'
import { toast } from 'sonner'
import { getHubConnection } from '@/lib/realtime/signalr'
import { useAppSelector } from '@/lib/redux/hooks'
import { selectIsAuthenticated } from '@/lib/redux/slices/authSlice'

/**
 * Lắng nghe events từ SignalR và hiện toast notification.
 * Tùy chỉnh các event name theo backend.
 */
export function useSignalRNotifications() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated)

  useEffect(() => {
    if (!isAuthenticated) return

    const connection = getHubConnection()

    // Đăng ký handler cho các event từ server
    const handleNotification = (message: string, title?: string) => {
      toast(title || 'Thông báo', { description: message })
    }

    connection.on('ReceiveNotification', handleNotification)

    return () => {
      connection.off('ReceiveNotification', handleNotification)
    }
  }, [isAuthenticated])
}
```

---

## 10. LAYOUT & GLOBALS

### `app/layout.tsx`

**Dùng Open Sans + Quicksand với Vietnamese subsets, next-themes dark mode, full SEO metadata.**

```typescript
import type { Metadata } from 'next'
import { Open_Sans, Quicksand } from 'next/font/google'
import './globals.css'
import { Providers } from '@/lib/providers'
import { Toaster } from '@/components/ui/sonner'

const openSans = Open_Sans({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-open-sans',
  weight: ['300', '400', '500', '600', '700', '800'],
})

const quicksand = Quicksand({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-quicksand',
  weight: ['300', '400', '500', '600', '700'],
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:5173'),
  title: 'My App - Description',
  description: 'App description here',
  keywords: ['keyword1', 'keyword2'],
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: process.env.NEXT_PUBLIC_APP_URL,
    title: 'My App',
    description: 'App description',
    siteName: 'My App',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${openSans.variable} ${quicksand.variable}`}>
        <Providers>
          {children}
          <Toaster position="bottom-center" richColors closeButton />
        </Providers>
      </body>
    </html>
  )
}
```

### `components/ui/sonner.tsx`

```typescript
'use client'

import { useTheme } from 'next-themes'
import { Toaster as Sonner } from 'sonner'

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: 'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
          description: 'group-[.toast]:text-muted-foreground',
          actionButton: 'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
          cancelButton: 'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
```

---

## 11. MIDDLEWARE RBAC

### `middleware.ts`

```typescript
import {NextResponse} from 'next/server'
import type {NextRequest} from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value
  const isAuthPage =
    request.nextUrl.pathname.startsWith('/login') ||
    request.nextUrl.pathname.startsWith('/register')
  const isProtectedPage =
    request.nextUrl.pathname.startsWith('/dashboard') ||
    request.nextUrl.pathname.startsWith('/profile')

  // Redirect to login if accessing protected page without token
  if (isProtectedPage && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Redirect to dashboard if accessing auth page with token
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*', '/login', '/register'],
}
```

**Thay bằng RBAC version đầy đủ dưới đây (đã được test trên production):**

```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtDecode } from 'jwt-decode'

const getUserRoles = (token: string | undefined): string[] => {
  if (!token) return []
  try {
    const decoded = jwtDecode(token) as { role?: string | string[]; exp?: number } | null

    // Token hết hạn — coi như chưa đăng nhập
    if (decoded?.exp && decoded.exp < Math.floor(Date.now() / 1000)) return []

    if (!decoded?.role) return []
    return Array.isArray(decoded.role) ? decoded.role : [decoded.role]
  } catch {
    return []
  }
}

const hasRole = (roles: string[], target: string) => roles.includes(target)

const getPrimaryRole = (roles: string[]) => {
  if (roles.includes('ROLE_ADMIN')) return 'ROLE_ADMIN'
  if (roles.includes('ROLE_INSTRUCTOR')) return 'ROLE_INSTRUCTOR'
  if (roles.includes('ROLE_STUDENT')) return 'ROLE_STUDENT'
  return null
}

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl
  const token = request.cookies.get('authToken')?.value
  const userRoles = getUserRoles(token)
  const primaryRole = getPrimaryRole(userRoles)

  // Static files — always accessible
  if (pathname.endsWith('.xml') || pathname.endsWith('.json')) return NextResponse.next()

  const publicRoutes = ['/', '/landing', '/login', '/register', '/reset-password', '/courses', '/supscription']
  const authRoutes = ['/login', '/register', '/reset-password']

  const isPublicRoute = publicRoutes.some(r => pathname === r || pathname.startsWith(`${r}/`))
  const isAuthRoute = authRoutes.some(r => pathname === r || pathname.startsWith(`${r}/`))

  // Chưa đăng nhập
  if (!token || userRoles.length === 0) {
    if (isPublicRoute) return NextResponse.next()
    const res = NextResponse.redirect(new URL('/login', request.url))
    if (token) res.cookies.delete('authToken')
    return res
  }

  // Đang ở trang auth mà đã đăng nhập → redirect theo role
  if (isAuthRoute) {
    if (primaryRole === 'ROLE_ADMIN') return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    if (primaryRole === 'ROLE_INSTRUCTOR') return NextResponse.redirect(new URL('/instructor/dashboard', request.url))
    return NextResponse.redirect(new URL('/courses', request.url))
  }

  const isAdminRoute = pathname.startsWith('/admin/')
  const isInstructorRoute = pathname.startsWith('/instructor/')
  const isCoursesRoute = pathname.startsWith('/courses')
  const isMyBeyondRoute = pathname.startsWith('/mybeyond')

  // ADMIN
  if (hasRole(userRoles, 'ROLE_ADMIN')) {
    if (isAdminRoute) return NextResponse.next()
    if (userRoles.length > 1) {
      if (isInstructorRoute && hasRole(userRoles, 'ROLE_INSTRUCTOR')) return NextResponse.next()
      if ((isCoursesRoute || isMyBeyondRoute) && hasRole(userRoles, 'ROLE_STUDENT')) return NextResponse.next()
      if (pathname === '/' || pathname === '/landing') return NextResponse.next()
    }
    if (!isPublicRoute) return NextResponse.redirect(new URL('/admin/dashboard', request.url))
  }

  // INSTRUCTOR
  if (hasRole(userRoles, 'ROLE_INSTRUCTOR')) {
    if (isInstructorRoute || isCoursesRoute || pathname === '/' || pathname === '/landing') return NextResponse.next()
    if (isMyBeyondRoute) {
      const tab = searchParams.get('tab')
      // Giới hạn tab cho instructor — tùy chỉnh theo business logic
      const allowedTabs = [null, 'mycourse', 'myprofile', 'myusage', 'mycertificate', 'payment-history', 'mywallet']
      if (allowedTabs.includes(tab)) return NextResponse.next()
      return NextResponse.redirect(new URL('/mybeyond?tab=myprofile', request.url))
    }
    if (isAdminRoute && !hasRole(userRoles, 'ROLE_ADMIN')) return NextResponse.redirect(new URL('/instructor/dashboard', request.url))
    return NextResponse.next()
  }

  // STUDENT
  if (hasRole(userRoles, 'ROLE_STUDENT')) {
    if (isAdminRoute) return NextResponse.redirect(new URL('/courses', request.url))
    if (isInstructorRoute && !hasRole(userRoles, 'ROLE_INSTRUCTOR')) return NextResponse.redirect(new URL('/courses', request.url))
    if (isCoursesRoute || pathname === '/' || pathname === '/landing') return NextResponse.next()
    if (isMyBeyondRoute) {
      const tab = searchParams.get('tab')
      const allowedTabs = [null, 'mycourse', 'myprofile', 'myusage', 'mycertificate', 'payment-history']
      if (allowedTabs.includes(tab)) return NextResponse.next()
      // Wallet chỉ cho instructor
      if (tab === 'mywallet' && hasRole(userRoles, 'ROLE_INSTRUCTOR')) return NextResponse.next()
      return NextResponse.redirect(new URL('/mybeyond?tab=myprofile', request.url))
    }
    return NextResponse.next()
  }

  // Không có role hợp lệ
  const res = NextResponse.redirect(new URL('/login', request.url))
  res.cookies.delete('authToken')
  return res
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|webm|mp4|xml|glb)$).*)',
  ],
}
```

---

## 12. UTILS & HOOKS

### `lib/utils/cn.ts`

```typescript
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### `lib/utils/formatCurrency.ts`

```typescript
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(value)
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('vi-VN').format(value)
}
```

### `lib/utils/formatImageUrl.ts`

```typescript
export function formatImageUrl(url: string | null | undefined): string | undefined {
  if (!url) return undefined
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  if (url.startsWith('//')) return `https:${url}`
  return `https://${url}`
}
```

### `lib/utils/generateSlug.ts`

```typescript
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // bỏ dấu tiếng Việt
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}
```

### `lib/utils/formatDate.ts`

```typescript
import dayjs from 'dayjs'
import 'dayjs/locale/vi'

dayjs.locale('vi')

export function formatDate(date: string | Date, format = 'DD/MM/YYYY'): string {
  return dayjs(date).format(format)
}

export function formatRelativeTime(date: string | Date): string {
  const now = dayjs()
  const target = dayjs(date)
  const diffDays = now.diff(target, 'day')

  if (diffDays === 0) return 'Hôm nay'
  if (diffDays === 1) return 'Hôm qua'
  if (diffDays < 7) return `${diffDays} ngày trước`
  return target.format('DD/MM/YYYY')
}
```

### `hooks/useAuth.ts`

```typescript
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks'
import {
  loginAsync,
  logoutAsync,
  selectAuth,
  selectUser,
  setupAutoRefresh,
} from '@/lib/redux/slices/authSlice'
import { ROLE_ADMIN, ROLE_INSTRUCTOR, ROLE_STUDENT } from '@/lib/types/roles'

export function useAuth() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const auth = useAppSelector(selectAuth)
  const user = useAppSelector(selectUser)

  const roles = user?.role ?? []
  const isAdmin = roles.includes(ROLE_ADMIN)
  const isInstructor = roles.includes(ROLE_INSTRUCTOR)
  const isStudent = roles.includes(ROLE_STUDENT)

  const login = async (credentials: { email: string; password: string }) => {
    try {
      const result = await dispatch(loginAsync(credentials)).unwrap()

      // Setup auto-refresh sau khi login thành công
      if (result.token) setupAutoRefresh(result.token, dispatch as any)

      toast.success('Đăng nhập thành công')

      // Redirect theo role
      if (roles.includes(ROLE_ADMIN)) router.push('/admin/dashboard')
      else if (roles.includes(ROLE_INSTRUCTOR)) router.push('/instructor/dashboard')
      else router.push('/courses')

      return result
    } catch (error: any) {
      toast.error(error || 'Đăng nhập thất bại')
      throw error
    }
  }

  const logout = async () => {
    try {
      await dispatch(logoutAsync()).unwrap()
      toast.success('Đăng xuất thành công')
      router.push('/login')
    } catch {
      toast.error('Có lỗi xảy ra khi đăng xuất')
    }
  }

  return {
    ...auth,
    user,
    isAdmin,
    isInstructor,
    isStudent,
    login,
    logout,
  }
}
```

---

## 13. FILE MẪU API SERVICE

### `lib/api/services/fetchAuth.ts`

**Pattern đặt tên: `fetchXxx.ts` (không phải `productService.ts`). Đây là mẫu để copy.**

```typescript
import type { ApiResponse } from '@/types/api'
import apiService from '../core'

// ====================================
// Types
// ====================================
export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  isSuccess: boolean
  message: string
  data: {
    accessToken: string
    refreshToken: string
    expiresAt: string
    tokenType: string
  }
  metadata: unknown
}

// ====================================
// Service — MẪU CRUD operations
// ====================================
export const fetchAuth = {
  /**
   * POST /api/v1/auth/login
   */
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiService.post<LoginResponse>('api/v1/auth/login', data)
    return response.data
  },

  /**
   * POST /api/v1/auth/register
   */
  register: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiService.post<LoginResponse>('api/v1/auth/register', data)
    return response.data
  },

  /**
   * POST /api/v1/auth/logout
   */
  logout: async (): Promise<void> => {
    await apiService.post('api/v1/auth/logout')
  },
}
```

### Cách tạo service mới (ví dụ `fetchCourse.ts`)

```typescript
import type { ApiResponse } from '@/types/api'
import apiService from '../core'

export interface Course {
  id: string
  title: string
  // ... các field từ backend
}

export const fetchCourse = {
  getList: async (params?: { search?: string; page?: number }) =>
    (await apiService.get<ApiResponse<Course[]>>('api/v1/courses', params)).data,

  getById: async (id: string) =>
    (await apiService.get<ApiResponse<Course>>(`api/v1/courses/${id}`)).data,

  create: async (data: Partial<Course>) =>
    (await apiService.post<ApiResponse<Course>>('api/v1/courses', data)).data,

  update: async (id: string, data: Partial<Course>) =>
    (await apiService.put<ApiResponse<Course>>(`api/v1/courses/${id}`, data)).data,

  delete: async (id: string) =>
    (await apiService.delete<ApiResponse<void>>(`api/v1/courses/${id}`)).data,
}
```

### Cách dùng với React Query

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchCourse } from '@/lib/api/services/fetchCourse'

function CourseList() {
  const { data, isLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: () => fetchCourse.getList(),
  })

  const queryClient = useQueryClient()

  const createMutation = useMutation({
    mutationFn: fetchCourse.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] })
      toast.success('Tạo khóa học thành công!')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: fetchCourse.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['courses'] }),
  })
}
```

---

## 14. CHECKLIST CUỐI

### ✅ Checklist Setup

**Core Setup**
- [ ] Cài đặt tất cả dependencies (`npm install`)
- [ ] Tạo `.env.local` với đủ các biến môi trường
- [ ] Config `postcss.config.mjs` với `@tailwindcss/postcss`
- [ ] Tạo `app/globals.css` với `@import "tailwindcss"` + `@theme {}`
- [ ] Tạo cấu trúc thư mục đầy đủ (lib/, hooks/, types/, utils/)

**Types & Constants**
- [ ] Tạo `types/api.ts` (`ApiResponse<T>` với `isSuccess`)
- [ ] Tạo `types/models.ts`
- [ ] Tạo `lib/types/roles.ts` (ROLE_ADMIN, ROLE_INSTRUCTOR, ROLE_STUDENT)

**API Layer**
- [ ] Tạo `lib/api/core.ts` (axios với 401 refresh queue)
- [ ] Tạo `lib/api/services/fetchAuth.ts` (mẫu service)

**State Management**
- [ ] Tạo `lib/redux/store.ts` (redux-persist chỉ `auth`)
- [ ] Tạo `lib/redux/hooks.ts`
- [ ] Tạo `lib/redux/slices/authSlice.ts` (`role: string[]`, refreshToken, autoRefresh)

**Providers**
- [ ] Tạo `lib/providers/reduxProvider.tsx`
- [ ] Tạo `lib/providers/queryProvider.tsx`
- [ ] Tạo `lib/providers/signalRProvider.tsx`
- [ ] Tạo `lib/providers/index.tsx` (thứ tự: Redux → Query → SignalR → children)

**Real-time**
- [ ] Tạo `lib/realtime/signalr.ts`
- [ ] Tạo `hooks/useSignalR.ts`
- [ ] Tạo `hooks/useSignalRNotifications.ts`
- [ ] Tạo `hooks/useAuthSyncAcrossTabs.ts`

**Auth & Routing**
- [ ] Tạo `middleware.ts` (RBAC với jwtDecode, getUserRoles)
- [ ] Tạo `utils/cookieConfig.ts` (env-aware cookie settings)
- [ ] Tạo `hooks/useAuth.ts` (với role-aware redirect)

**UI & Layout**
- [ ] Update `app/layout.tsx` (Open Sans + Quicksand, suppressHydrationWarning, Providers, Toaster)
- [ ] Tạo `components/ui/sonner.tsx` (với next-themes)
- [ ] Tạo `lib/utils/cn.ts`

**Utils**
- [ ] Tạo `lib/utils/formatCurrency.ts`
- [ ] Tạo `lib/utils/formatDate.ts`
- [ ] Tạo `lib/utils/formatImageUrl.ts`
- [ ] Tạo `lib/utils/generateSlug.ts`

**Code Quality**
- [ ] Tạo `.prettierrc` và `.prettierignore`
- [ ] Test ESLint: `npm run lint`
- [ ] Test TypeScript: `npm run type-check`
- [ ] **Test pre-commit hook với git commit**

---

### 🚀 Chạy Project

```bash
npm run dev          # Development (port 5173)
npm run build        # Build production
npm start            # Start production (port 5173)
npm run lint         # Lint code
npm run lint:fix     # Fix lint errors
npm run format       # Format code với Prettier
npm run format:check # Check format
npm run type-check   # TypeScript check
npm run validate     # Chạy tất cả checks
```

### 📝 Scripts trong `package.json`

```json
{
  "scripts": {
    "dev": "next dev -p 5173",
    "build": "next build",
    "start": "next start -p 5173",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "format": "prettier --write \"**/*.{js,jsx,ts,tsx,json,css,md}\"",
    "format:check": "prettier --check \"**/*.{js,jsx,ts,tsx,json,css,md}\"",
    "type-check": "tsc --noEmit",
    "validate": "npm run format && npm run lint:fix && npm run type-check"
  }
}
```

> **Lưu ý:** Next.js 15+ không cần `--turbopack` flag (Turbopack là default cho `next dev`).

---

## 🎯 TỔNG KẾT

**✅ Setup đã hoàn tất bao gồm:**

1. **API Layer** — Axios với 401-refresh queue, auto token injection, typed responses (`isSuccess`)
2. **State Management** — Redux Toolkit + redux-persist (chỉ `auth`), role array, auto-refresh timer
3. **Server State** — React Query v5, stale 60s
4. **Authentication** — JWT decode, `role: string[]`, refreshToken, cookie `authToken`, auto-refresh 2 phút trước expiry
5. **RBAC Middleware** — jwtDecode, role-based routing, per-tab mybeyond control
6. **Real-time** — SignalR hub, SignalRProvider, notification hooks, cross-tab auth sync
7. **UI & Styling** — Tailwind v4 (`@import "tailwindcss"` + `@theme {}`), Open Sans + Quicksand, dark mode via next-themes
8. **Utils** — formatCurrency (VND), formatDate (dayjs), formatImageUrl, generateSlug (Vietnamese)
9. **Code Quality** — ESLint + Prettier + TypeScript strict

**🔜 Bước tiếp theo:**

- Tạo trang Login/Register sử dụng `hooks/useAuth.ts`
- Tạo layout Admin/Instructor/Student theo route groups
- Thêm services theo mẫu `fetchAuth.ts` → `fetchXxx.ts`
- Tạo UI components với shadcn/ui

---

**Setup này được extract từ dự án Beyond8 (AI Learning Platform) đang chạy production — copy chính xác để đảm bảo hoạt động!**

# Beyond8 — AI-Powered Learning Management System

<p align="center">
  <img src="/icon-logo.png" alt="Beyond8 Logo" width="200" />
</p>

Beyond8 là nền tảng học trực tuyến (LMS) tích hợp AI, hỗ trợ đa vai trò: **Học viên**, **Giảng viên** và **Quản trị viên**. Nền tảng cho phép học viên mua và học các khóa học video, giảng viên tạo và quản lý nội dung, đồng thời cung cấp bộ công cụ quản trị toàn diện cho admin.

---

## Đội ngũ phát triển

| Thành viên | Vai trò | GitHub |
|------------|---------|--------|
| Trần Phú Thịnh | Frontend Leader | [@ThinhTP204](https://github.com/ThinhTP204) |
| Uông Tuấn Vũ | Frontend Developer | [@tuanvu250](https://github.com/tuanvu250) |

---

## Tính năng cốt lõi

### Học viên
- Duyệt, tìm kiếm và lọc khóa học theo danh mục
- Mua khóa học qua giỏ hàng, áp dụng mã giảm giá
- Học video với HLS streaming, theo dõi tiến độ học
- Làm bài quiz và bài tập (assignment)
- Nhận chứng chỉ hoàn thành khóa học (PDF)
- Quản lý hồ sơ, lịch sử thanh toán, thống kê học tập

### Giảng viên
- Tạo và quản lý khóa học, chương học, bài học
- Quản lý ngân hàng câu hỏi, quiz, bài tập
- Chấm điểm bài nộp của học viên
- Theo dõi doanh thu, quản lý ví và rút tiền
- Tạo mã coupon giảm giá

### Quản trị viên
- Quản lý người dùng, danh mục, khóa học toàn nền tảng
- Duyệt đơn đăng ký trở thành giảng viên
- Quản lý ví nền tảng và giao dịch
- Cấu hình AI prompt và quản lý tính năng AI
- Thống kê tổng quan hệ thống

### Tính năng chung
- Xác thực JWT với tự động refresh token
- Thông báo real-time qua SignalR
- AI Chat tích hợp
- Đăng ký / đăng nhập, quên mật khẩu, xác thực OTP
- Đồng bộ trạng thái đăng xuất giữa các tab

---

## Tech Stack

| Nhóm | Công nghệ |
|------|-----------|
| **Framework** | Next.js 16 (App Router), React 19, TypeScript |
| **Styling** | Tailwind CSS, shadcn/ui, Radix UI |
| **State Management** | Redux Toolkit + redux-persist, TanStack React Query v5 |
| **HTTP Client** | Axios (custom wrapper với interceptor) |
| **Real-time** | Microsoft SignalR |
| **Form** | React Hook Form, Formik |
| **Validation** | Zod, Yup |
| **Animation** | Framer Motion, GSAP |
| **Video** | Vidstack, HLS.js, React Player |
| **Rich Text** | Tiptap, React Markdown |
| **Charts** | Recharts |
| **3D** | Three.js, React Three Fiber |
| **Icons** | Lucide React, Iconify |
| **Notifications** | Sonner |
| **PDF** | jsPDF, html-to-image |
| **Auth** | JWT Decode, js-cookie, cookies-next |
| **Date** | Day.js, date-fns |
| **Containerization** | Docker (multi-stage build) |

---

## Yêu cầu trước khi chạy

- **Node.js** >= 20.x
- **npm** >= 10.x (hoặc yarn / pnpm)
- **Docker** >= 24.x *(nếu chạy bằng Docker)*
- Backend API đang chạy và có thể truy cập

### Biến môi trường

Tạo file `.env.local` tại thư mục gốc dựa theo `.env.example`:

```bash
cp .env.example .env.local
```

**.env.example**
```env
# URL của API Gateway backend
NEXT_PUBLIC_API_URL=http://localhost:8080/

# Secret key dùng để mã hóa dữ liệu nhạy cảm (cookie, localStorage)
NEXT_PUBLIC_CRYPTO_SECRET_KEY=your_secret_key_here
```

---

## Cài đặt

### Cài đặt thông thường

```bash
# 1. Clone repository
git clone https://github.com/your-org/beyond8-client.git
cd beyond8-client

# 2. Cài đặt dependencies
npm install

# 3. Tạo file môi trường
cp .env.example .env.local
# Chỉnh sửa .env.local với các giá trị phù hợp

# 4. Chạy development server
npm run dev
```

Truy cập [http://localhost:3000](http://localhost:3000)

```bash
# Build production
npm run build
npm run start
```

---

### Chạy bằng Docker

#### Development

```bash
docker compose -f docker/docker-compose-dev.yml up --build
```

#### Production

```bash
docker compose -f docker/docker-compose-prod.yml up -d
```

#### Build image thủ công

```bash
docker build -t beyond8-frontend .
docker run -p 3000:5173 \
  -e NEXT_PUBLIC_API_URL=https://api.beyond8.io.vn \
  -e NEXT_PUBLIC_CRYPTO_SECRET_KEY=your_secret \
  beyond8-frontend
```

> Container expose port `5173` bên trong, map ra port tùy ý bên ngoài.

---

## Cấu trúc dự án

```
beyond8-client/
├── app/                          # Next.js App Router
│   ├── (admin)/                  # Route group: Admin
│   │   └── admin/
│   │       ├── dashboard/
│   │       ├── user/
│   │       ├── course/
│   │       ├── category/
│   │       ├── coupon/
│   │       ├── ai-management/
│   │       ├── platform-wallet/
│   │       └── instructor-registration/
│   ├── (auth)/                   # Route group: Xác thực
│   │   ├── login/
│   │   ├── register/
│   │   └── reset-password/
│   ├── (instructor)/             # Route group: Giảng viên
│   │   └── instructor/
│   │       ├── dashboard/
│   │       ├── courses/
│   │       ├── grading/
│   │       ├── question-bank/
│   │       ├── students/
│   │       ├── wallet/
│   │       └── coupon/
│   ├── courses/                  # Marketplace khóa học
│   ├── mybeyond/                 # Dashboard học viên
│   │   ├── mycourse/
│   │   ├── myprofile/
│   │   ├── mycertificate/
│   │   ├── myusage/
│   │   └── payment-history/
│   ├── cart/                     # Giỏ hàng
│   ├── payment/                  # Thanh toán
│   ├── supscription/             # Gói đăng ký
│   ├── landing/                  # Landing page
│   ├── layout.tsx                # Root layout
│   └── globals.css
│
├── components/
│   ├── ui/                       # shadcn/ui base components
│   ├── layout/                   # Header, Footer, Sidebar, Navbar
│   └── widget/                   # Feature widgets (Cart, AI Chat, Dialogs...)
│
├── hooks/                        # Custom React hooks
│
├── lib/
│   ├── api/
│   │   ├── core.ts               # Axios instance + interceptors
│   │   └── services/             # API fetchers theo domain
│   ├── redux/
│   │   ├── store.ts
│   │   └── slices/               # Redux slices (auth,...)
│   ├── providers/                # React context providers
│   ├── realtime/                 # SignalR setup
│   ├── types/                    # TypeScript interfaces
│   └── utils/                    # Helper functions
│
├── utils/                        # Cookie, crypto utilities
├── types/                        # Global type definitions
├── public/                       # Static assets
├── docker/                       # Docker compose files
├── Dockerfile
├── middleware.ts                 # Route protection & role redirect
├── next.config.ts
└── package.json
```

---

## Cách fetch API & Custom Hooks

### Axios Instance (`lib/api/core.ts`)

Toàn bộ HTTP request đi qua một Axios instance duy nhất với:
- **Request interceptor**: tự động đính kèm `Authorization: Bearer <token>` từ Redux store
- **Response interceptor**: xử lý lỗi 401, tự động refresh token và retry request, queue các request đang chờ để tránh race condition

```typescript
// lib/api/core.ts
const apiService = {
  get<T>(url: string, params?: object): Promise<T>
  post<T, D>(url: string, data: D): Promise<T>
  put<T, D>(url: string, data: D): Promise<T>
  patch<T, D>(url: string, data: D): Promise<T>
  delete<T>(url: string): Promise<T>
  upload<T>(url: string, formData: FormData, onProgress?: (pct: number) => void): Promise<T>
}
```

### API Services (`lib/api/services/`)

Mỗi domain có một file fetcher riêng, export các hàm gọi API thuần túy:

```typescript
// lib/api/services/fetchCourse.ts
export const getCourses = (params: CourseParams) =>
  apiService.get<CourseListResponse>('/courses', params)

export const getCourseDetail = (courseId: string) =>
  apiService.get<CourseDetail>(`/courses/${courseId}`)

export const createCourse = (data: CreateCourseDto) =>
  apiService.post<Course, CreateCourseDto>('/courses', data)
```

### Custom Hooks với React Query

Các custom hook trong `hooks/` bọc React Query để cung cấp data fetching có cache, loading state và error handling:

```typescript
// hooks/useCourse.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getCourses, createCourse } from '@/lib/api/services/fetchCourse'

// Query hook — đọc dữ liệu
export const useCourses = (params: CourseParams) => {
  return useQuery({
    queryKey: ['courses', params],
    queryFn: () => getCourses(params),
    staleTime: 60_000,
  })
}

// Mutation hook — ghi dữ liệu
export const useCreateCourse = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] })
    },
  })
}
```

**Sử dụng trong component:**

```tsx
const CourseList = () => {
  const { data, isLoading, error } = useCourses({ page: 1, limit: 10 })
  const { mutate: create, isPending } = useCreateCourse()

  if (isLoading) return <Skeleton />
  if (error) return <ErrorMessage />

  return (
    <>
      {data?.items.map(course => <CourseCard key={course.id} course={course} />)}
      <Button onClick={() => create(newCourseData)} disabled={isPending}>
        Tạo khóa học
      </Button>
    </>
  )
}
```

### Luồng xác thực (Auth Flow)

```
Đăng nhập
  → nhận accessToken + refreshToken
  → lưu vào Redux store (persist sang localStorage) + cookie
  → middleware.ts kiểm tra token và role để redirect đúng dashboard
  → khi token hết hạn: interceptor tự động gọi refresh endpoint
  → đồng bộ đăng xuất giữa các tab qua useAuthSyncAcrossTabs
```

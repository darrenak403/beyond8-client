# Hướng Dẫn Phân Quyền Role-Based Access Control (RBAC)

## Tổng Quan

Project này sử dụng **Role-Based Access Control (RBAC)** để phân quyền truy cập vào các màn hình và chức năng khác nhau. Hệ thống có 3 roles chính: **Admin**, **Saler**, và **User**.

---

## 1. Cấu Trúc Roles

### Định nghĩa Roles

```typescript
// lib/api/services/fetchAuth.ts
export enum Roles {
  Admin = 'Admin',
  Saler = 'Saler',
  User = 'User',
}
```

### Phân cấp quyền

```
Admin (Cao nhất)
  ├── Quản lý toàn bộ hệ thống
  ├── Duyệt bất động sản
  └── Quản lý người dùng

Saler (Trung bình)
  ├── Quản lý bất động sản cá nhân/công ty
  ├── Quản lý khách hàng tiềm năng
  └── Quản lý giao dịch

User (Cơ bản)
  ├── Xem bất động sản
  ├── Tạo lịch hẹn
  └── Liên hệ môi giới
```

---

## 2. Cơ Chế Xác Thực & Phân Quyền

### 2.1. Token-Based Authentication

```typescript
// lib/store/authStore.ts
interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
```

**Flow xác thực:**
1. User login → Backend trả về JWT token
2. Token được lưu vào cookie `auth-token`
3. Token chứa thông tin role trong payload
4. Mỗi request gửi token qua header `Authorization: Bearer <token>`

### 2.2. Middleware Protection

```typescript
// middleware.ts
const getUserRole = (token: string | undefined): string | null => {
  if (!token) return null;
  try {
    const decoded = jwt.decode(token) as { role?: string } | null;
    return decoded?.role ?? null;
  } catch (error) {
    console.error('[AUTH] Failed to decode token:', error);
    return null;
  }
};
```

**Middleware xử lý:**
- Decode JWT token để lấy role
- Kiểm tra quyền truy cập route
- Redirect nếu không có quyền

---

## 3. Route Protection Chi Tiết

### 3.1. Admin Routes

**Pattern:** `/admin/*`

**Quyền truy cập:** Chỉ Admin

**Middleware logic:**
```typescript
const isAdminRoute = pathname.startsWith('/admin/');
if (isAdminRoute) {
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  if (userRole !== 'Admin') {
    return NextResponse.redirect(new URL('/properties', request.url));
  }
}
```

**Các màn hình Admin:**
```
/admin/dashboard          → Dashboard tổng quan
/admin/property           → Quản lý bất động sản (duyệt/từ chối)
/admin/lead               → Quản lý khách hàng tiềm năng
/admin/sales              → Quản lý giao dịch
/admin/admin-chat         → Chat quản trị
/admin/news               → Quản lý tin tức
/admin/profile            → Hồ sơ admin
```

**Redirect logic:**
- Nếu chưa login → `/login`
- Nếu không phải Admin → `/properties`
- Nếu đã login và là Admin truy cập `/login` → `/admin/dashboard`

---

### 3.2. Saler Routes

**Pattern:** `/saler/*`, `/hosting/*`

**Quyền truy cập:** Bất kỳ user đã authenticated (Admin, Saler, User)

**Middleware logic:**
```typescript
const isSalerRoute = pathname.startsWith('/saler/');
const isHostingRoute = pathname === '/hosting';
const isHostingPropertyRoute = pathname.startsWith('/hosting/');

if (isSalerRoute || isHostingRoute || isHostingPropertyRoute) {
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  // Allow any authenticated user to access saler routes
}
```

**Các màn hình Saler:**
```
/saler/dashboard                    → Dashboard cá nhân
/saler/property                     → Quản lý bất động sản cá nhân
/saler/contract                     → Hợp đồng cho thuê
/saler/sales                        → Giao dịch của tôi
/saler/lead                         → Khách hàng tiềm năng
/saler/appointments                 → Lịch hẹn
/saler/company                      → Quản lý công ty
/saler/dashboard-company/:id        → Dashboard công ty
/saler/profile                      → Hồ sơ cá nhân

/hosting                            → Trang chủ hosting
/hosting/property                   → Quản lý property hosting
/hosting/property/new               → Tạo property mới
```

**Redirect logic:**
- Nếu chưa login → `/login`
- Nếu đã login và là Saler truy cập `/login` → `/hosting`

**Lưu ý quan trọng:**
- Saler routes cho phép **tất cả user đã authenticated** truy cập
- Không có hard restriction theo role
- User thường có thể truy cập để đăng tin bất động sản

---

### 3.3. User Routes

**Pattern:** `/properties/*`, `/agents/*`, `/messages/*`, v.v.

**Quyền truy cập:** Public (một số chức năng yêu cầu authentication)

**Các màn hình User:**
```
/                                   → Trang chủ (public)
/properties                         → Danh sách bất động sản (public)
/properties/:id                     → Chi tiết bất động sản (public)
/agents                             → Danh sách môi giới (public)
/company/:id                        → Trang công ty (public)
/seller/:id                         → Trang seller (public)
/news                               → Tin tức (public)

/messages                           → Tin nhắn (require auth)
/appointments                       → Lịch hẹn (require auth)
/myrevo                             → Trang cá nhân (require auth)
/comparison                         → So sánh BĐS (require auth)
```

**Middleware logic cho messages:**
```typescript
const isMessagesRoute = pathname === '/messages' || pathname.startsWith('/messages/');
if (isMessagesRoute) {
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  // Allow any authenticated user to access messages
}
```

---

### 3.4. Auth Routes

**Pattern:** `/login`, `/register`, `/forgot-password`

**Quyền truy cập:** Public (nhưng redirect nếu đã login)

**Middleware logic:**
```typescript
const isAuthRoute = authRoutes.some(
  route => pathname === route || pathname.startsWith(`${route}/`)
);

if (isAuthRoute && token) {
  if (userRole === 'Admin') {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  } else if (userRole === 'Saler') {
    return NextResponse.redirect(new URL('/hosting', request.url));
  } else {
    return NextResponse.redirect(new URL('/properties', request.url));
  }
}
```

**Redirect logic khi đã login:**
- Admin → `/admin/dashboard`
- Saler → `/hosting`
- User → `/properties`

---

## 4. Layout & Sidebar Protection

### 4.1. Admin Layout

```typescript
// app/(admin)/admin/layout.tsx
export default function RootLayout({ children }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <SidebarProvider>
        <AppSidebarAdmin variant="inset" collapsible="icon" />
        {children}
      </SidebarProvider>
    </ThemeProvider>
  );
}
```

**Admin Sidebar Menu:**
- Dashboard
- Bất động sản (duyệt/quản lý)
- Khách hàng tiềm năng
- Sales
- Chat
- Tin tức

### 4.2. Saler Layout

```typescript
// app/(saler)/saler/layout.tsx
export default function RootLayout({ children }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ConditionalSidebarWrapper>{children}</ConditionalSidebarWrapper>
    </ThemeProvider>
  );
}
```

**Saler Sidebar Menu:**
- Tổng quan
- Bất động sản
- Hợp đồng cho thuê
- Giao dịch của tôi
- Khách hàng tiềm năng
- Lịch hẹn
- Tin nhắn
- Công ty

**Conditional Sidebar:**
```typescript
// Chỉ hiển thị sidebar khi KHÔNG ở dashboard-company
const isDashboardCompany = pathname?.includes('/dashboard-company');
if (isDashboardCompany) {
  return <div className="h-screen overflow-hidden">{children}</div>;
}
```

### 4.3. User Layout

```typescript
// app/(user)/layout.tsx
export default function PropertiesLayout({ children }) {
  return (
    <div>
      <Header />
      {children}
    </div>
  );
}
```

**User Header:** Navigation bar với menu public

---

## 5. Client-Side Protection

### 5.1. useAuthStore Hook

```typescript
// hooks/useAuth.ts (custom hook)
import { useAuthStore } from '@/lib/store/authStore';

export function useAuth() {
  const { token, user, isAuthenticated } = useAuthStore();
  
  return {
    token,
    user,
    isAuthenticated,
    role: user?.role,
  };
}
```

### 5.2. Component-Level Protection

**Ví dụ: Ẩn/hiện button theo role**

```typescript
import { useAuthStore } from '@/lib/store/authStore';

export function PropertyCard({ property }) {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'Admin';
  const isSaler = user?.role === 'Saler';
  
  return (
    <div>
      {/* Hiển thị cho tất cả */}
      <PropertyInfo property={property} />
      
      {/* Chỉ Admin mới thấy */}
      {isAdmin && (
        <Button onClick={handleApprove}>Duyệt tin</Button>
      )}
      
      {/* Chỉ Saler/Owner mới thấy */}
      {(isSaler || user?.id === property.saler?.id) && (
        <Button onClick={handleEdit}>Chỉnh sửa</Button>
      )}
    </div>
  );
}
```

### 5.3. Conditional Rendering

**Ví dụ: Redirect trong component**

```typescript
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';

export function ProtectedPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (user?.role !== 'Admin') {
      router.push('/properties');
    }
  }, [isAuthenticated, user, router]);
  
  if (!isAuthenticated || user?.role !== 'Admin') {
    return <div>Loading...</div>;
  }
  
  return <div>Admin Content</div>;
}
```

---

## 6. API Protection

### 6.1. API Service với Token

```typescript
// lib/api/core.ts
export class ApiService {
  private authToken: string | null = null;
  
  setAuthToken(token: string | null): void {
    this.authToken = token;
  }
  
  private setupInterceptors(): void {
    this.client.interceptors.request.use(config => {
      if (this.authToken) {
        config.headers.Authorization = `Bearer ${this.authToken}`;
      }
      return config;
    });
    
    this.client.interceptors.response.use(
      response => response,
      (error: AxiosError) => {
        if (error.response?.status === 401 && this.onAuthError) {
          this.onAuthError(); // Logout khi token hết hạn
        }
        return Promise.reject(error);
      }
    );
  }
}
```

### 6.2. Backend API Routes

**Backend cần implement:**
```
POST /api/auth/login           → Trả về token với role
GET  /api/admin/*              → Require Admin role
GET  /api/saler/*              → Require Saler/Admin role
GET  /api/user/*               → Require authenticated user
```

---

## 7. Áp Dụng Cho Project Khác

### 7.1. Checklist Implementation

**Bước 1: Định nghĩa Roles**
```typescript
// lib/types/roles.ts
export enum Roles {
  Admin = 'Admin',
  Manager = 'Manager',
  User = 'User',
}
```

**Bước 2: Setup Auth Store**
```typescript
// lib/store/authStore.ts
interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}
```

**Bước 3: Tạo Middleware**
```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  const userRole = getUserRole(token);
  
  // Protect admin routes
  if (pathname.startsWith('/admin/')) {
    if (!token) return redirect('/login');
    if (userRole !== 'Admin') return redirect('/');
  }
  
  // Protect manager routes
  if (pathname.startsWith('/manager/')) {
    if (!token) return redirect('/login');
    if (!['Admin', 'Manager'].includes(userRole)) return redirect('/');
  }
  
  return NextResponse.next();
}
```

**Bước 4: Tạo Layout cho từng Role**
```
app/
├── (admin)/
│   └── admin/
│       └── layout.tsx          → Admin layout với sidebar
├── (manager)/
│   └── manager/
│       └── layout.tsx          → Manager layout
└── (user)/
    └── layout.tsx              → User layout
```

**Bước 5: Component Protection**
```typescript
// components/ProtectedComponent.tsx
export function ProtectedComponent({ allowedRoles }) {
  const { user } = useAuthStore();
  
  if (!allowedRoles.includes(user?.role)) {
    return null;
  }
  
  return <YourComponent />;
}
```

### 7.2. Best Practices

✅ **DO:**
- Luôn validate role ở cả client và server
- Sử dụng middleware cho route protection
- Lưu token trong httpOnly cookie (bảo mật hơn)
- Decode token để lấy role thay vì lưu role riêng
- Implement token refresh mechanism
- Log unauthorized access attempts

❌ **DON'T:**
- Chỉ dựa vào client-side protection
- Lưu sensitive data trong localStorage
- Hard-code role strings trong components
- Bỏ qua error handling cho 401/403
- Expose role logic trong URL

### 7.3. Security Considerations

**1. Token Security:**
```typescript
// Lưu token trong httpOnly cookie
setCookie('auth-token', token, {
  httpOnly: true,      // Không thể access từ JavaScript
  secure: true,        // Chỉ gửi qua HTTPS
  sameSite: 'strict',  // CSRF protection
  maxAge: 60 * 60 * 2, // 2 hours
});
```

**2. Role Validation:**
```typescript
// Backend API validation
function requireRole(allowedRoles: Roles[]) {
  return (req, res, next) => {
    const userRole = req.user?.role;
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
}

// Usage
app.get('/api/admin/users', requireRole([Roles.Admin]), getUsers);
```

**3. Audit Logging:**
```typescript
// Log mọi action quan trọng
function auditLog(action: string, userId: string, role: string) {
  console.log(`[AUDIT] ${new Date().toISOString()} - ${role} ${userId} performed ${action}`);
  // Lưu vào database
}
```

---

## 8. Testing Role-Based Access

### 8.1. Test Cases

**Test Admin Access:**
```typescript
describe('Admin Routes', () => {
  it('should allow admin to access /admin/dashboard', async () => {
    const adminToken = generateToken({ role: 'Admin' });
    const response = await fetch('/admin/dashboard', {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    expect(response.status).toBe(200);
  });
  
  it('should deny non-admin access to /admin/dashboard', async () => {
    const userToken = generateToken({ role: 'User' });
    const response = await fetch('/admin/dashboard', {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    expect(response.status).toBe(403);
  });
});
```

**Test Middleware:**
```typescript
describe('Middleware Protection', () => {
  it('should redirect unauthenticated user to login', () => {
    const request = new NextRequest('http://localhost/admin/dashboard');
    const response = middleware(request);
    expect(response.headers.get('location')).toBe('/login');
  });
});
```

---

## 9. Troubleshooting

### Common Issues

**Issue 1: User bị redirect loop**
```
Nguyên nhân: Middleware check role sai hoặc token không được decode đúng
Giải pháp: Log token và role trong middleware để debug
```

**Issue 2: Token hết hạn nhưng không logout**
```
Nguyên nhân: Interceptor không handle 401 properly
Giải pháp: Implement refresh token hoặc force logout on 401
```

**Issue 3: Role không update sau khi thay đổi**
```
Nguyên nhân: Role được cache trong token cũ
Giải pháp: Force re-login hoặc implement token refresh
```

---

## 10. Tổng Kết

### Flow Hoàn Chỉnh

```
1. User Login
   ↓
2. Backend trả về JWT token (chứa role)
   ↓
3. Frontend lưu token vào cookie
   ↓
4. Middleware decode token → lấy role
   ↓
5. Check route permission
   ↓
6. Redirect nếu không có quyền
   ↓
7. Render layout/sidebar theo role
   ↓
8. Component check role để show/hide features
```

### Key Takeaways

- **3 Roles:** Admin, Saler, User
- **Middleware:** Route protection ở server-side
- **Auth Store:** State management cho authentication
- **Layout:** Mỗi role có layout riêng
- **Token:** JWT chứa role information
- **Security:** httpOnly cookie + server validation

---

## Tài Liệu Tham Khảo

- `middleware.ts` - Route protection logic
- `lib/store/authStore.ts` - Authentication state
- `lib/api/core.ts` - API service với token
- `app/(admin)/admin/layout.tsx` - Admin layout
- `app/(saler)/saler/layout.tsx` - Saler layout
- `app/(user)/layout.tsx` - User layout

---

**Lưu ý:** Document này được tạo dựa trên phân tích code thực tế của project. Khi áp dụng cho project khác, cần điều chỉnh theo yêu cầu cụ thể.

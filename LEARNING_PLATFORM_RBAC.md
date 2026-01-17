# Role-Based Access Control - Learning Platform

## Tổng Quan

Learning Platform sử dụng **RBAC** với 3 roles: **Admin**, **Instructor**, và **Student**.

---

## 1. Cấu Trúc Roles

### Định nghĩa Roles

```typescript
// lib/types/roles.ts
export enum Roles {
  Admin = 'Admin',
  Instructor = 'Instructor',
  Student = 'Student',
}
```

### Phân cấp quyền

```
Admin (Cao nhất)
  ├── Quản lý toàn bộ hệ thống
  ├── Quản lý users, instructors, courses
  └── Xem reports và analytics

Instructor (Trung bình)
  ├── Tạo và quản lý courses
  ├── Quản lý students trong course
  ├── Xem analytics của courses
  └── Trả lời messages từ students

Student (Cơ bản)
  ├── Xem danh sách courses (public)
  ├── Enroll vào courses
  ├── Học courses đã enroll
  └── Gửi messages cho instructors
```

---

## 2. Route Protection

### 2.1. Admin Routes

**Pattern:** `/admin/*`

**Quyền:** Chỉ Admin

**Các màn hình:**
```
/admin/dashboard          → Dashboard tổng quan
/admin/users              → Quản lý users
/admin/courses            → Quản lý courses
/admin/instructors        → Quản lý instructors
/admin/reports            → Reports & Analytics
/admin/messages           → Messages
/admin/settings           → Settings
```

**Redirect:**
- Chưa login → `/login`
- Không phải Admin → `/courses`
- Admin login → `/admin/dashboard`

---

### 2.2. Instructor Routes

**Pattern:** `/instructor/*`

**Quyền:** Instructor và Admin

**Các màn hình:**
```
/instructor/dashboard     → Dashboard cá nhân
/instructor/courses       → Quản lý courses của mình
/instructor/students      → Danh sách students
/instructor/schedule      → Lịch dạy
/instructor/analytics     → Analytics courses
/instructor/messages      → Messages từ students
/instructor/settings      → Settings cá nhân
```

**Redirect:**
- Chưa login → `/login`
- Không phải Instructor/Admin → `/courses`
- Instructor login → `/instructor/dashboard`

---

### 2.3. Student Routes

**Pattern:** `/courses`, `/my-learning`, `/student/*`

**Quyền:** Public (courses list) / Authenticated (my-learning)

**Các màn hình:**
```
/                         → Home (redirect theo role)
/courses                  → Danh sách courses (public)
/courses/:id              → Chi tiết course (public)
/my-learning              → Courses đã enroll (require auth)
/student/profile          → Profile (require auth)
/student/certificates     → Certificates (require auth)
```

**Redirect:**
- Student login → `/courses`

---

## 3. Middleware Logic

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value
  const userRole = getUserRole(token)

  // Admin routes - Only Admin
  if (pathname.startsWith('/admin/')) {
    if (!token) return redirect('/login')
    if (userRole !== 'Admin') return redirect('/courses')
  }

  // Instructor routes - Instructor & Admin
  if (pathname.startsWith('/instructor/')) {
    if (!token) return redirect('/login')
    if (userRole !== 'Instructor' && userRole !== 'Admin') {
      return redirect('/courses')
    }
  }

  // Auth routes redirect
  if (isAuthRoute && token) {
    if (userRole === 'Admin') return redirect('/admin/dashboard')
    if (userRole === 'Instructor') return redirect('/instructor/dashboard')
    return redirect('/courses')
  }

  return NextResponse.next()
}
```

---

## 4. Layout Structure

### 4.1. Admin Layout

```typescript
// app/(admin)/admin/layout.tsx
<SidebarProvider>
  <AppSidebarAdmin />
  <main>{children}</main>
</SidebarProvider>
```

**Sidebar Menu:**
- Dashboard
- Users
- Courses
- Instructors
- Reports
- Messages
- Settings

---

### 4.2. Instructor Layout

```typescript
// app/(instructor)/instructor/layout.tsx
<SidebarProvider>
  <AppSidebarInstructor />
  <main>{children}</main>
</SidebarProvider>
```

**Sidebar Menu:**
- Dashboard
- My Courses
- Students
- Schedule
- Analytics
- Messages
- Settings

---

### 4.3. Student Layout

```typescript
// app/(student)/layout.tsx
<Header />
<main>{children}</main>
```

**Header Navigation:**
- Courses
- My Learning
- Profile
- Login/Logout

---

## 5. Custom Hook

```typescript
// hooks/useAuth.ts
export function useAuth() {
  const { user, isAuthenticated } = useAppSelector(selectAuth)
  
  return {
    user,
    isAuthenticated,
    role: user?.role,
    isAdmin: user?.role === Roles.Admin,
    isInstructor: user?.role === Roles.Instructor,
    isStudent: user?.role === Roles.Student,
  }
}
```

**Usage:**
```typescript
const { isAdmin, isInstructor, isStudent } = useAuth()

if (isAdmin) {
  // Show admin features
}
```

---

## 6. Component Protection

```typescript
// Example: Course Card
export function CourseCard({ course }) {
  const { isInstructor, isAdmin, user } = useAuth()
  
  return (
    <div>
      <CourseInfo course={course} />
      
      {/* Instructor/Admin can edit */}
      {(isInstructor || isAdmin) && (
        <Button onClick={handleEdit}>Edit Course</Button>
      )}
      
      {/* Only course owner can delete */}
      {user?.id === course.instructorId && (
        <Button onClick={handleDelete}>Delete</Button>
      )}
    </div>
  )
}
```

---

## 7. Flow Hoàn Chỉnh

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
6. Redirect theo role:
   - Admin → /admin/dashboard
   - Instructor → /instructor/dashboard
   - Student → /courses
   ↓
7. Render layout/sidebar theo role
   ↓
8. Component check role để show/hide features
```

---

## 8. File Structure

```
app/
├── (admin)/
│   └── admin/
│       ├── layout.tsx              → Admin layout với sidebar
│       ├── dashboard/page.tsx
│       ├── users/page.tsx
│       ├── courses/page.tsx
│       └── ...
├── (instructor)/
│   └── instructor/
│       ├── layout.tsx              → Instructor layout với sidebar
│       ├── dashboard/page.tsx
│       ├── courses/page.tsx
│       └── ...
├── (student)/
│   ├── layout.tsx                  → Student layout với header
│   ├── courses/page.tsx
│   └── my-learning/page.tsx
├── login/page.tsx
└── page.tsx                        → Home (redirect theo role)

components/
├── layout/
│   └── header.tsx                  → Header cho student
├── sidebar/
│   ├── app-sidebar-admin.tsx
│   └── app-sidebar-instructor.tsx
└── ui/
    └── ...

lib/
├── types/
│   └── roles.ts                    → Role definitions
├── redux/
│   └── slices/
│       └── authSlice.ts            → Auth state
└── api/
    └── core.ts                     → API service

hooks/
└── useAuth.ts                      → Custom auth hook

middleware.ts                       → Route protection
```

---

## 9. Key Takeaways

- **3 Roles:** Admin, Instructor, Student
- **Middleware:** Server-side route protection
- **Layouts:** Mỗi role có layout riêng
- **Hook:** useAuth() để check role trong components
- **Token:** JWT chứa role information
- **Security:** Cookie-based authentication

---

## 10. Next Steps

1. ✅ Setup middleware với role protection
2. ✅ Tạo layouts cho từng role
3. ✅ Tạo dashboard pages
4. ✅ Tạo sidebar components
5. ✅ Tạo useAuth hook
6. 🔲 Implement login/register pages
7. 🔲 Tạo course management pages
8. 🔲 Implement API integration
9. 🔲 Add more features theo role

---

**Created:** January 17, 2026
**Platform:** Beyond 8 Learning - AI-Powered Learning Platform

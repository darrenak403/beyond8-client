import {NextResponse} from 'next/server'
import type {NextRequest} from 'next/server'
import {jwtDecode} from 'jwt-decode'

// Helper function to get user role from token
const getUserRole = (token: string | undefined): string | null => {
  if (!token) return null
  try {
    const decoded = jwtDecode(token) as {role?: string} | null
    return decoded?.role ?? null
  } catch (error) {
    console.error('[AUTH] Failed to decode token:', error)
    return null
  }
}

export function middleware(request: NextRequest) {
  const {pathname} = request.nextUrl
  const token = request.cookies.get('auth-token')?.value
  const userRole = getUserRole(token)

  // Auth routes
  const authRoutes = ['/login', '/register', '/forgot-password']
  const isAuthRoute = authRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  )

  // Admin routes - Only Admin can access
  const isAdminRoute = pathname.startsWith('/admin/')
  if (isAdminRoute) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    if (userRole !== 'Admin') {
      return NextResponse.redirect(new URL('/courses', request.url))
    }
  }

  // Instructor routes - Only Instructor and Admin can access
  const isInstructorRoute = pathname.startsWith('/instructor/')
  if (isInstructorRoute) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    if (userRole !== 'Instructor' && userRole !== 'Admin') {
      return NextResponse.redirect(new URL('/courses', request.url))
    }
  }

  // Student routes - Require authentication
  const isStudentRoute =
    pathname.startsWith('/student/') ||
    pathname.startsWith('/my-courses') ||
    pathname.startsWith('/my-learning')
  if (isStudentRoute) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Protected routes - Require authentication
  const protectedRoutes = ['/profile', '/settings', '/messages']
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  )
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Redirect authenticated users from auth pages
  if (isAuthRoute && token) {
    if (userRole === 'Admin') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    } else if (userRole === 'Instructor') {
      return NextResponse.redirect(new URL('/instructor/dashboard', request.url))
    } else {
      return NextResponse.redirect(new URL('/courses', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/instructor/:path*',
    '/student/:path*',
    '/my-courses/:path*',
    '/my-learning/:path*',
    '/profile/:path*',
    '/settings/:path*',
    '/messages/:path*',
    '/login',
    '/register',
    '/forgot-password',
  ],
}


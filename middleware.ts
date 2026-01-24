import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtDecode } from 'jwt-decode'

// Helper function to get user role from token
const getUserRole = (token: string | undefined): string | null => {
  if (!token) return null
  try {
    const decoded = jwtDecode(token) as { role?: string } | null
    return decoded?.role ?? null
  } catch (error) {
    console.error('[AUTH] Failed to decode token:', error)
    return null
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('authToken')?.value
  const userRole = getUserRole(token)

  // Public routes - accessible without authentication
  const publicRoutes = [
    '/',
    '/landing',
    '/login',
    '/register',
    '/reset-password',
    '/forgot-password'
  ]

  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  )

  // Auth routes (login, register, etc.)
  const authRoutes = ['/login', '/register', '/reset-password', '/forgot-password']
  const isAuthRoute = authRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  )

  // If user is NOT authenticated
  if (!token) {
    // Allow access to public routes only
    if (isPublicRoute) {
      return NextResponse.next()
    }
    // Redirect all other routes to login
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // If user IS authenticated
  // Redirect from auth pages to appropriate dashboard
  if (isAuthRoute) {
    if (userRole === 'ROLE_ADMIN') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    } else if (userRole === 'ROLE_INSTRUCTOR') {
      return NextResponse.redirect(new URL('/instructor/dashboard', request.url))
    } else {
      return NextResponse.redirect(new URL('/courses', request.url))
    }
  }

  // Admin routes - Only Admin can access
  const isAdminRoute = pathname.startsWith('/admin/')
  if (isAdminRoute && userRole !== 'ROLE_ADMIN') {
    return NextResponse.redirect(new URL('/courses', request.url))
  }

  // Instructor routes - Only Instructor and Admin can access
  const isInstructorRoute = pathname.startsWith('/instructor/')
  if (isInstructorRoute && userRole !== 'ROLE_INSTRUCTOR' && userRole !== 'ROLE_ADMIN') {
    return NextResponse.redirect(new URL('/courses', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|webm|mp4)$).*)',
  ],
}

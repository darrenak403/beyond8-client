import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtDecode } from 'jwt-decode'

// Helper function to get user role from token
const getUserRole = (token: string | undefined): string | null => {
  if (!token) return null
  try {
    const decoded = jwtDecode(token) as { role?: string; exp?: number } | null
    
    // Check if token is expired
    if (decoded?.exp) {
      const currentTime = Math.floor(Date.now() / 1000)
      if (decoded.exp < currentTime) {
        console.error('[AUTH] Token expired')
        return null
      }
    }
    
    return decoded?.role ?? null
  } catch (error) {
    console.error('[AUTH] Failed to decode token:', error)
    return null
  }
}

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl
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

  // If token exists but is invalid/expired (userRole is null)
  if (!userRole) {
    // Clear the invalid token
    const response = NextResponse.redirect(new URL('/login', request.url))
    response.cookies.delete('authToken')
    return response
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

  // Role-based access control
  const isAdminRoute = pathname.startsWith('/admin/')
  const isInstructorRoute = pathname.startsWith('/instructor/')
  const isCoursesRoute = pathname.startsWith('/courses')
  const isMyBeyondRoute = pathname.startsWith('/mybeyond')
  const isInstructorRegistrationRoute = pathname.startsWith('/instructor-registration')

  // ADMIN: Only access admin pages
  if (userRole === 'ROLE_ADMIN') {
    // Admin can only access admin routes
    if (isAdminRoute) {
      return NextResponse.next()
    }
    // Redirect to admin dashboard if trying to access other routes
    return NextResponse.redirect(new URL('/admin/dashboard', request.url))
  }

  // INSTRUCTOR: Can access instructor pages, landing, mybeyond, and specific tabs
  if (userRole === 'ROLE_INSTRUCTOR') {
    // Allow access to instructor routes
    if (isInstructorRoute) {
      return NextResponse.next()
    }

    // Allow access to landing page
    if (pathname === '/' || pathname === '/landing') {
      return NextResponse.next()
    }

    // Allow access to instructor registration
    if (isInstructorRegistrationRoute) {
      return NextResponse.next()
    }

    // Allow access to mybeyond with specific tabs
    if (isMyBeyondRoute) {
      const tab = searchParams.get('tab')
      // Instructor can access: mycourse, myprofile, mywallet
      if (!tab || tab === 'mycourse' || tab === 'myprofile' || tab === 'mywallet') {
        return NextResponse.next()
      }
      // Redirect to myprofile if trying to access other tabs
      return NextResponse.redirect(new URL('/mybeyond?tab=myprofile', request.url))
    }

    // Block access to admin and student-only routes
    if (isAdminRoute) {
      return NextResponse.redirect(new URL('/instructor/dashboard', request.url))
    }

    // Allow courses page access
    if (isCoursesRoute) {
      return NextResponse.next()
    }

    // For any other route, allow access (default behavior)
    return NextResponse.next()
  }

  // STUDENT: Can access student pages, landing, mybeyond (except mywallet)
  if (userRole === 'ROLE_STUDENT') {
    // Block access to admin routes
    if (isAdminRoute) {
      return NextResponse.redirect(new URL('/courses', request.url))
    }

    // Block access to instructor routes (except instructor-registration)
    if (isInstructorRoute) {
      return NextResponse.redirect(new URL('/courses', request.url))
    }

    // Allow access to instructor registration
    if (isInstructorRegistrationRoute) {
      return NextResponse.next()
    }

    // Allow access to landing page
    if (pathname === '/' || pathname === '/landing') {
      return NextResponse.next()
    }

    // Allow access to mybeyond with specific tabs (NO mywallet)
    if (isMyBeyondRoute) {
      const tab = searchParams.get('tab')
      // Student can access: mycourse, myprofile (NOT mywallet)
      if (!tab || tab === 'mycourse' || tab === 'myprofile') {
        return NextResponse.next()
      }
      // Block access to mywallet
      if (tab === 'mywallet') {
        return NextResponse.redirect(new URL('/mybeyond?tab=myprofile', request.url))
      }
      // Redirect to myprofile for any other tab
      return NextResponse.redirect(new URL('/mybeyond?tab=myprofile', request.url))
    }

    // Allow access to courses
    if (isCoursesRoute) {
      return NextResponse.next()
    }

    // For any other route, allow access (student can access their pages)
    return NextResponse.next()
  }

  // If no role or unknown role, redirect to login
  return NextResponse.redirect(new URL('/login', request.url))
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

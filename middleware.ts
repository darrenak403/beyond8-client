import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtDecode } from 'jwt-decode'

// Helper function to get user roles from token
const getUserRoles = (token: string | undefined): string[] => {
  if (!token) return []
  try {
    const decoded = jwtDecode(token) as { role?: string | string[]; exp?: number } | null
    
    // Check if token is expired
    if (decoded?.exp) {
      const currentTime = Math.floor(Date.now() / 1000)
      if (decoded.exp < currentTime) {
        console.error('[AUTH] Token expired')
        return []
      }
    }
    
    // Handle both string and array of roles
    if (!decoded?.role) return []
    return Array.isArray(decoded.role) ? decoded.role : [decoded.role]
  } catch (error) {
    console.error('[AUTH] Failed to decode token:', error)
    return []
  }
}

// Helper to check if user has specific role
const hasRole = (roles: string[], targetRole: string): boolean => {
  return roles.includes(targetRole)
}

// Helper to get primary role for routing
const getPrimaryRole = (roles: string[]): string | null => {
  // Priority order: ADMIN > INSTRUCTOR > STUDENT
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

  // Public routes - accessible without authentication
  const publicRoutes = [
    '/',
    '/landing',
    '/login',
    '/register',
    '/reset-password',
    '/forgot-password',
    '/sitemap.xml'
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
  if (!token || userRoles.length === 0) {
    // Allow access to public routes only
    if (isPublicRoute) {
      return NextResponse.next()
    }
    // Redirect all other routes to login
    const response = NextResponse.redirect(new URL('/login', request.url))
    if (token) response.cookies.delete('authToken')
    return response
  }

  // If user IS authenticated
  // Redirect from auth pages to appropriate dashboard based on primary role
  if (isAuthRoute) {
    if (primaryRole === 'ROLE_ADMIN') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    } else if (primaryRole === 'ROLE_INSTRUCTOR') {
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
  if (hasRole(userRoles, 'ROLE_ADMIN')) {
    if (isAdminRoute) {
      return NextResponse.next()
    }
    // Admin can access other routes if they have multiple roles
    if (userRoles.length > 1) {
      // Allow access to instructor/student routes if they have those roles
      if (isInstructorRoute && hasRole(userRoles, 'ROLE_INSTRUCTOR')) {
        return NextResponse.next()
      }
      if ((isCoursesRoute || isMyBeyondRoute) && hasRole(userRoles, 'ROLE_STUDENT')) {
        return NextResponse.next()
      }
      if (isInstructorRegistrationRoute) {
        return NextResponse.next()
      }
      if (pathname === '/' || pathname === '/landing') {
        return NextResponse.next()
      }
    }
    // Default: redirect to admin dashboard
    if (!isPublicRoute) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    }
  }

  // INSTRUCTOR: Can access instructor pages, landing, mybeyond, and specific tabs
  if (hasRole(userRoles, 'ROLE_INSTRUCTOR')) {
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

    // Block access to admin routes if not admin
    if (isAdminRoute && !hasRole(userRoles, 'ROLE_ADMIN')) {
      return NextResponse.redirect(new URL('/instructor/dashboard', request.url))
    }

    // Allow courses page access
    if (isCoursesRoute) {
      return NextResponse.next()
    }

    // For any other route, allow access
    return NextResponse.next()
  }

  // STUDENT: Can access student pages, landing, mybeyond (except mywallet)
  if (hasRole(userRoles, 'ROLE_STUDENT')) {
    // Block access to admin routes if not admin
    if (isAdminRoute && !hasRole(userRoles, 'ROLE_ADMIN')) {
      return NextResponse.redirect(new URL('/courses', request.url))
    }

    // Block access to instructor routes if not instructor
    if (isInstructorRoute && !hasRole(userRoles, 'ROLE_INSTRUCTOR')) {
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

    // Allow access to mybeyond with specific tabs
    if (isMyBeyondRoute) {
      const tab = searchParams.get('tab')
      // Student can access mycourse, myprofile
      // If instructor, also allow mywallet
      if (!tab || tab === 'mycourse' || tab === 'myprofile') {
        return NextResponse.next()
      }
      if (tab === 'mywallet' && hasRole(userRoles, 'ROLE_INSTRUCTOR')) {
        return NextResponse.next()
      }
      // Block mywallet for non-instructors
      if (tab === 'mywallet') {
        return NextResponse.redirect(new URL('/mybeyond?tab=myprofile', request.url))
      }
      return NextResponse.redirect(new URL('/mybeyond?tab=myprofile', request.url))
    }

    // Allow access to courses
    if (isCoursesRoute) {
      return NextResponse.next()
    }

    // For any other route, allow access
    return NextResponse.next()
  }

  // If no valid role, redirect to login
  const response = NextResponse.redirect(new URL('/login', request.url))
  response.cookies.delete('authToken')
  return response
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

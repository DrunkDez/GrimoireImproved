import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Routes that require authentication
const PROTECTED_ROUTES: string[] = [
  '/dashboard',
  '/character-guide',
  '/characters',
  '/profile',
]

// API routes that require authentication
const PROTECTED_API_ROUTES: string[] = [
  '/api/characters',
  '/api/rotes',
]

// Admin-only routes
const ADMIN_ROUTES: string[] = [
  '/admin',
]

// Admin-only API routes
// Note: /api/merits POST is handled in the API endpoint itself
const ADMIN_API_ROUTES: string[] = [
  // Add other admin API routes here if needed
  // Example: '/api/users', '/api/settings', etc.
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for public assets, Next.js internals, and auth routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/auth') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Get the user's session token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  // Check if route requires authentication
  const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route))
  const isProtectedAPI = PROTECTED_API_ROUTES.some(route => pathname.startsWith(route))
  const isAdminRoute = ADMIN_ROUTES.some(route => pathname.startsWith(route))
  const isAdminAPI = ADMIN_API_ROUTES.some(route => pathname.startsWith(route))

  // Redirect to signin if accessing protected route without token
  if ((isProtectedRoute || isProtectedAPI) && !token) {
    const signInUrl = new URL('/auth/signin', request.url)
    signInUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(signInUrl)
  }

  // Check admin access
  if ((isAdminRoute || isAdminAPI) && !token?.isAdmin) {
    // For API routes, return 403
    if (isAdminAPI) {
      return NextResponse.json(
        { error: 'Forbidden: Admin access required' },
        { status: 403 }
      )
    }
    // For pages, redirect to dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Allow the request to proceed
  return NextResponse.next()
}

// Configure which routes middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

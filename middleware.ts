import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const { pathname } = request.nextUrl

  // المسارات المحمية للمستخدمين العاديين
  const protectedRoutes = ['/profile', '/cart', '/checkout', '/wishlist']
  // مسارات الأدمن
  const adminRoutes = ['/admin']
  // مسارات تسجيل الدخول (يتم تجاوزها إذا كان مسجلاً بالفعل)
  const authRoutes = ['/login', '/signup', '/admin/login']

  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route))
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))
  const isAdminLoginPage = pathname === '/admin/login'

  // 1. إذا كان يحاول دخول صفحة أدمن وهو غير مسجل (وليس في صفحة دخول الأدمن)
  if (isAdminRoute && !token && !isAdminLoginPage) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  // 2. إذا كان يحاول دخول صفحة محمية للمستخدمين وهو غير مسجل
  if (isProtectedRoute && !token) {
    const url = new URL('/login', request.url)
    url.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(url)
  }

  // 3. إذا كان مسجل دخول بالفعل ويحاول دخول صفحات الـ Auth (Login/Signup)
  if (isAuthRoute && token) {
    // إذا كان في مسار أدمن، نتركه يكمل للوحة التحكم
    if (pathname.startsWith('/admin')) {
        return NextResponse.next()
    }
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/profile/:path*',
    '/cart',
    '/checkout',
    '/wishlist',
    '/admin/:path*',
    '/login',
    '/signup',
  ],
}


//  حقيقيxxxxxsssssssؤؤؤؤؤؤ
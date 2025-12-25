import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // دلوقتي السطر ده هيشتغل صح لأنه هيلاقي التوكن اللي AuthContext حطه
  const token = request.cookies.get('token')?.value
  const { pathname } = request.nextUrl

  // 1. الصفحات المحمية (ممنوع دخولها غير للمسجلين)
  // رجعنا /profile هنا لأننا صلحنا المشكلة
  const protectedRoutes = ['/profile', '/cart', '/checkout', '/wishlist']

  // 2. صفحات الأدمن
  const adminRoutes = ['/admin']

  // 3. صفحات الدخول (ممنوع يدخلها لو هو أصلاً مسجل)
  const authRoutes = ['/login', '/signup']

  // فحص المسار الحالي
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  )
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route))
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))

  // -------------------------------------------------------
  // السيناريو الأول: بيحاول يدخل صفحة محمية وهو معهوش توكن
  // -------------------------------------------------------
  if (isProtectedRoute && !token) {
    const url = new URL('/login', request.url)
    // بنحفظ هو كان رايح فين عشان نرجعه تاني بعد ما يسجل دخول (اختياري)
    url.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(url)
  }

  // -------------------------------------------------------
  // السيناريو الثاني: بيحاول يدخل صفحة الأدمن ومش أدمن (أو مش مسجل)
  // -------------------------------------------------------
  if (isAdminRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // -------------------------------------------------------
  // السيناريو الثالث: هو مسجل دخول (معاه توكن) وعايز يروح صفحة اللوجين
  // بنقوله: لا يا ريس أنت مسجل بالفعل، روح الرئيسية
  // -------------------------------------------------------
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

// تحديد الصفحات اللي الميدل وير هيشتغل عليها
export const config = {
  matcher: [
    '/profile/:path*', // 👈 رجعناها هنا عشان نحميها
    '/cart',
    '/checkout',
    '/wishlist',
    '/admin/:path*',
    '/login',
    '/signup',
  ],
}

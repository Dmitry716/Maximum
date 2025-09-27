import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from './lib/auth'
import { UserRole } from './types/enum'

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('access_token')?.value
  const { pathname } = req.nextUrl

  if (!token && pathname.startsWith('/dashboard') || !token && pathname.startsWith('/profile')) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  if (token) {
    const decoded = await verifyToken(token)

    if (!decoded && pathname.startsWith('/dashboard') || !decoded && pathname.startsWith('/profile')) {
      return NextResponse.redirect(new URL('/', req.url))
    }

    if (decoded) {

      if (
        decoded.role === UserRole.EDITOR &&
        pathname.startsWith('/dashboard') &&
        !pathname.startsWith('/dashboard/news') &&
        !pathname.startsWith('/dashboard/blog') &&
        !pathname.startsWith('/dashboard/profile')
      ) {
        return NextResponse.redirect(new URL('/dashboard/news', req.url))
      }

      if (
        decoded.role === UserRole.TEACHER && (
          pathname.startsWith('/dashboard/blog') ||
          pathname.startsWith('/dashboard/users') ||
          pathname.startsWith('/dashboard/categories') ||
          pathname.startsWith('/dashboard/news')
        )
      ) {
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }
      
      if (
        pathname === '/profile' && decoded.role === UserRole.ADMIN ||
        pathname === '/profile' && decoded.role === UserRole.EDITOR ||
        pathname === '/profile' && decoded.role === UserRole.SUPER_ADMIN ||
        pathname === '/profile' && decoded.role === UserRole.TEACHER
      ) {
        return NextResponse.redirect(new URL('/dashboard/profile', req.url))
      }

      if (
        pathname.startsWith('/dashboard') &&
        decoded.role === 'student'
      ) {
        return NextResponse.redirect(new URL('/profile', req.url))
      }

      if (pathname === '/login' || pathname === '/register') {
        if (decoded.role === 'student') return NextResponse.redirect(new URL('/profile', req.url))
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }
    }


  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next|_next/image|api|favicon.ico|sitemap.xml|robots.txt|feed.xml|manifest.json|og-image|logo|seo|public).*)",
  ],
};

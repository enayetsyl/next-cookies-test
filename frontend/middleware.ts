// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const COOKIE_NAME = process.env.JWT_COOKIE_NAME || 'token';

export function middleware(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  const { pathname, searchParams } = req.nextUrl;

  // 1) Protect /dashboard (and subpaths)
  if (pathname.startsWith('/dashboard')) {
    if (!token) {
      const url = new URL('/login', req.url);
      url.searchParams.set('next', pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // 2) Block /login for logged-in users
  if (pathname === '/login') {
    if (token) {
      // if ?next=/something is present, send them there; otherwise /dashboard
      const next = searchParams.get('next');
      const safeNext =
        next && next.startsWith('/') && !next.startsWith('/login') ? next : '/dashboard';
      return NextResponse.redirect(new URL(safeNext, req.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

// Only run on these routes
export const config = {
  matcher: ['/dashboard/:path*', '/login'],
};

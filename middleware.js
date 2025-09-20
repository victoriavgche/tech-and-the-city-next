import { NextResponse } from 'next/server';
import { requireAuth } from './lib/auth';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Protect admin routes (except login)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const session = requireAuth(request);
    
    if (!session) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*']
};

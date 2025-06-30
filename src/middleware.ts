import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get('token')?.value;

  // Define public paths that do not require authentication
  const isPublicPath = 
    path === '/' ||
    path === '/auth/signin' ||
    path === '/auth/signup' ||
    path === '/forgotPassword' ||
    path === '/EmailVerify' ||
    path === '/404';

  // If the user is trying to access a public path
  if (isPublicPath) {
    // If the user is logged in, redirect them to the dashboard
    if (token) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    // Otherwise, allow access
    return NextResponse.next();
  }

  // If the user is trying to access a protected path without a token, redirect to sign-in
  if (!token) {
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }

  // If the user is authenticated and accessing a protected path, allow access
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (public images)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
  ],
}; 
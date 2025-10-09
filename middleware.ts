import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { auth } from '@/auth';

export default auth((req: NextRequest & { auth?: unknown }) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  // Public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/auth/sign-in',
    '/auth/error',
    '/auth/sign-out',
  ];

  // API routes that should be protected
  const protectedApiRoutes = [
    '/api/session',
    '/api/workspace',
  ];

  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isProtectedApiRoute = protectedApiRoutes.some(route =>
    nextUrl.pathname.startsWith(route)
  );
  const isAuthApiRoute = nextUrl.pathname.startsWith('/api/auth');

  // Allow auth API routes always
  if (isAuthApiRoute) {
    return NextResponse.next();
  }

  // Protect API routes
  if (isProtectedApiRoute && !isLoggedIn) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }

  // Redirect unauthenticated users to signin for protected routes
  if (!isLoggedIn && !isPublicRoute) {
    const callbackUrl = nextUrl.pathname + nextUrl.search;
    const signInUrl = new URL('/auth/sign-in', nextUrl.origin);
    signInUrl.searchParams.set('callbackUrl', callbackUrl);
    return NextResponse.redirect(signInUrl);
  }

  // Add security headers to all responses
  const response = NextResponse.next();

  // Security headers for session protection
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');

  // Strict Transport Security for HTTPS in production
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  }

  return response;
});

export const config = {
  matcher: [
    // Match all paths except static files and images
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
